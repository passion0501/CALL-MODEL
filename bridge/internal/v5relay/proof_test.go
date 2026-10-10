package v5relay

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestProof(t *testing.T) {
	dir := t.TempDir()
	c := Credential{Key: "never-persist-this-secret", ProfilePath: filepath.Join(dir, "codex-capability.profile"), RegistrationID: "a", ConfiguredAt: "now"}
	target := filepath.Join(dir, "codex-capability.discovery.json")
	if e := recordProof(c, "initialize", []byte(`{"result":{}}`)); e != nil {
		t.Fatal(e)
	}
	if e := recordProof(c, "tools/list", []byte(`{"result":{}}`)); e != nil {
		t.Fatal(e)
	}
	b, _ := os.ReadFile(target)
	if !strings.Contains(string(b), "tools_listed_at") || strings.Contains(string(b), c.Key) {
		t.Fatal("unsafe marker")
	}
	c.RegistrationID = "b"
	_ = recordProof(c, "tools/call", []byte(`{"result":{"isError":true}}`))
	b, _ = os.ReadFile(target)
	if strings.Contains(string(b), "initialized_at") || strings.Contains(string(b), "last_success_at") {
		t.Fatal("stale success")
	}
	_ = recordProof(c, "tools/call", []byte(`{"result":{}}`))
	b, _ = os.ReadFile(target)
	if !strings.Contains(string(b), "last_success_at") {
		t.Fatal("missing success")
	}
}
