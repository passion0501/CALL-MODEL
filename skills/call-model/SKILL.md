---
name: call-model
description: Use CALL-MODEL through the host's local MCP capability to call an exact INT-AI model name for text, image, video, audio and other supported generation tasks.
---

# CALL-MODEL

CALL-MODEL is a host-neutral capability for calling global model services from the IDE or Agent already in use. It does not replace the host's own login or model settings.

## Install and trigger

Use the host's supported Skill installer with this repository, or load this `SKILL.md` through the host's native Skill flow. Never ask the user to paste an API Key into Skill text, tool arguments, URLs or logs.

Require the user's complete model name. Prefer:

`@CALL-MODEL`

`使用 CALL-MODEL <精准模型名> <任务提示词>`

For example: `使用 CALL-MODEL GPT-IMAGE-2.5-4K，生成一张都市夜景的图。`

Read the model execution contract before submitting. Preserve the exact model name and request fields. If a task was accepted, timed out, disconnected, or has uncertain acceptance, do not submit it again; query the existing task when possible.

## Local MCP

When the host can launch local tools, use the client-maintained `call-model mcp` entry. The V6 client owns the background runtime and current key; the Skill must not read, request, or transmit that key.
