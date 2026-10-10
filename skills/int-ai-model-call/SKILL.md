---
name: int-ai-model-call
description: Read INT-AI model contracts and execute tasks for user-specified exact complete model names through remote MCP, without model recommendation or fuzzy selection.
---

## Connection

This skill is guidance, not an HTTP client. If INT-AI MCP tools are unavailable,
use the package's setup Skill or README for the current host. The fallback at
https://mcp.yqstai.cn/setup?host=codex is plain-text documentation, not an IDE UI.
Each adapter provides registration, recharge, Key creation, local credential
configuration and connection checks. Substitute the actual host ID in that URL.
Never ask the user to put a Key in chat, tool arguments, project files or URLs.
Installing this skill alone cannot enable execution without remote MCP support.

## Execution

1. Require a complete model name explicitly supplied by the user. Never translate
   a family name, nickname or "the second one" into an execution model. If absent
   or unmatched, stop and return https://api.yqstai.cn/pricing with instructions
   to copy the full model name and send it together with the task. No candidate
   confirmation loop, selection state or automatic recommendation.
2. Use `int_ai_get_model_execution` with that exact, case-sensitive name. Select
   the advertised transport ID, or explicitly provide the advertised endpoint
   and method when no ID is available. INT-AI handles downstream protocol conversion.
3. Construct the request body required by the advertised contract. The MCP `model`
   selects the contract; it is NOT automatically injected into `input`. Preserve
   explicit zero, false and unknown provider fields. Do not rename model IDs.
   Always supply explicit `headers`: JSON uses `{"Content-Type":"application/json"}`.
   Raw multipart uses its original Content-Type including the boundary. The thin
   MCP does not infer missing request headers or inject provider parameters.
4. Respect user authorization and any supplied model/cost/count ceiling.
   Installation must disclose that model calls are billed by platform rules;
   providing a full model name does not prove knowledge of price.
   Use `int_ai_execute_model` exactly once. Raw multipart uses `raw_body_base64`
   and explicit Content-Type; v1 has no local-file upload bridge.
5. For an accepted async task, use `int_ai_get_request_result` with the same model,
   transport ID and returned task ID. Do not resubmit to obtain progress.

When timeout, cancellation or broken response leaves submission uncertain, do
not retry, switch models or create a new paid task automatically. Explain the
uncertainty. Resource URLs require the same configured bearer credential; never
append credentials to a URL. Hosts may not display protected binary resources:
describe that limit, rather than claiming a preview or download succeeded.
