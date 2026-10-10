# V5 插件 2.1.0 与独立 OAuth 包

保持名称 `int-ai-model-call`、显示名「模型调用（INT-AI）」、V5 必需文件和默认上海 stable manifest 不变。旧版 1.0.5 及其包保留回滚。

V5 已加密注入凭据 → 独立 Windows 传输桥 → `https://mcp.yqstai.cn/mcp` → INT-AI 平台。V5 不需要换账号；独立用户使用 OAuth 包，复用 INT-AI 网站登录并选择自己的 Key。Key 备用包继续保留。三种入口不修改 Codex 主模型或官方登录。

2.1.0 使用真实 INT Client LOGO、更新的授权指导和显式 Content-Type 指令。V5 包仍是注入凭据入口，不会伪装成能在 stdio 插件列表触发远程 OAuth；官方登录且不使用 V5 的用户应安装 `codex-oauth` 包。不要同时装两个同名模型工具包。

动态支持普通 app 路径、self/releases 安装以及明确的自定义目录；身份或 Key 改变时要求重新连接，避免拿新账号查询旧账号任务。保存的发现标记仅包含注册标识和时间，不包含 Key、提示词或客户文件。

## 重要变化（主版本升级）

工具采用统一的目录、执行契约、原生执行、任务查询四项接口。图片、视频、音频等通过原生执行接口调用，不保留旧 `int_ai_generate_image` 的默认模型/自动参数行为。旧 `capability/execution_mode/request_id` 包装改用契约给出的 `transport_id` 与真实 `task_id`。Skill 已同步说明。

要求完整、精确、区分大小写的模型名；无模型或不匹配就停止，并提供模型广场链接。不会猜模型、默认选择或自动重复收费。不提供旧本地文件上传桥接；需要上传文件的任务不能宣称完整等价于旧版。

目录发现、凭据隔离、远程工具发现和缺失模型防呆已验证。现有 Codex 会话调用 LLM 收费任务返回成功；这不等于新 OAuth 包的登录跳转已经在全部 IDE 实测。Cursor、WorkBuddy 和独立 Codex OAuth 实机验收分别记录。
