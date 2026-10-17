---
name: call-model
description: Use the INT-AI client's local CALL-MODEL MCP capability from an IDE or Agent to call an exact model name for text, image, video, audio and other supported generation tasks.
---

# CALL-MODEL

CALL-MODEL is a local client-assisted capability. The INT-AI V6 client owns the
background runtime and current credential. This Skill never reads, requests,
prints, stores or transmits an API Key.

## Load this Skill

1. Read this file before attempting installation.
2. Prefer the host's native Skill loader with this repository or this raw file:
   `https://raw.githubusercontent.com/passion0501/int-ai-model-call/main/skills/call-model/SKILL.md`
3. Do not require `npx`, Git or a global package. If the host cannot run its
   native Skill loader, load the raw file through the host's own Skill creation
   flow and report that the Skill is loaded.
4. Loading the Skill is not the same as enabling its MCP. Do not claim success
   until the host can see the local CALL-MODEL capability provided by the INT-AI
   client.

## Local MCP check

Use the client-maintained logical entry `call-model mcp` when the host can launch
local tools. Do not search the whole disk, require an absolute install path, or
replace this with any remote connection. If the host cannot see the local entry,
stop and report: `CALL-MODEL Skill 已加载，但 INT-AI 客户端本地运行时尚未就绪`.
Do not fall back to another connection, ask for a Key, or invent another installer.

## Trigger and execution

Require the user's complete exact model name. Prefer:

`@CALL-MODEL`

`使用 CALL-MODEL <精准模型名> <任务提示词>`

Example: `使用 CALL-MODEL GPT-IMAGE-2.5-4K，生成一张都市夜景的图。`

Read the model execution contract before submitting. Preserve the exact model
name and request fields. If a task was accepted, timed out, disconnected, or
has uncertain acceptance, query the existing task when possible and never submit
it again automatically.
