//go:build !windows

// SPDX-License-Identifier: Apache-2.0
package v5relay

import "errors"

func LoadProfile(string) (Credential, error) {
	return Credential{}, errors.New("V5 DPAPI bridge requires Windows")
}
