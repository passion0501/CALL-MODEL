# INT-AI 模型调用

把 INT-AI 模型调用能力接入你已经在用的 AI IDE。无需为了调用模型切换到另一个聊天应用；让当前 Agent 读取模型接口契约、发送任务并查询结果。

**开源客户端工具 + 独立远程 MCP 服务**。这个仓库公开 IDE 适配器、Skill、安装与连接检查工具、V5 凭据桥接代码；线上 MCP 服务和 NEWAPI 内部实现不包含在公开仓库中。外层代码采用 Apache-2.0，服务器不是本仓库的开源交付物。

## 适合做什么

- 在支持 MCP 的 IDE 中，使用 INT-AI 平台可用的图片、视频、语音、文本等模型；具体能力以当前模型执行契约为准。
- 读取模型目录与接口契约，执行用户明确指定的完整模型名，查询已提交任务。
- 独立使用时配置自己的 INT-AI API Key；通过 V5 使用时读取同一 Windows 用户的受保护注入凭据。
- 保留 IDE 本来的官方登录、默认模型和其他 MCP。INT-AI 是额外工具，不是替换 IDE 主模型的登录补丁。

## 一句话安装

把下面这句话交给你的 IDE Agent：

> 请从 https://github.com/passion0501/int-ai-model-call 安装「INT-AI 模型调用」。先阅读 INSTALL.md，根据当前 IDE 选择对应适配器，只合并本工具配置，保留其他设置，引导我在本机安全配置 INT-AI API Key，并检查 MCP 连接。不要修改 IDE 原有登录态、默认模型，也不要自动发起付费任务。

名称检索只是发现方式，不保证所有 IDE 能联网找到或安装。请优先使用上面的官方仓库链接；GitHub 发布不代表进入各 IDE 插件市场。

[安装与 Key 引导](INSTALL.md) · [兼容范围](COMPATIBILITY.md) · [V5 迁移](V5-MIGRATION.md)

## 使用示例

打开 [模型广场](https://api.yqstai.cn/pricing)，复制完整模型名，然后告诉 Agent：

> 使用模型「复制的完整模型名」完成这项任务：……。先读取执行契约和价格信息；需要实际收费时按我明确授权的范围执行。

只提供家族名、简称、“第二个”或没指定模型时，工具停止执行并给出模型广场链接。它不猜意图、不推荐替代模型、不自动降级、不重复提交收费任务。提示词与原生参数由用户的 Agent 依据契约构造；路由、协议转换、权限和计费由 NEWAPI 处理。

## 账户与收费

[注册](https://api.yqstai.cn/register) → [充值](https://api.yqstai.cn/console/topup) → [创建 API Key](https://api.yqstai.cn/console/token)。连接地址固定为 `https://mcp.yqstai.cn/mcp`。

插件外层代码免费；模型调用按 INT-AI 平台规则计费。不要把 Key 发到聊天、GitHub、日志、URL 或项目源码。撤销 Key 后原连接不再拥有调用资格。

## 不做什么

不承诺“全球所有模型”“全部 IDE 完全支持”或“无限额度”；不绕过 IDE 或供应商限制。不负责模型供应商调度、自动选择模型、主模型替换、本地文件上传桥接或 OAuth 登录。受保护二进制结果不保证所有 IDE 能直接预览；流式结果也不保证逐 token 展示。

## 模块与发布

`adapters/` 每个 IDE 独立配置；`skills/` 共享指导；`tools/` 安装和检查；`bridge/` Windows V5 凭据传输。新增 IDE 不需要改服务器执行逻辑。版本包从 Releases 下载，检查 SHA-256，不使用未经审核的主分支内容作自动更新源。

参照公开机制：[Figma MCP guide](https://github.com/figma/mcp-server-guide)、[GitHub MCP installation guides](https://github.com/github/github-mcp-server/tree/main/docs/installation-guides)。这些项目不是 INT-AI 的合作方或背书方。
