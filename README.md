# CALL-MODEL

Current baseline: `2026.10.17-simple-r1`.

CALL-MODEL is a Skill for using the connection configuration maintained by the
INT-AI V6 client. It does not require an IDE plugin, MCP registration, model
catalog, or remote connector.

## Load

Give this URL to the IDE or Agent's native Skill loader:

`https://raw.githubusercontent.com/passion0501/int-ai-model-call/main/skills/call-model/SKILL.md`

Do not require `npx`, Git, or a global package. The complete operating rules are
in `skills/call-model/SKILL.md`.

## Trigger

Use the user's exact complete model name and task, for example:

`使用 CALL-MODEL GPT-IMAGE-2.5-4K，生成一张都市夜景的图。`
