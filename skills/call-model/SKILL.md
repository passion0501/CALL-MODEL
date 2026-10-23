---
name: call-model
description: Use CALL MODEL with the INT-AI Client V6 connection to call a user-specified exact model for text, image, video, audio or other supported tasks from an IDE or Agent. Direct HTTP only, not MCP.
metadata:
  version: 2026.10.23-unified-r1
---

# CALL MODEL

CALL MODEL is a Skill for IDEs and Agents with native Skill support. It uses
the connection maintained by INT-AI Client V6 and sends requests directly over
HTTP. It is not an MCP server, plugin, connector or model catalog.

## Install and enable

Use the host's native Skill mechanism to install and enable `call-model`.
Reading this document alone does not enable a Skill. If this host cannot
persist Skills, explain how to create/enable it and stop before model calls.

Official repository: `https://github.com/passion0501/CALL-MODEL`
Current installation file:
`https://clientdownload.intai.cc/plugins/call-model/stable/SKILL.md`

The repository and download site publish the same version of this file.
Update an existing `call-model` Skill in place, rather than installing a second
copy. Do not use older INT-AI model-call/MCP instructions for this workflow.
Do not install Git, npx, an IDE plugin or MCP to use this Skill.

## Prepare the client and account

Before the first model call, guide the user to:

1. Start INT-AI Client V6 and register/sign in to their INT-AI account.
2. For paid models, ensure the account has sufficient balance.
3. Create or select the main API Key in the client.

Account pages, if needed:
`https://api.intai.cc/register`,
`https://api.intai.cc/consoles/wallet`,
`https://api.intai.cc/consoles/keys`.
The user handles login, top-up and Key selection. Do not perform a top-up,
create a Key or ask the user to paste a Key into chat.

## Read the connection

Before every model request, read the current client-maintained file:
`%LOCALAPPDATA%\INTClientV6\call-model\connection.json`.

Require non-empty `endpoint` and `api_key`. The client writes `endpoint` as
the API base ending in `/v1`, not a complete generation request URL. Append
the documented native endpoint required by the model and task; do not
duplicate `/v1` or POST a generation body to the base URL alone.
Do not guess a model-specific protocol. If its required endpoint or parameters
are unknown, ask for the model's API contract instead of submitting a trial call.

If the file is missing, unreadable, malformed or has no valid endpoint, return:

`CALL MODEL 需要 INT-AI Client V6。当前未发现可用连接文件。是否同意现在执行 https://clientdownload.intai.cc/install.ps1 安装客户端？`

Run that installer only after explicit user agreement. Do not execute a model
task in the installation turn. After installation, ask the user to start the
client, sign in and select a main Key before retrying.

If the file has no usable `api_key`, return:

`请启动 INT-AI Client V6，完成注册/登录、充值（如需付费模型）并创建或选择主密钥，然后重试 CALL MODEL。`

Keep connection paths and the technical identifier `call-model` unchanged.
On hosts without access to this Windows client file, report the unavailable
connection; do not substitute another machine's file or invent credentials.

## Execute the exact requested task

Example: `使用 CALL MODEL GPT-IMAGE-2.5-4K，生成一张都市夜景的图。`
The native Skill identifier is `call-model`; use the host's actual Skill picker
or invocation syntax. Do not promise that every host accepts `@CALL MODEL`.

- Require the user's complete exact model name. Do not list, recommend,
  rename, substitute or downgrade models. Ask if the exact name is missing.
- Use only `endpoint` from the connection file and the model's documented
  native request shape, preserving the user's exact model and task fields.
- Use `api_key` only as the HTTP `Authorization: Bearer ...` header. Read it
  at runtime into the HTTP client; never hardcode its value into code, prompts,
  request bodies, tool arguments, URLs, logs or replies. Do not output the
  connection file. If the host cannot keep it out of model-visible content,
  stop and explain that a safe request cannot be made.
- Never search for, install, start or call MCP tools for CALL MODEL. A direct
  HTTP failure is not permission to fall back to MCP.
- Do not automatically repeat a request after acceptance, timeout,
  disconnection or uncertain acceptance. Query an existing task only when
  its ID and documented query endpoint are known. Otherwise report the
  uncertainty and ask before resubmitting.
- Return the actual result or upstream error. Do not claim completion based
  only on HTTP 200 or a task submission acknowledgement.
