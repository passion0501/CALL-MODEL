---
name: call-model
description: Use the INT-AI client connection file to call a user-specified exact model directly from an IDE or Agent.
---

# CALL-MODEL

## Load

Load this Skill with the host's native Skill loader. The canonical source is:

`https://raw.githubusercontent.com/passion0501/int-ai-model-call/main/skills/call-model/SKILL.md`

Do not require `npx`, Git, a global package, an IDE plugin, or an MCP tool
registration. If the host cannot load a URL, give this file to its own Skill
creation flow.

## Connection

Before every request, read the client-maintained Windows connection file:

`%LOCALAPPDATA%\INTClientV6\call-model\connection.json`

It contains `endpoint` and `api_key`. Use them only for the HTTP request; never
print them, put them in the task text, or send them back to the user. The INT-AI
client updates this file when the user starts the client or changes the active
key. If the file is missing or invalid, report that the INT-AI client is not
ready and do not guess another path or endpoint.

## Request rules

- Use the exact complete model name supplied by the user.
- Do not list models, recommend a model, rename a model, or downgrade to another model.
- If the model name is missing or rejected, ask the user for the exact model name.
- Send the task to the `endpoint` from the connection file and return the upstream result.
- Do not resubmit a request whose acceptance or result is uncertain.

Example:

`使用 CALL-MODEL GPT-IMAGE-2.5-4K，生成一张都市夜景的图。`
