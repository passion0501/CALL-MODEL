// SPDX-License-Identifier: Apache-2.0
package v5relay

import (
	"golang.org/x/sys/windows"
	"os"
	"path/filepath"
	"testing"
	"unsafe"
)

func TestDPAPIProfile(t *testing.T) {
	for _, origin := range []string{"https://api.yqstai.cn", "https://attacker.invalid"} {
		data := []byte(`{"schema_version":1,"base_url":"` + origin + `","access_token":"test-profile-credential","account_id":7}`)
		in := windows.DataBlob{Size: uint32(len(data)), Data: &data[0]}
		var encrypted windows.DataBlob
		if err := windows.CryptProtectData(&in, nil, nil, 0, nil, windows.CRYPTPROTECT_UI_FORBIDDEN, &encrypted); err != nil {
			t.Fatal(err)
		}
		path := filepath.Join(t.TempDir(), "profile")
		err := os.WriteFile(path, unsafe.Slice(encrypted.Data, encrypted.Size), 0600)
		windows.LocalFree(windows.Handle(unsafe.Pointer(encrypted.Data)))
		if err != nil {
			t.Fatal(err)
		}
		got, err := LoadProfile(path)
		if origin == "https://api.yqstai.cn" {
			if err != nil || got.Key != "test-profile-credential" || got.Identity == "" {
				t.Fatal("protected profile not loaded")
			}
		} else if err == nil {
			t.Fatal("foreign profile accepted")
		}
	}
}
