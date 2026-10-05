# ikun-music-desktop-next

一个基于 Electron & Vue 3 的免费音乐查找助手，在 WinUI 3 / Fluent 设计语言基础上重新打磨了界面与设置体系。

本仓库是 [ikunshare/ikun-music-desktop](https://github.com/ikunshare/ikun-music-desktop) 的修改增强版。

## 原作者与致谢

本项目的全部核心功能来自以下原作者与项目，在此一并致谢：

| 项目 | 作者 | 地址 |
| --- | --- | --- |
| LX Music 桌面版（原始项目） | lyswhut | [lyswhut/lx-music-desktop](https://github.com/lyswhut/lx-music-desktop) |
| ikun-music-desktop（本仓库上游） | ikunshare（ikun0014@qq.com） | [ikunshare/ikun-music-desktop](https://github.com/ikunshare/ikun-music-desktop) |

本仓库仅对界面与部分交互做修改，不改变原项目的音乐来源与核心逻辑。软件仍按 Apache-2.0 协议分发，原始版权归上述作者所有。

本仓库维护者：xingnengmao666

## 本版新增与亮点

### Fluent / WinUI 3 视觉重构

- 新增两套内置主题 **Fluent 浅色**、**Fluent 深色**，默认主题改为 Fluent 系列，内置主题共 17 套。
- Windows 端采用 Segoe UI Variable 字体栈，并保留中文字体回退。
- 基础控件全面重绘：按钮、输入框、复选框、标签页、菜单、弹窗、下拉框、模态框统一为 Fluent 控件风格（控件填充色、焦点下划线、圆角、浮出层阴影、模态遮罩）。
- 侧边导航选中态改为 WinUI 3 NavigationView 风格的短强调条。
- 新增一组主题设计变量（`--color-accent`、`--color-card-background`、`--radius-control`、`--shadow-dialog` 等），旧主题不受影响。

### 窗口行为

- Windows 主窗口改为**可调整大小、可最大化**，并设置最小尺寸限制。
- 标题栏新增**最大化 / 还原按钮**，图标随窗口状态自动切换（侧边栏与工具栏两处控制区都有）。
- Windows 11（Build ≥ 22000）启用 Mica 材质与不透明窗口，低版本自动回退。

### 设置页重构

- 设置项由 16 个平铺条目重组为 **10 个分组**：外观、播放、歌词、音源与搜索、列表与下载、同步与开放 API、网络、存储与备份、快捷键、其他。
- 旧版 `?name=SettingXxx` 链接仍可正常跳转，不会失效。
- 新增独立分区：
  - **歌词显示**：翻译 / 罗马音 / 译音互换 / 简繁转换 / 逐字歌词，以及字体缩放、延迟滚动、歌词进度、对齐方式。
  - **音源**：API 源选择与自定义源管理。
  - **缓存与数据**：资源缓存、其他源缓存、歌曲链接缓存、原始歌词缓存、已编辑歌词缓存、列表数据清理。
- 搜索设置并入「搜索覆盖」子项（自动清空搜索框 / 自动清空搜索列表），移除原独立条目。

### 播放体验

- 新增**音量淡入淡出**开关（默认开启）：播放与暂停时做 0.3 秒渐变，避免声音突兀切入切出。

## 下载

前往 [Releases](https://github.com/xingnengmao666/ikun-music-desktop-next/releases) 下载。

目前仅提供 **Windows x64 安装包（Setup）**，其他架构与格式暂不发布。

## 构建

见 [BUILD.md](./BUILD.md)。

## 常见问题

见 [FAQ.md](./FAQ.md)。

## 更新日志

见 [CHANGELOG.md](./CHANGELOG.md)。

## 许可

[Apache License 2.0](./LICENSE)，原始版权归 LX Music（lyswhut）与 ikunshare 所有。
