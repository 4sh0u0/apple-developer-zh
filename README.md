# Apple Developer 账户中文化（油猴脚本）

这个油猴脚本把 [Apple 开发者账户](https://developer.apple.com/account) 里只有英文的页面翻译成简体中文。

## 覆盖范围

| 页面 | 处理方式 |
| --- | --- |
| 账户首页 `/account` | Apple 自带中文版，在页脚语言选择器里选「简体中文」即可，不用本脚本 |
| 证书、标识符、设备、描述文件、密钥、服务配置（`/account/resources/*`） | **本脚本翻译**，包括列表、新建向导、详情页、App ID 的全部功能（Capabilities）列表，以及 WeatherKit 和地图的用量页 |
| CloudKit 控制台、推送通知控制台（`icloud.developer.apple.com`） | 不在范围内，它们是另一个独立应用 |
| App Store Connect | 不需要，它本身支持中文 |

## 安装

1. 在浏览器里安装 [Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/)。
2. 安装脚本，任选一种：
   - **Greasy Fork（推荐）**：打开 [Apple Developer 账户中文化](https://greasyfork.org/scripts/600315)，点「安装此脚本」。以后的更新会自动推送。
   - **GitHub**：打开 [`apple-developer-zh.user.js`](https://github.com/4sh0u0/apple-developer-zh/raw/main/apple-developer-zh.user.js)，扩展会弹出安装确认。
3. 打开 [证书列表](https://developer.apple.com/account/resources/certificates/list)，刷新页面，界面就是中文了。

## 使用

点浏览器工具栏上的油猴图标，在本脚本的菜单里有两个命令：

- **切换中文/英文**：切回英文时会恢复原文，你的选择会被记住。
- **导出未翻译文本**：把当前页面上词典没有收录的英文输出到控制台，并复制到剪贴板。欢迎把结果提到 [Issues](https://github.com/4sh0u0/apple-developer-zh/issues)。

## 翻译原则

- **用 Apple 官方译法**：术语对照 [Apple 开发者账户帮助（中文版）](https://developer.apple.com/cn/help/account/)，例如：
  - provisioning profile 译作「描述文件」
  - Bundle ID 译作「套装 ID」
  - Save 译作「存储」
  - Sign in with Apple 译作「通过 Apple 登录」
  - App Clip 译作「轻 App」
- **保留英文名称**：框架名和产品名不翻译，例如 HealthKit、DriverKit、App Store Connect、Ad Hoc、Developer ID。
- **只用本地词典**：脚本不发起任何网络请求，页面上的团队、证书、设备等信息不会发到外部。

## 开发

运行下面两条命令：

```bash
npm install
npm test
```

`npm test` 依次做三件事：

1. 检查语法。
2. 运行 `test-normalize.mjs`：对纯函数做自测，包括规范化、词典和规则。
3. 运行 `test-dom.mjs`：在 jsdom 里加载真实脚本，验证 DOM 翻译、动态插入和中英切换还原。

### 词典与规则

- **词典**：在脚本的 `// ==DICT START==` 和 `// ==DICT END==` 之间，格式是 JSON，每行一条。
  - 键是页面上原样出现的英文，采集自 2026-10-15 的真实页面。
  - 术语参考 `source/glossary-official.json`。
- **动态文案**：日期、计数、列表等由 `RULES` 里的正则处理。

## 许可证

[MIT](LICENSE)
