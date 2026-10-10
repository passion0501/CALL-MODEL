# INT-AI portable Agent Plugin

This is the portable packaging mechanism, not a universal credential form.
`mcp.json` intentionally contains no credentials or host-specific auth fields.
Use the host's native credential settings before enabling the server. If the
host cannot add credentials to a bundled server, use its dedicated adapter or
plain MCP configuration instead. Do not assume environment expansion is portable.

The shared `setup` Skill provides registration, recharge, Key creation and safe
local configuration. API-Key onboarding and real-client acceptance remain
host-specific. No public marketplace registration has been completed.

Account guide: https://mcp.yqstai.cn/setup

Packaging sources:
- https://developers.openai.com/plugins/build/plugins
- https://agent-plugins.org/schemas/1.0.0/plugin.schema.json
- https://agent-plugins.org/schemas/1.0.0/mcp.schema.json

No model call is made by installation. Run the optional `tools/check.mjs` only
after configuring the local `INT_AI_API_KEY` environment variable.
