// SPDX-License-Identifier: Apache-2.0
package v5relay

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestFramesCredentialsAndNotifications(t *testing.T) {
	frames := []string{`{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18"}}`, `{"jsonrpc":"2.0","method":"notifications/initialized"}`, `{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"example","arguments":{"unknown":0,"flag":false,"input":{"model":"exact"}}}}`}
	index := 0
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		b, _ := io.ReadAll(r.Body)
		if string(b) != frames[index] {
			t.Error("frame altered")
		}
		index++
		if r.Header.Get("Authorization") != "Bearer test-private-value" || r.Header.Get("MCP-Protocol-Version") != "2025-06-18" {
			t.Error("credential/protocol header incorrect")
		}
		if index == 2 {
			w.WriteHeader(202)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		io.WriteString(w, `{"jsonrpc":"2.0","id":1,"result":{}}`)
	}))
	defer server.Close()
	loads := 0
	r := New(func() (Credential, error) {
		loads++
		return Credential{Key: "test-private-value", Identity: "account-A"}, nil
	})
	r.endpoint = server.URL
	var out bytes.Buffer
	if err := r.Run(context.Background(), strings.NewReader(strings.Join(frames, "\n")), &out); err != nil {
		t.Fatal(err)
	}
	if loads != 3 || index != 3 || strings.Count(out.String(), "\n") != 2 || strings.Contains(out.String(), "test-private-value") {
		t.Fatal("transport invariant failed")
	}
}
func TestAccountSwitchAndLogoutNeverSend(t *testing.T) {
	for _, logout := range []bool{false, true} {
		sent, loads := 0, 0
		s := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			sent++
			w.Header().Set("Content-Type", "application/json")
			io.WriteString(w, `{"jsonrpc":"2.0","id":1,"result":{}}`)
		}))
		r := New(func() (Credential, error) {
			loads++
			if loads > 1 && logout {
				return Credential{}, errors.New("private failure")
			}
			identity := "A"
			if loads > 1 {
				identity = "B"
			}
			return Credential{Key: "private-credential", Identity: identity}, nil
		})
		r.endpoint = s.URL
		var out bytes.Buffer
		frame := `{"jsonrpc":"2.0","id":1,"method":"tools/list"}`
		if err := r.Run(context.Background(), strings.NewReader(frame+"\n"+frame), &out); err != nil {
			t.Fatal(err)
		}
		s.Close()
		if sent != 1 || strings.Contains(out.String(), "private-credential") || !strings.Contains(out.String(), "no request submitted") {
			t.Fatal("account boundary failed")
		}
	}
}
func TestRedirectAndCredentialEchoRejected(t *testing.T) {
	for _, redirect := range []bool{true, false} {
		sent := 0
		s := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			sent++
			if redirect {
				w.Header().Set("Location", "http://127.0.0.1:1")
				w.WriteHeader(307)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]any{"result": "secret-test-value"})
		}))
		r := New(func() (Credential, error) { return Credential{Key: "secret-test-value", Identity: "A"}, nil })
		r.endpoint = s.URL
		var out bytes.Buffer
		if err := r.Run(context.Background(), strings.NewReader(`{"jsonrpc":"2.0","id":1,"method":"tools/list"}`), &out); err != nil {
			t.Fatal(err)
		}
		s.Close()
		if sent != 1 || strings.Contains(out.String(), "secret-test-value") || !strings.Contains(out.String(), "error") {
			t.Fatal("no-retry/secrecy failed")
		}
	}
}
