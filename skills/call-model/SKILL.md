---
name: call-model
description: Use CALL MODEL and the INT-AI client connection file to call a user-specified exact model directly from an IDE or Agent.
metadata:
  version: 2026.10.23-unified-r2
---

# CALL MODEL

This is the simplified direct-HTTP connection. It does not use MCP, a local
MCP process, a plugin registration, a connector, or a model catalog.

## Mandatory first-use gate

Before doing any CALL MODEL work, actually load and enable this Skill with the
host's native Skill mechanism. Reading the text is not the same as installing
or enabling it. If the host cannot persist Skills, stop and tell the user to
create/enable the Skill before continuing. Do not execute a model request until
the host confirms that the Skill is loaded.

This Skill is authoritative for this workflow. Do not search for, start,
install, register, or call MCP tools, including `int_ai_*` tools. Do not fall
back to MCP when direct HTTP is unavailable. Stop and report the direct-HTTP
failure instead.

## Load

Load this Skill with the host's native Skill loader. The canonical source is:

`https://raw.githubusercontent.com/passion0501/CALL-MODEL/main/skills/call-model/SKILL.md`

Do not require `npx`, Git, a global package, an IDE plugin, or an MCP tool
registration. If the host cannot load a URL, give this file to its own Skill
creation flow.

## First-use account setup

Before the first model request, guide the user through the INT-AI account
prerequisites instead of waiting for an insufficient-quota response:

1. Register or sign in: `https://api.intai.cc/register`
2. For paid models, top up first: `https://api.intai.cc/consoles/wallet`
3. Create or select an API Key: `https://api.intai.cc/consoles/keys`
4. Start INT-AI Client V6 and select the main key.

The user completes these actions in the INT-AI console. Do not create a Key,
charge an account, or request the Key in chat.

## Connection

Before every request, read the client-maintained Windows connection file:

`%LOCALAPPDATA%\INTClientV6\call-model\connection.json`

It contains `endpoint` and `api_key`. Use `api_key` only as the HTTP
`Authorization: Bearer ...` header. Never put it in prompt text, system or
developer text, JSON body, tool arguments, shell scripts, URLs, logs, or a
reply. The request body must contain only the exact model name and the user's
task fields. The INT-AI client updates this file after login, key creation, key
selection, and key changes.

If the file is missing or invalid, do not guess another path or endpoint.
Return this fixed guidance:

`CALL MODEL 需要 INT-AI Client V6。当前未发现可用连接文件。是否同意现在执行 https://clientdownload.intai.cc/install.ps1 安装客户端？`

Only execute the installer after the user explicitly agrees. After installation
or when the file exists but has no usable `api_key`, stop and return:

`请启动 INT-AI Client V6，完成注册/登录、充值（如需付费模型）并创建或选择主密钥，然后重试 CALL MODEL。`

## Request rules

- Use the exact complete model name supplied by the user.
- Do not list models, recommend a model, rename a model, or downgrade to another model.
- If the model name is missing or rejected, ask the user for the exact model name.
- Send the task directly to the `endpoint` from the connection file with the
  `Authorization` header described above and return the upstream result.
- Never generate a command or script containing the real `api_key`; use a
  host/runtime HTTP header facility whenever available. If the host cannot
  keep the header separate from model-visible text, stop and report that the
  host cannot perform a safe CALL MODEL request.
- Do not resubmit a request whose acceptance or result is uncertain.

Example:

`使用 CALL MODEL GPT-IMAGE-2.5-4K，生成一张都市夜景的图。`
