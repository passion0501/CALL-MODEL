// SPDX-License-Identifier: Apache-2.0
package main

import (
	"context"
	"fmt"
	"int-ai-mcp/internal/v5relay"
	"os"
	"path/filepath"
)

func main() {
	root := os.Getenv("INT_CLIENT_DATA")
	if root == "" {
		fmt.Fprintln(os.Stderr, "Start using the V5 adapter launcher; the protected profile root was not discovered.")
		os.Exit(1)
	}
	path := filepath.Join(root, "state", "codex-capability.profile")
	relay := v5relay.New(func() (v5relay.Credential, error) { return v5relay.LoadProfile(path) })
	if relay.Run(context.Background(), os.Stdin, os.Stdout) != nil {
		fmt.Fprintln(os.Stderr, "V5 MCP bridge stopped; no automatic replay.")
		os.Exit(1)
	}
}
