# 安装与 API Key 配置

## 先选择入口

1. 读取 `adapters/<当前IDE>/adapter.json` 中的官方来源、配置形式、认证方式及 `instructions`。不要把另一种 IDE 的配置文件强行套用。
2. 优先下载 GitHub Releases 对应 IDE 的版本 ZIP 并核对 SHA-256。安装包已固定 Skill 版本。
3. 支持插件的 IDE 按原生插件流程安装；只支持 MCP 的 IDE 合并其配置；Skill 单独安装不等于 MCP 已连接。不要自动改默认模型或官方登录。
4. 在 IDE 的本机原生凭据界面或私有配置填入自己的 Key。有些 IDE 没有插件内 Key 表单，不能承诺点击插件就出现输入框。
5. 注册、充值、创建 Key 入口分别为 https://api.yqstai.cn/register 、https://api.yqstai.cn/console/topup 、https://api.yqstai.cn/console/token 。

## Codex 独立用户

安装 `codex` 包，按其原生插件流程加载。`bearer_token_env_var` 指向 `INT_AI_API_KEY`：在本机用户环境或启动环境中私下设置该变量，然后重新启动 Codex 使其读取。不要在对话中提供 Key，不修改主模型认证配置。Setup Skill 提供指导，不是自定义密码输入 UI。

## V5 用户

正常使用 V5 原有插件更新/注入入口；默认分发地址保持 `https://clientdownload.yqstai.cn/plugins/int-ai-model-call/stable/manifest.json`。V5 包和独立 Codex 包是两种认证入口，不要同名重复安装。

V5 Windows 桥读取同一用户 DPAPI 加密的现有配置；无需另填 Key。不自动从别的用户或账号取凭据。自定义安装目录由 `INT_CLIENT_DATA` 或 `INT_AI_CLIENT_EXE` 明确指定，普通目录自动探测。

## 可选安全安装脚本

Node.js 20+。脚本默认只预览，不接受 Key；只支持适配器列明的 JSON 配置客户端。实际路径取决于你的 IDE 和安装范围，不要猜路径。

```sh
git clone https://github.com/passion0501/int-ai-model-call.git
cd int-ai-model-call
node tools/install.mjs cursor /实际路径/mcp.json
# 核对预览后：
node tools/install.mjs cursor /实际路径/mcp.json --apply
```

JSONC、TOML 或客户端原生连接器请按对应文档操作，脚本不会强制改写。脚本仅管理自己的 `int-ai` 配置项；有冲突会停止，保存备份和所有权记录；卸载需要同一记录并保留用户后续修改。

## 检查、更新、卸载

本机私下配置 `INT_AI_API_KEY` 后可运行 `node tools/check.mjs`，只做授权、初始化与工具发现，不收费、不提交模型任务。V5 使用其状态检查和实际 MCP 连接检查。

缺失 Key：先配置；无效或撤销：创建/替换 Key；余额不足：充值；权限不足：检查 Key 权限。工具参数中永远不填 Key。

更新只更换选定适配器的不可变包；保留旧包以便回滚。卸载优先用 IDE 原生功能；脚本安装的 JSON 配置可运行同一命令加 `--remove --apply`，仅移除拥有且未被修改的条目。不要删除整个 MCP 配置目录。
