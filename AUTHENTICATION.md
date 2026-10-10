# INT-AI 连接认证与客户端差异

状态：共同远程 OAuth 服务已部署；账号绑定与所有权、一次性兑换等自动化安全测试通过。旧 Key/V5 入口兼容。各客户端的原生登录跳转仍需独立实机验收，不把协议测试当成全部宿主实测。

主流程复用现有 INT-AI 账号登录，登录后选择/创建本人 Key、确认授权并返回 IDE；不另建账号密码登录 UI。首次登录在新标签页使用现有登录页，原授权页检测成功后继续。创建 Key 和充值也使用现有控制台，不自动创建或扣费。手动 Key 为备用配置方式。

共同远程地址 `https://mcp.yqstai.cn/mcp`。支持标准认证发现、公共客户端注册、PKCE S256、短期授权凭据和轮换刷新；模型参数、任务、路由、计费仍由平台处理。客户端不会获取原始 Key；INT-AI 服务端加密保管用户明确授权的 Key，并可撤销授权。**这是 Key 委托连接，不是账号单点登录，也不是免费模型调用。**

每个适配器的 `oauth.json` 独立版本，旧 Key 配置不被修改。不要给 OAuth 配置追加旧 Authorization 请求头，否则可能无法触发原生授权。

| 客户端 | 原生认证/引导 | 目前验收级别 |
|---|---|---|
| Codex | 原生插件/MCP 连接；CLI `codex mcp login int-ai`；共享网页复用账号登录并选择 Key | 配置/协议验证；独立原生 OAuth 待实机 |
| Cursor | MCP Connect，桌面回环/网页固定回调独立维护 | 官方机制核对；待实机 |
| WorkBuddy | 内置 OAuth 管理器；私有协议/回环；手填 Key 是另一个独立 token 包 | 官方机制核对；待实机/平台接入 |
| Claude Code | `/mcp` 身份验证 | 官方机制核对；待实机 |
| Gemini CLI | `/mcp auth int-ai`，需要本地浏览器；回调 issuer 一致 | 官方机制核对；待实机 |
| VS Code | 原生 MCP 认证；Agent Host 与交互 inputs 不混用 | 官方机制核对；待实机 |
| Windsurf / Devin Desktop | 官方页面已迁移，按实际客户端版本测试 OAuth | 官方机制核对；待实机 |
| Zed | 无 Authorization 头的远程配置触发 OAuth；ACP 另验收 | 官方机制核对；待实机 |
| Cline | CLI 官方菜单有 OAuth；IDE 扩展按实际版本验证 | CLI 机制核对；扩展待验收 |
| OpenCode | V1/V2 配置结构不同；V1 包不标 V2 兼容 | 官方机制核对；待实机 |
| Roo Code | 先保留已有 Key 配置，不凭 MCP 支持推定 OAuth | Key 配置验证；OAuth 待核实 |
| 豆包 | 官方开放平台正在内测，需入驻；未公开确认可由普通用户直接安装任意仓库 OAuth 插件 | 入口确认；未做平台申请/未适配 |
| Trae / 火山方舟 | 与豆包普通 App 是不同产品；不共用支持结论 | 分别待核实 |

豆包事实来源：[官方开放平台](https://open.doubao.com/)；其公开页面明确为内测/入驻意向入口，不能由此承诺“豆包 App 已适配”。WorkBuddy 规范见 [官方连接器文档](https://open.workbuddy.cn/docs/connector)。Figma 参照 [远程安装说明](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/)；它使用共同服务与分客户端安装，也不是任何 IDE 任意装包就自动能登录。

所有适配器使用同一账号授权页，给出注册、充值、创建 Key、收费说明、客户端自报身份警告、取消和返回入口。主流程在 `api.yqstai.cn` 选择自己的 Key，不填写原始 Key；手动备用只在 `mcp.yqstai.cn` 安全授权页或宿主私有配置填写，不能发到聊天、工具参数或 URL。推荐专用限额 Key。

本地退出/删除 MCP 配置不等于服务端撤销。标准撤销端点撤销整条授权；撤销原 Key 会阻止后续模型调用。已经被平台接受的模型任务不会因断开客户端而自动取消或退款。安装后仅验证工具发现，不自动提交收费任务。
