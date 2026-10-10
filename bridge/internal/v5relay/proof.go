// SPDX-License-Identifier: Apache-2.0
package v5relay

import (
	"encoding/json"
	"os"
	"path/filepath"
	"time"
)

// Matches the documented V5 discovery marker. No keys or request bodies are saved.
func recordProof(c Credential, method string, response []byte) error {
	if c.ProfilePath == "" || (c.RegistrationID == "" && c.ConfiguredAt == "") {
		return nil
	}
	var reply struct {
		Error  json.RawMessage `json:"error"`
		Result struct {
			IsError bool `json:"isError"`
		} `json:"result"`
	}
	if json.Unmarshal(response, &reply) != nil || len(reply.Error) > 0 {
		return nil
	}
	target := filepath.Join(filepath.Dir(c.ProfilePath), "codex-capability.discovery.json")
	marker := map[string]string{}
	old, _ := os.ReadFile(target)
	_ = json.Unmarshal(old, &marker)
	if marker == nil {
		marker = map[string]string{}
	}
	matches := c.RegistrationID != "" && marker["registration_id"] == c.RegistrationID || c.RegistrationID == "" && marker["profile_configured_at"] == c.ConfiguredAt
	if !matches {
		marker = map[string]string{"registration_id": c.RegistrationID, "profile_configured_at": c.ConfiguredAt}
	}
	now := time.Now().UTC().Format(time.RFC3339)
	switch method {
	case "initialize":
		marker["initialized_at"] = now
	case "tools/list":
		marker["tools_listed_at"] = now
	case "tools/call":
		marker["tool_called_at"] = now
		if !reply.Result.IsError {
			marker["last_success_at"] = now
		}
	default:
		return nil
	}
	data, err := json.Marshal(marker)
	if err != nil {
		return err
	}
	// Same-user DPAPI directory already exists. Atomic replacement avoids partial markers.
	f, err := os.CreateTemp(filepath.Dir(target), ".int-ai-proof-*")
	if err != nil {
		return err
	}
	name := f.Name()
	defer os.Remove(name)
	if err = f.Chmod(0600); err == nil {
		_, err = f.Write(data)
	}
	closeErr := f.Close()
	if err != nil {
		return err
	}
	if closeErr != nil {
		return closeErr
	}
	return os.Rename(name, target)
}
