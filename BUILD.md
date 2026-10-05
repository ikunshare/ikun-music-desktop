# 手动编译指南

本文说明如何在本机手动编译并打包 ikun-music-desktop。

## 1. 先理解构建方式

这个项目**不使用 Visual Studio 编译**。仓库里没有 `.sln`，也没有 MSBuild 工程文件，VS IDE 无法打开或编译本项目。

实际的构建链路是：

| 产物 | 工具 | 说明 |
| --- | --- | --- |
| `dist/` | webpack 5 | 编译 main / renderer / renderer-lyric / renderer-scripts 四个 target |
| `build/` | electron-builder | 把 `dist/` 和运行时依赖打成安装包或绿色包 |
| `better_sqlite3.node` | node-gyp（MSVC） | 原生模块，必须与 Electron 的 ABI 匹配 |

Visual Studio 在整个流程中的**唯一作用**，是提供 MSVC 编译器和 Windows SDK，供 node-gyp 编译原生模块。你不需要打开 VS，也不需要停留在 VS 命令行里——node-gyp 会通过 `vswhere` 自动定位安装路径。

仓库中共有三个模块含 `binding.gyp`：

- `better-sqlite3` —— 没有预编译包，**必须编译**，且必须针对 Electron 编译
- `bufferutil` —— 用 `prebuildify --napi` 提供预编译包，运行时由 `node-gyp-build` 直接加载，**无需编译**
- `utf-8-validate` —— 同上

因此，安装 VS 的唯一理由是 `better-sqlite3`。

## 2. 环境要求

- Node.js >= 22
- npm >= 8.5.2
- Python 3.x（node-gyp 依赖）
- Visual Studio Build Tools（见下一节）

### 安装 Visual Studio

推荐安装 **Visual Studio 2026 Stable 通道**（Community 或 Build Tools 版本），不要使用 Insiders 通道。

Insiders 的版本号格式为 `18.<Minor> Insiders <BuildNumber>`，node-gyp 与 vswhere 解析这种字符串更容易出错，且 MSVC 预览工具链本身存在变动，编译单个原生模块没有任何收益。

安装时至少勾选以下组件：

- 「使用 C++ 的桌面开发」工作负载
- MSVC v143 或更高版本的生成工具
- Windows 10/11 SDK

### 关键：node-gyp 版本

Visual Studio 2026 对应内部版本 **18.x**，而 node-gyp 直到 **12.1.0** 才加入对它的检测。本仓库当前锁定的 node-gyp 版本低于该要求：

```
node_modules/node-gyp            -> 11.5.0
@electron/rebuild@4.0.3 依赖声明 -> "node-gyp": "^11.2.0"
```

如果不升级，node-gyp 会直接报错并终止编译：

```
Could not find any Visual Studio installation to use
```

解决办法是在 `package.json` 的 `overrides` 中强制提升 node-gyp 版本：

```json
"overrides": {
  "node-gyp": "^13.1.0"
}
```

保存后重新执行 `npm i` 使覆盖生效。

从「x64 Native Tools Command Prompt for VS 2026」中运行、依靠 `VSINSTALLDIR` 或 `VCINSTALLDIR` 环境变量绕过检测的做法，据 node-gyp 相关 issue 反馈**仍然失败**，不要依赖它。设置 `GYP_MSVS_VERSION=2026` 同样无效，因为 11.x 版本的检测代码中根本不存在 VS18 分支。

## 3. 安装依赖

```bash
npm i
```

`postinstall` 会自动执行 `electron-builder install-app-deps`。

如果 Electron 二进制下载失败（国内网络常见），改用仓库提供的代理脚本：

```bash
npm run up
```

该脚本通过 `http://127.0.0.1:2081` 代理下载，请按需修改 `package.json` 中的端口。

## 4. 编译

### 完整流程

```bash
npm run pack
```

等价于依次执行：

```bash
node build-config/pack.js                    # 编译 webpack
node build-config/build-pack.js target=win arch=x64 type=setup   # 打包
```

注意 `build-config/pack.js` 会先清空 `dist/` 和 `build/` 两个目录，里面原有的内容会被删除。

### 分步执行

```bash
# 1. 重建原生模块（仅针对 better-sqlite3）
npm run rebuild

# 2. 编译 webpack 四个 target，产物进入 dist/
npm run build

# 3. 打包，产物进入 build/
npm run pack:win:setup:x64
```

如需单独编译某个 target：

```bash
npm run build:main
npm run build:renderer
npm run build:renderer-lyric
npm run build:renderer-scripts
```

主题文件（`src/common/theme/createThemes.js`、`index.json`）有改动时，在编译前重新生成：

```bash
npm run build:theme
```

### 手动编译原生模块

如果需要绕开 electron-builder，单独编译 `better-sqlite3`：

```bash
cd node_modules/better-sqlite3
npx node-gyp rebuild \
  --runtime=electron \
  --target=37.6.1 \
  --arch=x64 \
  --dist-url=https://electronjs.org/headers
```

`--runtime=electron` 和 `--target=37.6.1` **必须带上**。省略时会按当前 Node 的 ABI 编译，产出的 `.node` 放进 Electron 会报：

```
NODE_MODULE_VERSION mismatch
```

`--target` 的值必须与 `package.json` 中 `devDependencies.electron` 的版本一致，升级 Electron 后同步修改。

产物路径：`node_modules/better-sqlite3/build/Release/better_sqlite3.node`

## 5. 打包目标

| 命令 | 产物 |
| --- | --- |
| `npm run pack:win:setup:x64` | Windows x64 NSIS 安装包 |
| `npm run pack:win:setup:x86` | Windows x86 NSIS 安装包 |
| `npm run pack:win:setup:arm64` | Windows arm64 NSIS 安装包 |
| `npm run pack:win:portable:x64` | Windows x64 便携版 |
| `npm run pack:win:7z:x64` | Windows x64 绿色包（7z） |
| `npm run pack:win7:setup:x64` | Windows 7 兼容安装包 |
| `npm run pack:dir` | 只输出解包目录，不打安装包 |
| `npm run pack:linux` | Linux 各格式（deb / rpm / AppImage / pacman） |
| `npm run pack:mac` | macOS dmg |

调试打包问题时优先用 `npm run pack:dir`，速度最快。

## 6. 其他脚本

```bash
npm run dev      # 开发模式，带热重载
npm run lint     # ESLint 检查，不产出文件
npm run lint:fix # ESLint 自动修复
```

`npm run lint` 只做静态检查，不会生成任何构建产物。

## 7. 常见问题

### `Could not find any Visual Studio installation to use`

两种情况：

1. 没有安装 VS，或安装时未勾选 C++ 工作负载。
2. node-gyp 版本过低，不认识 VS 2026。按第 2 节升级 node-gyp。

确认 vswhere 能否识别 VS：

```bash
"C:/Program Files (x86)/Microsoft Visual Studio/Installer/vswhere.exe" -latest -products '*' \
  -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath
```

有路径输出说明 VS 装好了，问题出在 node-gyp 版本。

### `node-gyp failed to rebuild 'node_modules/bufferutil'`

`bufferutil` 本不需要编译。它通过 `prebuilds/win32-x64/bufferutil.node` 提供 N-API 预编译包，运行时由 `node-gyp-build` 加载，并有纯 JS 的 `fallback` 兜底。

出现这个错误说明 electron-builder 的自动重建流程被整体触发了。若临时没有 VS 环境，可在 `build-config/build-pack.js` 的配置对象中加入：

```js
npmRebuild: false,
```

代价是 electron-builder 不再重建任何原生模块，打包前必须手动执行 `npm run rebuild`，否则 `better-sqlite3` 的 ABI 可能与 Electron 不匹配。**仅在确知 `better_sqlite3.node` 已是正确的 Electron 版本时才可使用。**

### `NODE_MODULE_VERSION mismatch`

`better_sqlite3.node` 是按 Node 的 ABI 编译的，不是按 Electron。执行 `npm run rebuild`，或按第 4 节的手动命令带上 `--runtime=electron --target=<electron 版本>` 重新编译。

### Electron 二进制下载失败

改用 `npm run dp` / `npm run up`（走本地代理），或设置 `ELECTRON_MIRROR` 环境变量指向国内镜像。
