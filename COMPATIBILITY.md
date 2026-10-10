# 兼容范围

所有下列适配器使用同一远程 MCP，没有各自的模型执行实现。

| 客户端 | 提供形式 | 当前验证级别 |
|---|---|---|
| Codex | 原生插件、远程 MCP、Setup Skill | 配置和协议验证；新版真实客户端验收待完成 |
| Cursor | 原生插件清单、MCP、Skill | 配置验证；真实客户端验收待完成 |
| WorkBuddy | 远程 MCP 连接器、token schema、说明 | 配置验证；真实客户端验收待完成 |
| Claude Code、Gemini CLI | 独立清单与 MCP 配置 | 配置验证；未实机测试 |
| VS Code、Windsurf、Cline、Roo Code、Zed、OpenCode | 各自独立 MCP 配置和说明 | 配置验证；未实机测试 |
| V5 Windows 凭据桥 | 动态目录探测、DPAPI 凭据、远程 MCP | 桥接与协议检查；不等同于 Codex 原生会话验收 |
| 豆包普通 App | 无确认的远程 MCP 入口 | 不宣称支持 |

每个 `adapters/<id>/adapter.json` 保存官方文档来源、认证形式、安装说明、版本与限制。没有实测版本时不得写“完整支持”；清单生成成功也不代表宿主已收录或市场上架。

不同 IDE 的凭据输入界面、Skill 加载和受保护资源展示有差异。每个适配器均提供注册→充值→创建 Key→配置→连接检查路径；不能凭空增加宿主不存在的 UI。
