// SPDX-License-Identifier: Apache-2.0
// Package v5relay transports MCP frames, not model/provider requests.
package v5relay

import (
	"bufio"
	"bytes"
	"context"
	"crypto/tls"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

const Endpoint = "https://mcp.yqstai.cn/mcp"

type Credential struct {
	Key, Identity                             string
	ProfilePath, RegistrationID, ConfiguredAt string
}
type Loader func() (Credential, error)
type Relay struct {
	Load     Loader
	Client   *http.Client
	endpoint string
}

func New(load Loader) *Relay {
	transport := http.DefaultTransport.(*http.Transport).Clone()
	transport.Proxy = nil
	transport.ForceAttemptHTTP2 = false
	transport.TLSNextProto = map[string]func(string, *tls.Conn) http.RoundTripper{}
	transport.Protocols = new(http.Protocols)
	transport.Protocols.SetHTTP1(true)
	transport.TLSClientConfig = &tls.Config{MinVersion: tls.VersionTLS12, NextProtos: []string{"http/1.1"}}
	return &Relay{Load: load, endpoint: Endpoint, Client: &http.Client{Transport: transport, Timeout: 5 * time.Minute, CheckRedirect: func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse }}}
}

// Run reloads the DPAPI profile for every frame. Switching accounts requires a
// new MCP session: a previous paid task must never be queried with another Key.
func (r *Relay) Run(ctx context.Context, input io.Reader, output io.Writer) error {
	scanner := bufio.NewScanner(input)
	scanner.Buffer(make([]byte, 4096), 24<<20)
	identity, protocol := "", ""
	for scanner.Scan() {
		frame := append([]byte(nil), scanner.Bytes()...)
		var meta struct {
			JSONRPC string          `json:"jsonrpc"`
			ID      json.RawMessage `json:"id"`
			Method  string          `json:"method"`
			Params  struct {
				Protocol string `json:"protocolVersion"`
			} `json:"params"`
		}
		if json.Unmarshal(frame, &meta) != nil || meta.JSONRPC != "2.0" || meta.Method == "" {
			return errors.New("invalid MCP frame")
		}
		respond := func(message string) error {
			if len(meta.ID) == 0 {
				return nil
			}
			b, _ := json.Marshal(map[string]any{"jsonrpc": "2.0", "id": meta.ID, "error": map[string]any{"code": -32000, "message": message}})
			_, err := output.Write(append(b, '\n'))
			return err
		}
		credential, err := r.Load()
		if err != nil || credential.Key == "" || credential.Identity == "" {
			if err = respond("V5 credential unavailable: open V5 and configure the current account; no request submitted."); err != nil {
				return err
			}
			continue
		}
		if identity != "" && identity != credential.Identity {
			if err = respond("V5 account or Key changed: restart this MCP connection; no request submitted."); err != nil {
				return err
			}
			continue
		}
		if identity == "" {
			identity = credential.Identity
		}
		if meta.Method == "initialize" {
			protocol = meta.Params.Protocol
		}
		req, err := http.NewRequestWithContext(ctx, http.MethodPost, r.endpoint, bytes.NewReader(frame))
		if err != nil {
			return errors.New("MCP request construction failed")
		}
		// Disable transparent HTTP replays, including requests carrying idempotency headers.
		req.GetBody = nil
		req.Close = true
		req.Header.Set("Authorization", "Bearer "+credential.Key)
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Accept", "application/json, text/event-stream")
		if protocol != "" {
			req.Header.Set("MCP-Protocol-Version", protocol)
		}
		response, err := r.Client.Do(req)
		if err != nil {
			if err = respond("MCP transport failed; submission outcome may be unknown. Do not automatically repeat paid calls."); err != nil {
				return err
			}
			continue
		}
		body, readErr := io.ReadAll(io.LimitReader(response.Body, (32<<20)+1))
		response.Body.Close()
		if response.StatusCode == http.StatusAccepted && len(meta.ID) == 0 {
			continue
		}
		if readErr != nil || len(body) > 32<<20 || response.StatusCode != http.StatusOK || !strings.HasPrefix(response.Header.Get("Content-Type"), "application/json") || !json.Valid(body) || strings.Contains(string(body), credential.Key) {
			if err = respond(fmt.Sprintf("MCP response unavailable or rejected (HTTP %d); do not automatically repeat paid calls. Check V5 authentication and service health.", response.StatusCode)); err != nil {
				return err
			}
			continue
		}
		if len(meta.ID) != 0 {
			// Record transport discovery only, never a model request or credential.
			_ = recordProof(credential, meta.Method, body)
			if _, err = output.Write(append(bytes.TrimSpace(body), '\n')); err != nil {
				return err
			}
		}
	}
	return scanner.Err()
}
