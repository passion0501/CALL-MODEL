# 仅添加 MCP 连接器的使用方式

支持远程 HTTP MCP 的宿主可以连接 https://mcp.yqstai.cn/mcp，不必额外安装 Skill 才能获得基本工具使用说明。MCP0.2.4 在初始化说明、四个工具描述和参数描述中提供通用中英文指引；某些宿主不展示初始化说明，所以每个工具也有独立指引。

## 认证与会话

在宿主自己的认证设置中配置 Key，或完成其原生 OAuth。连接器自动携带认证；Agent 不需要读取或知道 Key 的存放位置，也不应在聊天中索取 Key。业务工具的 headers 参数不接受 Authorization。

连接设置显示成功、发现四个工具后，还要在目标对话中启用或选择该连接器。设置连接成功不等于当前会话已经获得工具。工具缺失时只报告并引导启用/重新连接，不使用网页抓取、脚本或直连 HTTP 替代。

## 基本调用顺序

1. 用户指定完整模型名和任务，直接调用 int_ai_get_model_execution；无需搜索整个目录、抓模型广场网页或猜接口。
2. 检查结果 status，解析原始 body 字符串内的 JSON。成功的执行契约在 data 中；以其 transports 和请求约定为准。
3. 使用契约提供的 transport_id，或精确 endpoint 与 method，构造一次 int_ai_execute_model。顶层 model 不会自动补入 input；请求里的 model、messages/prompt/input 等按契约填写。JSON 显式传 Content-Type: application/json。工具参数不填任何 Key。
4. 异步任务只用原 model、task_id 及原提交契约的 transport_id 或 endpoint/method 调用 int_ai_get_request_result；服务使用契约声明的任务查询路径。不得重新提交生成任务。
5. 只有用户要求查询目录时才用 int_ai_search_models。目录搜索不是精确模型认证，不能授权自动选型。模型名缺失或不可用时给出 https://api.yqstai.cn/pricing，让用户复制完整名称及任务；契约查询异常时停止并说明错误。

执行可能收费，遵守用户授权次数与预算。超时、断连或结果不明时不要自动重试。HTTP401/403 引导宿主认证设置；429 是限流；503 是服务不可用。只报告真实工具响应，不把未认证网络探测当作推理成功。

创建 Key：https://api.yqstai.cn/consoles/keys

充值：https://api.yqstai.cn/consoles/wallet

## 豆包接入证据与限制

2026-10-10 用户截图确认：其豆包客户端可手动创建 HTTP 连接器，配置 URL 和认证 Header，启用并发现四个 INT-AI 工具。该路径不等于官方完整插件、Skill 自动加载或插件库上架；尚未确认该设备会话完成真实模型推理。

可尝试从该连接器的「在对话中试用」入口创建测试对话。服务更新后需要宿主重新连接/刷新工具元数据；保留原认证，不在聊天发送 Key。宿主必须把工具提供给会话并正确执行，通用指引不是所有客户端行为保证。
