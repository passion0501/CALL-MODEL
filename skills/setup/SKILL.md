---
name: setup
description: Guide first-time INT-AI MCP installation and credential configuration using the current IDE's official settings and local secret entry, without receiving the user's API Key.
---

Identify the host and consult its packaged `adapter.json` and `README.md`.
Do not invent an embedded form or assume a plugin marketplace listing exists.

Give all users these links without requiring them to send credentials:

- Register: https://api.yqstai.cn/register
- Recharge: https://api.yqstai.cn/console/topup
- Create Key: https://api.yqstai.cn/console/token

Codex and Cursor: guide the user to configure `INT_AI_API_KEY` locally, then
restart the IDE so it inherits that environment. Show only the packaged template,
never the resolved environment value. WorkBuddy: its token connector uses the
native password form and a help link, documented from 4.23.0; marketplace/local
import availability still requires platform/client acceptance. VS Code's input
prompt applies to the extension host, not automatically to Agent Host sessions.
Other hosts: use their independently packaged instructions and credential method.

After configuration, check native MCP connection status and tool discovery.
Explain that paid model requests are billed by platform rules. Users must supply
the exact complete model name with their task. The model square is available at
https://api.yqstai.cn/pricing; public login requirements depend on platform policy.
Optional `tools/check.mjs` reads the local environment and verifies authorization,
initialization and tool names without model execution. Never read the secret into
model context, print it, pass it as a command argument, or ask to paste it in chat.

Explain missing/invalid/revoked/forbidden keys and insufficient-balance results
using the platform links. A successful connection check is not a paid model test
and not complete real-client acceptance. Do not make a paid request as an install
test. Installing a Skill alone cannot provide model execution.
