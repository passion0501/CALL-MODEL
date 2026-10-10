// SPDX-License-Identifier: Apache-2.0
// This implements the documented V5 profile format; no V5 business code is imported.
package v5relay

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"golang.org/x/sys/windows"
	"net/url"
	"os"
	"unsafe"
)

func LoadProfile(path string) (Credential, error) {
	unavailable := errors.New("V5 protected credential unavailable")
	encrypted, err := os.ReadFile(path)
	if err != nil || len(encrypted) == 0 || len(encrypted) > 1<<20 {
		return Credential{}, unavailable
	}
	source := windows.DataBlob{Size: uint32(len(encrypted)), Data: &encrypted[0]}
	var result windows.DataBlob
	if windows.CryptUnprotectData(&source, nil, nil, 0, nil, windows.CRYPTPROTECT_UI_FORBIDDEN, &result) != nil {
		return Credential{}, unavailable
	}
	defer windows.LocalFree(windows.Handle(unsafe.Pointer(result.Data)))
	plain := unsafe.Slice(result.Data, result.Size)
	defer clear(plain)
	var profile struct {
		SchemaVersion  int    `json:"schema_version"`
		BaseURL        string `json:"base_url"`
		AccessToken    string `json:"access_token"`
		AccountID      int    `json:"account_id"`
		RegistrationID string `json:"registration_id"`
		ConfiguredAt   string `json:"configured_at"`
	}
	if json.Unmarshal(plain, &profile) != nil || profile.SchemaVersion != 1 || len(profile.AccessToken) < 8 {
		return Credential{}, unavailable
	}
	origin, err := url.Parse(profile.BaseURL)
	if err != nil || origin.Scheme != "https" || origin.Host != "api.yqstai.cn" || origin.User != nil || origin.RawQuery != "" || origin.Fragment != "" || (origin.Path != "" && origin.Path != "/") {
		return Credential{}, unavailable
	}
	// Account/profile identity includes the Key without recording it on disk.
	sum := sha256.Sum256(plain)
	return Credential{Key: profile.AccessToken, Identity: hex.EncodeToString(sum[:]), ProfilePath: path, RegistrationID: profile.RegistrationID, ConfiguredAt: profile.ConfiguredAt}, nil
}
