# CALL MODEL 安装与更新

唯一当前安装入口：

https://raw.githubusercontent.com/passion0501/CALL-MODEL/main/skills/call-model/SKILL.md

官方仓库：https://github.com/passion0501/CALL-MODEL

使用宿主原生 Skill 安装器将当前文件安装为 `call-model`，并实际启用。
已安装时原位更新，不创建第二份技能。若宿主不能持久化 Skill，请手动创建/启用后再调用模型。

先启动 INT-AI Client V6、注册/登录、准备付费模型所需余额，并创建或选择主密钥。
客户端缺失时，只有用户明确同意后才执行 https://clientdownload.intai.cc/install.ps1 。
安装完成后先让用户启动客户端并完成账户准备，不在安装回合执行模型任务。

调用示例：`使用 CALL MODEL <完整精准模型名> <任务需求>`。
Skill 标识 `call-model`、下载路径和连接文件路径保持稳定；展示名称为 CALL MODEL。
不安装 MCP，不修改 IDE 官方登录、默认模型或其他技能配置，不索取或输出 API Key。

下载站和 GitHub Skill 必须同版本同哈希。当前分发不提供历史 MCP/V5 技能及安装说明。
