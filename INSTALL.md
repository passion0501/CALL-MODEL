# 安装、账号授权与 API Key 备用配置

## 先选择入口

1. 优先读取 `adapters/<当前IDE>/oauth.json` 的官方来源和指令；不支持 OAuth 时才使用 `adapter.json` Key 备用配置。不要套用其他 IDE 配置。
2. 优先下载 GitHub Releases 对应 IDE 的版本 ZIP 并核对 SHA-256。安装包已固定 Skill 版本。
3. 支持插件的 IDE 按原生插件流程安装；只支持 MCP 的 IDE 合并其配置；Skill 单独安装不等于 MCP 已连接。不要自动改默认模型或官方登录。
4. OAuth 包不放静态 Authorization 头。在原生 MCP 设置点击连接/身份验证，跳转现有 INT-AI 网站，复用账号登录，选择自己的 Key 并授权。首次登录在新标签完成，原授权页自动检测后继续。插件列表不是自定义 Key 表单。
5. 注册、充值、创建 Key 入口分别为 https://api.yqstai.cn/register 、https://api.yqstai.cn/console/topup 、https://api.yqstai.cn/console/token 。

## Codex 独立用户

安装 Releases 的 `codex-oauth` 包，按原生插件流程加载并连接。也可以直接配置远程 MCP：

```sh
codex mcp add int-ai --url https://mcp.yqstai.cn/mcp
codex mcp login int-ai
```

CLI 与桌面插件是两种安装入口，不要重复安装同一服务。需要共享 Skill 时，使用完整插件包。原生 UI 位置随宿主版本变化，不保证安装后无操作就弹窗。

手动备用：旧 `codex` Key 包的 `bearer_token_env_var` 为 `INT_AI_API_KEY`，只在本机启动环境配置。账号授权流程与 Key 包不能混装，否则静态凭据可能阻止原生 OAuth 触发。

## V5 用户

正常使用 V5 原有插件更新/注入入口；默认分发地址保持 `https://clientdownload.yqstai.cn/plugins/int-ai-model-call/stable/manifest.json`。V5 包和独立 Codex 包是两种认证入口，不要同名重复安装。

V5 Windows 桥读取同一用户 DPAPI 加密的现有配置；无需另填 Key。不自动从别的用户或账号取凭据。自定义安装目录由 `INT_CLIENT_DATA` 或 `INT_AI_CLIENT_EXE` 明确指定，普通目录自动探测。

## 可选安全安装脚本

Node.js 20+。脚本默认只预览，不接受 Key；只支持适配器列明的 JSON 配置客户端。实际路径取决于你的 IDE 和安装范围，不要猜路径。

```sh
git clone https://github.com/passion0501/int-ai-model-call.git
cd int-ai-model-call
node tools/install.mjs cursor /实际路径/mcp.json --oauth
# 核对预览后：
node tools/install.mjs cursor /实际路径/mcp.json --oauth --apply
```

JSONC、TOML 或客户端原生连接器请按对应文档操作，脚本不会强制改写。脚本仅管理自己的 `int-ai` 配置项；有冲突会停止，保存备份和所有权记录；卸载需要同一记录并保留用户后续修改。

## 检查、更新、卸载

OAuth 使用宿主原生工具列表检查，不要导出连接 token。Key 备用包本机配置后可运行 `node tools/check.mjs`，只做授权、初始化与工具发现，不收费。V5 使用其状态检查和 MCP 连接检查。

缺失 Key：先配置；无效或撤销：创建/替换 Key；余额不足：充值；权限不足：检查 Key 权限。工具参数中永远不填 Key。

更新只更换选定适配器的不可变包；保留旧包以便回滚。卸载优先用 IDE 原生功能；脚本安装的 JSON 配置可运行同一命令加 `--remove --apply`，仅移除拥有且未被修改的条目。不要删除整个 MCP 配置目录。
