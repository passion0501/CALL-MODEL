# CALL MODEL

CALL MODEL 是一个 Skill，让支持原生 Skill 的 IDE / Agent 通过 INT-AI Client V6 提供的连接直接调用指定模型，支持文本、图片、视频、语音等任务，具体以模型实际接口为准。

官方仓库：[passion0501/CALL-MODEL](https://github.com/passion0501/CALL-MODEL)。
技术标识与技能目录始终为 `call-model`。

## 安装

将下面的提示词交给 IDE / Agent：

> 请使用当前宿主的原生 Skill 安装机制，安装并启用 CALL MODEL（技能标识 call-model）：https://raw.githubusercontent.com/passion0501/CALL-MODEL/main/skills/call-model/SKILL.md 。已有同名技能时原位更新，不要重复安装；不要只阅读或总结。启用后按 Skill 完成客户端与账户准备。不要安装或调用 MCP，不要索取或输出 API Key。安装本身不授权收费调用。

仓库中的 `skills/call-model/SKILL.md` 是维护源，下载站是同版本发布副本；两者内容和 SHA-256 必须一致。客户端的安装引导、前端与后端兜底提示词由同一份源文件生成。

## 使用

1. 启动 INT-AI Client V6，注册/登录 INT-AI 账户。
2. 付费模型调用前准备余额，创建或选择主密钥。
3. 在 IDE / Agent 中启用 CALL MODEL，提供完整精准模型名及任务。

例如：`使用 CALL MODEL GPT-IMAGE-2.5-4K，生成一张都市夜景的图。`

具体技能选择方式以宿主为准，不保证所有宿主支持相同的 @ 语法。Skill 每次调用前读取 Windows 客户端维护的 `%LOCALAPPDATA%\INTClientV6\call-model\connection.json`；不能访问该文件的宿主不能直接使用这条连接。不要把连接文件或 Key 发到聊天。

CALL MODEL 直接使用 HTTP，不依赖 MCP、IDE 插件、OAuth 适配器、npx 或克隆仓库。模型协议不明时先确认接口；不得猜测模型、替换模型或自动重复提交不确定的收费请求。

本仓库仅发布 CALL MODEL 当前 Skill、安装引导和公开说明，不包含服务器核心、凭据、历史 MCP/V5 安装包或旧技能副本。旧 Git 历史不是当前安装说明，不应从历史提交安装。
