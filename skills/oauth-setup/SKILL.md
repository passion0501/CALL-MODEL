---
name: oauth-setup
description: Connect the independent INT-AI remote MCP using the current host's native OAuth flow, with registration and API Key guidance without receiving secrets in chat.
---

Read the installed package's adapter and README. Use the actual installation root
provided by the host; never construct a cache path from a username or assume the
plugin name appears only once in the cache layout. A Skill alone is not an MCP
connection and cannot submit model requests.

Independent OAuth packages contain only the remote URL; do not add the old
Authorization header or INT_AI_API_KEY environment reference to those configs.
Open the host-native MCP authentication/Connect action. The host discovers
INT-AI authorization endpoints and redirects to the existing INT-AI account
website at api.yqstai.cn. Reuse its current login/session; do not create a
separate plugin username/password form. A first login opens the existing login
page in a separate tab; the authorization tab checks login and then continues.
Never invent a custom form inside the Codex/Cursor plugin list. Never read or
change the IDE's main login or provider settings.

The browser page provides:
- Register: https://api.yqstai.cn/register
- Recharge: https://api.yqstai.cn/console/topup
- Create Key: https://api.yqstai.cn/console/token

Tell the user to select their own Key by its name and masked suffix, review
the requesting client's self-declared identity/callback and paid-call consent,
then authorize and return to their IDE. INT-AI account login is reused, while
the IDE receives a separate delegated OAuth connection token, not the original
Key or the website session. INT-AI stores the Key encrypted on its private server.
Key input at mcp.yqstai.cn is an explicit fallback only; host-private manual Key
configuration remains available in the independently versioned Key adapters.
Recommend a dedicated limited Key. Never ask for a Key in chat or tool arguments.

Follow the selected host's instructions for refresh, reconnect and logout.
Local logout is not necessarily server revocation. Revoking the original Key
stops later use; already accepted tasks are not automatically canceled/refunded.
Check connection and four INT-AI tool names without paid execution. Missing or
unmatched exact model names must return https://api.yqstai.cn/pricing and stop;
no model substitution, fuzzy recommendation or candidate confirmation state.

429 means throttled, not an invalid Key; 503 means the authorization service is
unavailable. Do not delete credentials, increase wait time or automatically
resubmit paid tasks to conceal these errors. Separate another device's status
from this device; collect only sanitized installation/version/tool-discovery
facts, not secrets or private user requests.

V5 injection packages remain a separate credential transport to the same remote
service. Do not overwrite their DPAPI profile or remove them to repair an OAuth
package. Doubao open-platform admission is not ordinary-app plugin support.
Configuration/protocol validation is not real-host acceptance.
