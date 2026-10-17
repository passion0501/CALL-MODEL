# CALL-MODEL

CALL-MODEL 是 INT-AI 客户端维护的本地 MCP 能力。IDE 或 Agent 只需读取本仓库的 Skill，由本机 INT-AI 客户端提供运行时。本仓库不提供远程连接器、账号注册、充值、Key 创建或历史适配器。

## 安装

把下面这句话交给当前 IDE / Agent：

> 请读取并加载 https://raw.githubusercontent.com/passion0501/int-ai-model-call/main/skills/call-model/SKILL.md。优先使用你自己的原生 Skill 流程，不要要求 npx、Git 或全局安装包。加载完成后检查 INT-AI 客户端提供的本地 `call-model mcp`；如果本地入口不可见，只报告客户端运行时尚未就绪，不要切换到其他连接方式。

Skill 已加载不等于本地 MCP 已就绪。客户端负责后台安装、更新和启动运行时。

## 使用

要求用户提供完整、精确的模型名：

`@CALL-MODEL`

`使用 CALL-MODEL <精准模型名> <任务提示词>`

示例：`使用 CALL-MODEL GPT-IMAGE-2.5-4K，生成一张都市夜景的图。`

## 安全边界

不要索取、读取、输出或传输 API Key。不要搜索全盘、猜绝对安装路径、修改 IDE 原有登录态，也不要在本 Skill 中添加其他连接地址。如果本地入口不可见，应报告客户端运行时未就绪，不得自行改用其他连接方式。
