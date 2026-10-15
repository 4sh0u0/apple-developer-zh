// ==UserScript==
// @name         Apple Developer 账户中文化
// @namespace    https://github.com/4sh0u0/apple-developer-zh
// @version      1.0.0
// @description  把 Apple 开发者账户里只有英文的「证书、标识符和描述文件」等页面翻译成简体中文；采用 Apple 官方译法，纯本地词典，不发起任何网络请求。
// @author       4sh0u0
// @license      MIT
// @homepageURL  https://github.com/4sh0u0/apple-developer-zh
// @supportURL   https://github.com/4sh0u0/apple-developer-zh/issues
// @match        https://developer.apple.com/account*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// ==/UserScript==

(function () {
  'use strict';

  // ───────────────────────── 词典（可被脚本机器替换） ─────────────────────────
  // 要求：JSON 兼容；键值均为双引号；每行一条；末条无逗号；键使用直引号与单空格。
  // ==DICT START==
  const DICT = {
    "Apple Developer": "Apple 开发者",
    "View Membership": "查看会员资格",
    "Account Help": "开发者账户帮助",
    "Xcode Help": "Xcode 帮助",
    "Downloads": "下载",
    "Support": "支持",
    "Certificates, Identifiers & Profiles": "证书、标识符和描述文件",
    "Certificates": "证书",
    "Identifiers": "标识符",
    "Devices": "设备",
    "Profiles": "描述文件",
    "Keys": "密钥",
    "Services": "服务",
    "Copyright ©": "版权所有 ©",
    "Apple Inc. All rights reserved.": "Apple Inc. 保留一切权利。",
    "Terms of Use": "使用条款",
    "Privacy Policy": "隐私政策",
    "Search": "搜索",
    "Show search": "显示搜索",
    "Copy to Clipboard": "拷贝到剪贴板",
    "All Types": "所有类型",
    "Development": "开发",
    "Production": "生产",
    "Cloud managed": "云管理式",
    "Name": "名称",
    "Type": "类型",
    "Platform": "平台",
    "Created By": "创建者",
    "Expiration": "到期日期",
    "Apple Push Services": "Apple 推送服务",
    "All": "全部",
    "iOS Distribution": "iOS 分发",
    "Distribution Managed": "云管理式分发",
    "Developer ID Application": "Developer ID 应用程序",
    "Add new certificate": "添加新证书",
    "All Certificates": "所有证书",
    "Create a New Certificate": "创建新证书",
    "Continue": "继续",
    "Software": "软件",
    "Apple Development": "Apple 开发",
    "Sign development versions of your iOS, iPadOS, macOS, tvOS, watchOS, and visionOS apps.": "为你的 iOS、iPadOS、macOS、tvOS、watchOS 和 visionOS App 的开发版本签名。",
    "Apple Distribution": "Apple 分发",
    "Sign your iOS, iPadOS, macOS, tvOS, watchOS, and visionOS apps for release testing using Ad Hoc distribution or for submission to App Store Connect.": "为你的 iOS、iPadOS、macOS、tvOS、watchOS 和 visionOS App 签名，以便通过 Ad Hoc 分发进行发布测试，或提交至 App Store Connect。",
    "iOS App Development": "iOS App 开发",
    "Sign development versions of your iOS app.": "为你的 iOS App 的开发版本签名。",
    "iOS Distribution (App Store Connect and Ad Hoc)": "iOS 分发 (App Store Connect 和 Ad Hoc)",
    "Sign your iOS, iPadOS, watchOS, and visionOS apps for submission to App Store Connect or for Ad Hoc distribution.": "为你的 iOS、iPadOS、watchOS 和 visionOS App 签名，以便提交至 App Store Connect 或进行 Ad Hoc 分发。",
    "Mac Development": "Mac 开发",
    "Sign development versions of your Mac app.": "为你的 Mac App 的开发版本签名。",
    "Mac App Distribution": "Mac App 分发",
    "This certificate is used to code sign your app and configure a Distribution Provisioning Profile for submission to the Mac App Store Connect.": "此证书用于为你的 App 进行代码签名，并配置用于提交至 Mac App Store Connect 的分发预置描述文件。",
    "Mac Installer Distribution": "Mac 安装器分发",
    "This certificate is used to sign your app's Installer Package for submission to the Mac App Store Connect.": "此证书用于为你的 App 的安装包签名，以便提交至 Mac App Store Connect。",
    "Developer ID Installer": "Developer ID 安装器",
    "This certificate is used to sign your app's Installer Package for distribution outside of the Mac App Store Connect.": "此证书用于为你的 App 的安装包签名，以便在 Mac App Store Connect 之外分发。",
    "This certificate is used to code sign your app for distribution outside of the Mac App Store Connect.": "此证书用于为你的 App 进行代码签名，以便在 Mac App Store Connect 之外分发。",
    "Apple Push Notification service SSL (Sandbox)": "Apple 推送通知服务 SSL (沙盒)",
    "Establish connectivity between your notification server and the Apple Push Notification service sandbox environment to deliver remote notifications to your app. A separate certificate is required for each app you develop.": "在你的通知服务器与 Apple 推送通知服务沙盒环境之间建立连接，以便向你的 App 发送远程通知。你开发的每个 App 都需要单独的证书。",
    "Apple Push Notification service SSL (Sandbox & Production)": "Apple 推送通知服务 SSL (沙盒和生产)",
    "Establish connectivity between your notification server, the Apple Push Notification service sandbox, and production environments to deliver remote notifications to your app. When utilizing HTTP/2, the same certificate can be used to deliver app notifications, update ClockKit complication data, and alert background VoIP apps of incoming activity. A separate certificate is required for each app you distribute.": "在你的通知服务器与 Apple 推送通知服务沙盒环境和生产环境之间建立连接，以便向你的 App 发送远程通知。使用 HTTP/2 时，同一证书可用于发送 App 通知、更新 ClockKit 复杂功能数据，以及向后台 VoIP App 提醒来电活动。你分发的每个 App 都需要单独的证书。",
    "Pass Type ID Certificate": "Pass Type ID 证书",
    "Sign and send updates to passes in Wallet.": "为钱包中的通行证签名并发送更新。",
    "Order Type ID Certificate": "Order Type ID 证书",
    "Sign and send updates to order information payloads displayed in Apple Wallet.": "为 Apple 钱包中显示的订单信息有效负载签名并发送更新。",
    "Website Push ID Certificate": "网站推送 ID 证书",
    "Sign and send updates for Websites.": "为网站签名并发送更新。",
    "Swift Package Collection Certificate": "Swift 软件包集合证书",
    "Sign Swift Package Collections for distribution.": "为要分发的 Swift 软件包集合签名。",
    "Swift Package Certificate": "Swift 软件包证书",
    "Sign Swift packages and package collections for distribution. For use with Swift Package Manager v5.9 or later.": "为要分发的 Swift 软件包和软件包集合签名。适用于 Swift Package Manager v5.9 或更高版本。",
    "WatchKit Services Certificate": "WatchKit 服务证书",
    "Establish connectivity between your notification server, the Apple Push Notification service sandbox, and production environment to update ClockKit complication data. When utilizing HTTP/2, the same certificate can be used to deliver app notifications, update ClockKit complication data, and alert background VoIP apps of incoming activity. A separate certificate is required for each app you distribute.": "在你的通知服务器与 Apple 推送通知服务沙盒环境和生产环境之间建立连接，以便更新 ClockKit 复杂功能数据。使用 HTTP/2 时，同一证书可用于发送 App 通知、更新 ClockKit 复杂功能数据，以及向后台 VoIP App 提醒来电活动。你分发的每个 App 都需要单独的证书。",
    "VoIP Services Certificate": "VoIP 服务证书",
    "Establish connectivity between your notification server, the Apple Push Notification service sandbox, and production environment to alert background VoIP apps of incoming activity. A separate certificate is required for each app you distribute.": "在你的通知服务器与 Apple 推送通知服务沙盒环境和生产环境之间建立连接，以便向后台 VoIP App 提醒来电活动。你分发的每个 App 都需要单独的证书。",
    "Apple Pay Payment Processing Certificate": "Apple Pay 支付处理证书",
    "Decrypt app transaction data sent by Apple to a merchant/developer.": "解密 Apple 发送给商家/开发者的 App 交易数据。",
    "Apple Pay Merchant Identity Certificate": "Apple Pay 商家身份证书",
    "A client TLS certificate that is used to authenticate you to Apple Pay Payment Processing Servers": "用于向 Apple Pay 支付处理服务器验证你身份的客户端 TLS 证书。",
    "Intermediate Certificates": "中间证书",
    "To use your certificates, you must have the intermediate signing certificate in your system keychain. This is automatically installed by Xcode. However, if you need to reinstall the intermediate signing certificate click the link below:": "要使用你的证书，你的系统钥匙串中必须有中间签名证书。该证书会由 Xcode 自动安装。但如果你需要重新安装中间签名证书，请点按下方链接：",
    "Download your certificate": "下载你的证书",
    "Download": "下载",
    "Software Distribution Reminder": "软件分发提醒",
    "If you're generating your first Developer ID certificate, the software that you sign it with must be notarized by Apple in order to run on macOS 10.14.5 or later.": "如果你要生成首个 Developer ID 证书，用该证书签名的软件必须经过 Apple 公证，才能在 macOS 10.14.5 或更高版本上运行。",
    "Learn how to submit your software for notarization": "了解如何提交软件以进行公证",
    "Certificate Details": "证书详细信息",
    "Certificate Name": "证书名称",
    "Certificate Type": "证书类型",
    "Expiration Date": "到期日期",
    "Download your certificate to your Mac, then double click the .cer file to install in Keychain Access. Make sure to save a backup copy of your private and public keys somewhere secure.": "将证书下载到你的 Mac，然后双击 .cer 文件，将其安装到“钥匙串访问”中。请务必将你的私钥和公钥备份存储在安全的位置。",
    "App IDs": "App ID",
    "Services IDs": "服务 ID",
    "Pass Type IDs": "Pass Type ID",
    "Order Type IDs": "订购类型标识符",
    "Website Push IDs": "网站推送 ID",
    "iCloud Containers": "iCloud 容器",
    "App Groups": "App 小组",
    "Merchant IDs": "商家 ID",
    "Media IDs": "媒体标识符",
    "Maps IDs": "地图标识符",
    "Media Sharing Extension IDs": "媒体共享扩展标识符",
    "Identifier": "标识符",
    "Add new identifier": "添加新标识符",
    "All Identifiers": "所有标识符",
    "Register a new identifier": "注册新标识符",
    "Register an App ID to enable your app, app extensions, or App Clip to access available services and identify your app in a provisioning profile. You can enable app services when you create an App ID or modify these settings later.": "注册 App ID，使你的 App、App 扩展或轻 App 能够访问可用服务，并在预置描述文件中标识你的 App。你可以在创建 App ID 时启用 App 服务，也可以稍后修改这些设置。",
    "For each website that uses Sign in with Apple, register a services identifier (Services ID), configure your domain and return URL, and create an associated private key.": "对于每个使用“通过 Apple 登录”的网站，请注册一个服务标识符 (Services ID)，配置你的域名和返回 URL，并创建关联的私钥。",
    "Register a pass type identifier (Pass Type ID) for each kind of pass you create (i.e. gift cards). Registering your Pass Type IDs lets you generate Apple-issued certificates which are used to digitally sign and send updates to your passes, and allow your passes to be recognized by Wallet.": "为你创建的每种通行证（例如礼品卡）注册一个通行证类型标识符 (Pass Type ID)。注册 Pass Type ID 后，你可以生成由 Apple 签发的证书，用于对通行证进行数字签名并发送更新，并使你的通行证能够被钱包识别。",
    "Register an order type identifier (Order Type ID) to support signing and distributing order bundles with Wallet and Apple Pay. Registering your order type ID lets you generate certificates to digitally sign and send updates to your orders in Wallet.": "注册订购类型标识符 (Order Type ID)，以支持通过钱包和 Apple Pay 对订单包进行签名和分发。注册 Order Type ID 后，你可以生成证书，用于对钱包中的订单进行数字签名并发送更新。",
    "Register a Website Push Identifier (Website Push ID). Registering your Website Push IDs lets you generate Apple-issued certificates which are used to digitally sign and send push notifications from your website to macOS.": "注册网站推送标识符 (Website Push ID)。注册 Website Push ID 后，你可以生成由 Apple 签发的证书，用于对从你的网站发送到 macOS 的推送通知进行数字签名并发送。",
    "Registering your iCloud Container lets you use the iCloud Storage APIs to enable your apps to store data and documents in iCloud, keeping your apps up to date automatically.": "注册 iCloud 容器后，你可以使用 iCloud 储存空间 API，让你的 App 将数据和文稿储存在 iCloud 中，并自动保持 App 为最新状态。",
    "Registering your App Group allows access to group containers that are shared among multiple related apps, and allows certain additional interprocess communication between the apps.": "注册 App 小组后，可以访问多个相关 App 之间共享的小组容器，并允许这些 App 之间进行某些额外的进程间通信。",
    "Register your Merchant Identifiers (Merchant IDs) to enable your apps and websites to process transactions for physical goods and services. Generate an Apple Pay Payment Processing certificate for each registered Merchant ID to validate transactions initiated within your app and/or website.": "注册你的商家标识符 (Merchant ID)，使你的 App 和网站能够处理实物商品和服务的交易。为每个已注册的 Merchant ID 生成 Apple Pay 支付处理证书，以验证在你的 App 和/或网站内发起的交易。",
    "Register a media identifier (Media ID) for each app that uses the Apple Music API, ShazamKit or Apple Music Feed. Then create an associated private key.": "为每个使用 Apple Music API、ShazamKit 或 Apple Music Feed 的 App 注册一个媒体标识符 (Media ID)，然后创建关联的私钥。",
    "For each website that uses MapKit JS, register a Maps identifier (Maps ID) then create an associated private key.": "对于每个使用 MapKit JS 的网站，请注册一个地图标识符 (Maps ID)，然后创建关联的私钥。",
    "Media Device Sharing Extension": "媒体设备共享扩展",
    "Register a Media Sharing Extension Protocol ID to enable your extension to provide media sharing functionality across devices. The Protocol ID will be used by media apps to specify support for your Media Sharing Extension.": "注册媒体共享扩展协议 ID，使你的扩展能够提供跨设备的媒体共享功能。媒体 App 将使用该协议 ID 来指明对你的媒体共享扩展的支持。",
    "Edit your App ID Configuration": "编辑你的 App ID 配置",
    "Remove": "移除",
    "Save": "存储",
    "App ID Prefix": "App ID 前缀",
    "(Team ID)": "(团队 ID)",
    "Description": "描述",
    "You cannot use special characters such as @, &, *, \"": "你不能使用特殊字符，例如 @、&、*、\"",
    "Bundle ID": "套装 ID",
    "Capabilities": "功能",
    "App Services": "App 服务",
    "Capability Requests": "功能申请",
    "Enable": "启用",
    "NAME": "名称",
    "Notes": "备注",
    "Platform Support": "平台支持",
    "Provisioning Support": "描述文件支持",
    "Entitlement Keys": "权限密钥",
    "Edit": "编辑",
    "Configure": "配置",
    "Development only.": "仅限开发。",
    "Learn more": "进一步了解",
    "Provisioning support": "描述文件支持",
    "required": "必需",
    "Provisioning support required.": "需要描述文件支持。",
    "Complete Protection": "完全保护",
    "Protected Unless Open": "打开时除外均受保护",
    "Protected Until First User Authentication": "首次用户验证前受保护",
    "Include CloudKit support (requires Xcode 6)": "包含 CloudKit 支持（需要 Xcode 6）",
    "Compatible with Xcode 5": "与 Xcode 5 兼容",
    "Broadcast Capability": "广播功能",
    "Enable as a primary App ID": "启用为主 App ID",
    "(Existing Apps Only)": "(仅限现有 App)",
    "Access the Apple Music catalog and make personalized requests for authorized users.": "访问 Apple Music 目录，并为已授权用户发出个性化请求。",
    "Match audio signatures against Shazam's music catalog.": "将音频签名与 Shazam 的音乐目录进行匹配。",
    "Access the Apple Weather service.": "访问 Apple Weather 服务。",
    "Request": "申请",
    "STATUS": "状态",
    "No Requests": "无申请",
    "No Status": "无状态",
    "Assigned": "已分配",
    "5G Network Slicing": "5G 网络切片",
    "Access Wi-Fi Information": "访问 Wi-Fi 信息",
    "Accessibility Merchant API Control": "Accessibility Merchant API Control",
    "Accessory Data Provider": "配件数据提供方",
    "Accessory Setup Extension": "配件设置扩展",
    "Accessory Transport Extension": "配件传输扩展",
    "Accessory Transport Security": "配件传输安全",
    "Account Creation Requires Phone Number": "创建账户需要电话号码",
    "App Attest": "App Attest",
    "App Attest Opt-In": "App Attest Opt-In",
    "App Identifier for OS Data Transfer": "用于 OS 数据传输的 App 标识符",
    "Apple Pay Payment Processing": "Apple Pay 支付处理",
    "Associated Domains": "关联域",
    "AutoFill Credential Provider": "自动填充凭证提供方",
    "Background GPU Access": "后台 GPU 访问",
    "Background Inference": "后台推理",
    "Carrier-Constrained Network Category and Optimized": "Carrier-Constrained Network Category and Optimized",
    "Claim USB Accessory": "Claim USB Accessory",
    "ClassKit": "ClassKit",
    "Communication Notifications": "通信通知",
    "Critical Messaging": "Critical Messaging",
    "Cross-architecture Compatibility Framework": "Cross-architecture Compatibility Framework",
    "Custom Network Protocol": "自定网络协议",
    "Data Protection": "数据保护",
    "Declared Age Range": "声明年龄范围",
    "Default Calling App": "默认通话 App",
    "Default Carrier Messaging App": "默认运营商信息 App",
    "Default Dialer App": "默认拨号 App",
    "Default Messaging App": "默认信息 App",
    "Default Navigation App": "默认导航 App",
    "Default Translation App": "默认翻译 App",
    "Device Discovery Pairing Access": "设备发现配对访问",
    "Digital Credentials API - Mobile Document Provider": "Digital Credentials API - Mobile Document Provider",
    "DriverKit (development)": "DriverKit（开发）",
    "DriverKit Allow Any UserClient (development)": "DriverKit Allow Any UserClient（开发）",
    "DriverKit Allow Third Party UserClients": "DriverKit Allow Third Party UserClients",
    "DriverKit Communicates with Drivers": "DriverKit Communicates with Drivers",
    "DriverKit Family Audio (development)": "DriverKit Family Audio（开发）",
    "DriverKit Family HID Device (development)": "DriverKit Family HID Device（开发）",
    "DriverKit Family HID EventService (development)": "DriverKit Family HID EventService（开发）",
    "DriverKit Family MIDI (development)": "DriverKit Family MIDI（开发）",
    "DriverKit Family Networking (development)": "DriverKit Family Networking（开发）",
    "DriverKit Family SCSIController (development)": "DriverKit Family SCSIController（开发）",
    "DriverKit Family Serial (development)": "DriverKit Family Serial（开发）",
    "DriverKit PCI (development)": "DriverKit PCI（开发）",
    "DriverKit Transport HID (development)": "DriverKit Transport HID（开发）",
    "DriverKit USB Transport (development)": "DriverKit USB Transport（开发）",
    "EnergyKit": "EnergyKit",
    "EnergyKit LoadEvents": "EnergyKit LoadEvents",
    "Enhanced Security": "增强安全性",
    "Extended Virtual Addressing": "扩展虚拟寻址",
    "Family Controls (Development)": "家人控制 (开发)",
    "Family Controls App and Website Usage": "家人控制 App 和网站使用情况",
    "FileProvider Testing Mode": "FileProvider 测试模式",
    "FinanceKit Transaction Picker UI": "FinanceKit Transaction Picker UI",
    "Fonts": "字体",
    "Foveated Streaming Session": "Foveated Streaming Session",
    "FSKit Module": "FSKit 模块",
    "FSKit Mounter": "FSKit Mounter",
    "Game Center": "Game Center",
    "Group Activities": "群组活动",
    "Head Pose": "头部姿势",
    "HealthKit": "HealthKit",
    "HealthKit Estimate Recalibration": "HealthKit 估计值校准",
    "HLS Interstitial Previews": "HLS 插播式预览",
    "HomeKit": "HomeKit",
    "Hotspot": "热点",
    "iCloud": "iCloud",
    "iCloud Extended Share Access": "iCloud 扩展共享访问",
    "ID Verifier - Display Only": "证件校验器 - 仅限显示",
    "In-App Purchase": "App 内购买项目",
    "Increased Debugging Memory Limit": "更高调试内存限制",
    "Increased Memory Limit": "更高内存限制",
    "Inter-App Audio": "App 间音频",
    "Journaling Suggestions": "手记建议",
    "Live Assistance": "Live Assistance",
    "Location Push Service Extension": "位置推送服务扩展",
    "Low Latency HLS": "HLS 低延迟",
    "Low-Latency Streaming": "低延迟流媒体",
    "Manage Thread Network Credentials (development)": "管理 Thread 网络凭证（开发）",
    "Managed App Installation UI": "管理式 App 安装 UI",
    "Maps": "地图",
    "Matter Allow Setup Payload": "Matter 允许设置有效负载",
    "MDM Managed Associated Domains": "MDM 管理式关联域",
    "Media Device Discovery": "媒体设备发现",
    "Media Extension Format Reader": "媒体扩展格式读取器",
    "Media Extension Video Decoder": "媒体扩展视频解码器",
    "Media Sharing Extension": "媒体共享扩展",
    "Messages Collaboration": "信息协作",
    "Multipath": "多路径",
    "Multitasking Camera Access": "多任务相机访问",
    "Nearby Interaction DL-TDoA (development)": "Nearby Interaction DL-TDoA（开发）",
    "Network Extensions": "网络扩展",
    "Network Topology Observation": "网络拓扑观察",
    "NFC Tag Reading": "NFC 标签读取",
    "On Demand Install Capable for App Clip Extensions": "轻 App 扩展的按需安装功能",
    "Personal VPN": "个人 VPN",
    "Push Notifications": "推送通知",
    "Push to Talk": "Push to Talk",
    "Sensitive Content Analysis": "敏感内容分析",
    "Shallow Depth and Pressure": "浅水深度和压力",
    "Shared with You": "与你共享",
    "Side Button Access": "侧边按钮访问",
    "Sign In with Apple": "通过 Apple 登录",
    "SIM Inserted for Wireless Carriers": "已插入移动通信运营商 SIM 卡",
    "Siri": "Siri",
    "Spatial Audio Profile": "空间音频配置信息",
    "StoreKit External Purchase": "StoreKit External Purchase",
    "StoreKit External Purchase Link": "StoreKit External Purchase Link",
    "StoreKit External Purchases or Offers": "StoreKit External Purchases or Offers",
    "StoreKit External Purchases or Offers (EU)": "StoreKit External Purchases or Offers (EU)",
    "Suggested Actions": "建议操作",
    "Sustained Execution": "持续执行",
    "System Extension": "系统扩展",
    "Tap to Share": "Tap to Share",
    "Time Sensitive Notifications": "时效性通知",
    "Trust Insights": "Trust Insights",
    "User Management": "用户管理",
    "Virtualization": "虚拟化",
    "VMNet": "VMNet",
    "Wallet": "钱包",
    "WeatherKit": "WeatherKit",
    "Wi-Fi Aware": "Wi-Fi Aware",
    "Wi-Fi Network Sharing": "Wi-Fi 网络共享",
    "Wireless Accessory Configuration": "无线配件配置",
    "Wireless Insights Service Predictions": "Wireless Insights Service Predictions",
    "Mac Catalyst": "Mac Catalyst",
    "MusicKit": "MusicKit",
    "ShazamKit": "ShazamKit",
    "Add Devices to Automated Device Enrollment": "向自动设备注册添加设备",
    "Alternative App Marketplace": "替代 App 市场",
    "Apple Pay Delegation": "Apple Pay Delegation",
    "Automatic Assessment Configuration": "自动评估配置",
    "Browser App Installation": "浏览器 App 安装",
    "Camera Region": "相机区域",
    "CarKey Session": "CarKey Session",
    "CarPlay Audio App": "CarPlay 音频 App",
    "CarPlay Automaker": "CarPlay 汽车制造商",
    "CarPlay Communication App": "CarPlay 通信 App",
    "CarPlay Driving Task App": "CarPlay 驾驶任务 App",
    "CarPlay EV Charging App": "CarPlay 电动车充电 App",
    "CarPlay Fueling App": "CarPlay 加油 App",
    "CarPlay Parking App": "CarPlay 停车 App",
    "CarPlay Quick Food Ordering App": "CarPlay 快速点餐 App",
    "CarPlay Voice Based Conversation": "CarPlay 语音对话",
    "Contact Notes Field Access": "联系人备注字段访问",
    "Contactless Pass Provisioning": "Contactless Pass Provisioning",
    "Contactless Pass Provisioning (SharableCredential)": "Contactless Pass Provisioning (SharableCredential)",
    "Contactless Pass Provisioning access for MAIDs": "Contactless Pass Provisioning access for MAIDs",
    "Critical Alerts": "重要警报",
    "Default Host Card Emulation (HCE) App": "默认主机卡模拟 (HCE) App",
    "Default Web Browser": "默认网页浏览器",
    "DriverKit Allow Any UserClient Access": "DriverKit Allow Any UserClient Access",
    "DriverKit BlockStorageDevice": "DriverKit BlockStorageDevice",
    "DriverKit Family Audio": "DriverKit Family Audio",
    "DriverKit Family HID Device": "DriverKit Family HID Device",
    "DriverKit Family MIDI": "DriverKit Family MIDI",
    "DriverKit Family Networking": "DriverKit Family Networking",
    "DriverKit Family SCSI Controller": "DriverKit Family SCSI Controller",
    "DriverKit Family Serial": "DriverKit Family Serial",
    "DriverKit HID EventService": "DriverKit HID EventService",
    "DriverKit PCI (PrimaryMatch)": "DriverKit PCI (PrimaryMatch)",
    "DriverKit Transport HID": "DriverKit Transport HID",
    "DriverKit USB Transport - VendorID": "DriverKit USB Transport - VendorID",
    "DriverKit USB Transport - VendorID and ProductID": "DriverKit USB Transport - VendorID and ProductID",
    "DriverKit UserClient Access": "DriverKit UserClient Access",
    "Embedded Browser Engine": "嵌入式浏览器引擎",
    "Endpoint Security": "Endpoint Security",
    "Enrollment Single Sign On": "注册单点登录",
    "eSim": "eSim",
    "External Link Account": "External Link Account",
    "Fall Detection Notifications": "跌倒检测通知",
    "Family Controls (Distribution)": "家人控制 (分发)",
    "FinanceKit": "FinanceKit",
    "Font Enumeration": "字体枚举",
    "Foundation Model Adapter": "Foundation Model Adapter",
    "Foveated Streaming Provider": "Foveated Streaming Provider",
    "Health Movement Disorder": "Health Movement Disorder",
    "Health Research Background Processing": "健康研究后台处理",
    "HealthKit Access (Verifiable Health Records)": "HealthKit 访问（可验证健康记录）",
    "Hearing Aid App": "助听器 App",
    "HID Virtual Device": "HID Virtual Device",
    "Host Card Emulation (HCE)": "主机卡模拟 (HCE)",
    "Hotspot Helper": "热点助手",
    "ID Verifier - Data Transfer": "证件校验器 - 数据传输",
    "In-App Provisioning": "In-App Provisioning",
    "Increased Performance Headroom": "更高性能余量",
    "Main Camera Access": "主相机访问",
    "Manage Thread Network Credentials": "管理 Thread 网络凭证",
    "Memory Transfer Accept": "Memory Transfer Accept",
    "Memory Transfer Send": "Memory Transfer Send",
    "Multicast Networking": "多播网络",
    "Notification (NSE) Filtering": "通知 (NSE) 过滤",
    "Object Tracking Parameter Adjustment": "物体追踪参数调整",
    "Pass Presentation Suppression": "Pass Presentation Suppression",
    "Passthrough Camera Access": "透视相机访问",
    "Passthrough in Screen Capture": "屏幕捕捉中的透视",
    "Persistent Content Capture": "Persistent Content Capture",
    "Privileged File Operations": "特权文件操作",
    "Protected Content": "受保护内容",
    "SensorKit Reader Access": "SensorKit Reader Access",
    "Severe Vehicular Crash Event": "严重车祸事件",
    "SiriKit Media Intents on HomePod": "SiriKit Media Intents on HomePod",
    "Spatial Barcode and QR code Scanning": "空间条形码和二维码扫描",
    "Submerged Depth and Pressure": "水下深度和压力",
    "System Extension Redistributable": "System Extension Redistributable",
    "UPI Device Validation": "UPI Device Validation",
    "User Assigned Device Name": "用户指定的设备名称",
    "Web Browser Engine Host": "Web Browser Engine Host",
    "Web Browser Engine Networking": "Web Browser Engine Networking",
    "Web Browser Engine Rendering": "Web Browser Engine Rendering",
    "Web Browser Engine Web Content": "Web Browser Engine Web Content",
    "Web Browser JIT Access": "Web Browser JIT Access",
    "Web Browser JIT Write AllowList": "Web Browser JIT Write AllowList",
    "Web Browser Public Key Credential Requests": "Web Browser Public Key Credential Requests",
    "Window Body Follow": "Window Body Follow",
    "Apple TV": "Apple TV",
    "Apple Vision Pro": "Apple Vision Pro",
    "Apple Watch": "Apple Watch",
    "iPad": "iPad",
    "iPhone": "iPhone",
    "iPod Touch": "iPod touch",
    "Mac": "Mac",
    "Status": "状态",
    "Date Registered": "注册日期",
    "Inactive": "未激活",
    "Add new device": "添加新设备",
    "All Devices": "所有设备",
    "Register a New Device": "注册新设备",
    "To create a provisioning profile for app testing and ad hoc distribution, you'll need to specify registered devices. If you use automatic signing, Xcode registers connected devices for you. Xcode Server can also be configured to register connected devices.": "要创建用于 App 测试和 Ad Hoc 分发的预置描述文件，你需要指定已注册的设备。如果你使用自动签名，Xcode 会为你注册已连接的设备。也可以将 Xcode Server 配置为注册已连接的设备。",
    "Note: If you remove a registered device from your account, it will continue to count against your device limit. At the start of your new membership year, Account Holders and Admins will be presented with the option to remove listed devices and restore the available device count.": "注：如果你从账户中移除已注册的设备，该设备仍会计入你的设备数量上限。在新的会员资格年度开始时，账户持有人和管理员可以选择移除所列设备，并恢复可用设备数量。",
    "Register a Device": "注册设备",
    "Name your device and enter its Unique Device Identifier (UDID).": "为设备命名并输入其唯一设备标识符 (UDID)。",
    "Device Name": "设备名称",
    "Device ID (UDID)": "设备 ID (UDID)",
    "Register Multiple Devices": "注册多台设备",
    "Upload a file containing the devices you wish to register. Please note that a maximum of 100 devices can be included in your file and it may take a few minutes to process.": "上传包含你要注册的设备的文件。请注意，文件中最多可包含 100 台设备，处理可能需要几分钟。",
    "Download sample files": "下载示例文件",
    "Device List": "设备列表",
    "Choose File": "选取文件",
    "Edit Device": "编辑设备",
    "Disable": "停用",
    "Device Type": "设备类型",
    "Device ID (": "设备 ID (",
    "UUID": "UUID",
    "Distribution": "分发",
    "All Platforms": "所有平台",
    "Ad hoc": "Ad Hoc",
    "Add new profile": "添加新描述文件",
    "All Profiles": "所有描述文件",
    "Register a New Provisioning Profile": "注册新的描述文件",
    "Create a provisioning profile to install development apps on iOS, iPadOS, watchOS, and visionOS test devices.": "创建预置描述文件，以在 iOS、iPadOS、watchOS 和 visionOS 测试设备上安装开发版 App。",
    "tvOS App Development": "tvOS App 开发",
    "Create a provisioning profile to install development apps on tvOS test devices.": "创建预置描述文件，以在 tvOS 测试设备上安装开发版 App。",
    "macOS App Development": "macOS App 开发",
    "Create a provisioning profile to install development apps on test devices.": "创建预置描述文件，以在测试设备上安装开发版 App。",
    "DriverKit App Development": "DriverKit App 开发",
    "Create a provisioning profile to install development driverkit extensions on iOS, iPadOS, and macOS test devices.": "创建预置描述文件，以在 iOS、iPadOS 和 macOS 测试设备上安装开发版 DriverKit 扩展。",
    "Ad Hoc": "Ad Hoc",
    "Create a distribution provisioning profile to install your app on a limited number of registered devices.": "创建分发预置描述文件，以将你的 App 安装到数量有限的已注册设备上。",
    "tvOS Ad Hoc": "tvOS Ad Hoc",
    "Create a distribution provisioning profile to install your app on a limited number of registered tvOS devices.": "创建分发预置描述文件，以将你的 App 安装到数量有限的已注册 tvOS 设备上。",
    "App Store Connect": "App Store Connect",
    "Create a distribution provisioning profile to submit your app to App Store Connect.": "创建分发预置描述文件，以将你的 App 提交至 App Store Connect。",
    "tvOS App Store Connect": "tvOS App Store Connect",
    "Create a distribution provisioning profile to submit your tvOS app to App Store Connect.": "创建分发预置描述文件，以将你的 tvOS App 提交至 App Store Connect。",
    "Mac App Store Connect": "Mac App Store Connect",
    "Create a distribution provisioning profile to submit your app to Mac App Store Connect.": "创建分发预置描述文件，以将你的 App 提交至 Mac App Store Connect。",
    "Developer ID": "Developer ID",
    "Create a Developer ID provisioning profile to use Apple services with your Developer ID signed applications.": "创建 Developer ID 预置描述文件，以便在经 Developer ID 签名的应用程序中使用 Apple 服务。",
    "Review Provisioning Profile": "查看预置描述文件",
    "Active": "有效",
    "Expires": "到期日期",
    "Enabled Capabilities": "已启用的功能",
    "App ID": "App ID",
    "Getting Started with Keys": "密钥使用入门",
    "Creating a key allows you to configure, authenticate, and use one or more Apple services for that key. Unlike certificates, keys do not expire and can be modified to access more services after their creation. For more information on creating and using keys, refer to Developer Account Help.": "创建密钥后，你可以为该密钥配置、验证和使用一项或多项 Apple 服务。与证书不同，密钥不会到期，并且可以在创建后修改以访问更多服务。有关创建和使用密钥的更多信息，请参阅开发者账户帮助。",
    "Create a key": "创建密钥",
    "Add new key": "添加新密钥",
    "All Keys": "所有密钥",
    "Register a New Key": "注册新密钥",
    "Key Name": "密钥名称",
    "You cannot use special characters such as @, &, *, ', \", -, .": "你不能使用特殊字符，例如 @、&、*、'、\"、-、.",
    "Key Usage Description (optional)": "密钥用途说明（可选）",
    "Establish connectivity between your notification server and the Apple Push Notification service. One key is used for all of your apps.": "在你的通知服务器与 Apple 推送通知服务之间建立连接。所有 App 共用一个密钥。",
    "DeviceCheck": "DeviceCheck",
    "Access the DeviceCheck and AppAttest APIs to get data that your associated server can use in its business logic to protect your business while maintaining user privacy.": "访问 DeviceCheck 和 AppAttest API，获取可供关联服务器在其业务逻辑中使用的数据，从而在保护用户隐私的同时保护你的业务。",
    "Integrate Apple Maps into your apps and websites. Show maps, surface search results, provide directions, access Maps data and more.": "将 Apple 地图集成到你的 App 和网站中。显示地图、呈现搜索结果、提供路线、访问地图数据等。",
    "There are no identifiers available that can be associated with the key": "没有可与该密钥关联的标识符",
    "Media Services (MusicKit, ShazamKit, Apple Music Feed)": "媒体服务 (MusicKit、ShazamKit、Apple Music Feed)",
    "Access the Apple Music catalog and make personalized requests for authorized users, check audio signatures against the Shazam music catalog, and access Apple Music Feed.": "访问 Apple Music 目录并为已授权用户发出个性化请求，将音频签名与 Shazam 音乐目录进行比对，并访问 Apple Music Feed。",
    "Sign in with Apple": "通过 Apple 登录",
    "Enable your apps to allow users to authenticate in your application with their Apple ID. Configuration is required to enable this feature.": "让你的 App 允许用户使用其 Apple ID 在你的 App 中进行验证。启用此功能需要进行配置。",
    "iWork Document Exporting": "iWork 文稿导出",
    "Enable your users to display iWork documents by requesting a read-only PDF version of the document.": "通过请求文稿的只读 PDF 版本，让你的用户能够显示 iWork 文稿。",
    "Account & Organizational Data Sharing": "账户和组织数据共享",
    "Configure your apps and websites with Account & Organizational Data Sharing to securely request access to your users' Apple ID account information.": "使用“账户和组织数据共享”配置你的 App 和网站，以安全地请求访问用户的 Apple ID 账户信息。",
    "ClassKit Catalog": "ClassKit 目录",
    "Publish all of your ClassKit app activities to teachers creating Handouts in Apple Schoolwork.": "将你所有的 ClassKit App 活动发布给在 Apple 课业中创建讲义的教师。",
    "Media Services (MusicKit, ShazamKit)": "媒体服务 (MusicKit、ShazamKit)",
    "Sign in with Apple for Email Communication": "通过 Apple 登录（电子邮件通信）",
    "Allow users to set up an account and sign in to your apps and associated websites with the Apple IDs they already have. Configuration is required to communicate with your users and receive updates from Apple.": "允许用户使用其现有的 Apple ID 设置账户并登录你的 App 和关联网站。需要进行配置，才能与你的用户沟通并接收来自 Apple 的更新。",
    "Allow sharing of Apple ID account and/or organizational information with your apps and associated websites so they can connect to your services securely and easily.": "允许与你的 App 和关联网站共享 Apple ID 账户和/或组织信息，以便它们安全、轻松地连接到你的服务。",
    "Manage your WeatherKit usage.": "管理你的 WeatherKit 使用情况。",
    "View": "查看",
    "Manage your Maps usage and tokens.": "管理你的地图使用情况和令牌。",
    "Configure Tokens": "配置令牌",
    "View Usage": "查看使用情况",
    "View all services": "查看所有服务",
    "WeatherKit Usage": "WeatherKit 使用情况",
    "Plan Overview": "套餐概览",
    "API calls per month": "每月 API 调用次数",
    "Calls Quota": "调用配额",
    "Used": "已使用",
    "Remaining": "剩余",
    "Trends": "趋势",
    "Last 30 Days": "过去 30 天",
    "Last 60 Days": "过去 60 天",
    "Last 90 Days": "过去 90 天",
    "Last 120 Days": "过去 120 天",
    "Usage by Identifier": "按标识符统计使用情况",
    "You don't have any calls within this period.": "此时段内你没有任何调用。",
    "(explicit)": "(精确)",
    "(wildcard)": "(通配符)",
    "If you remove a registered device from your account, it will continue to count against your device limit. At the start of your new membership year, Account Holders and Admins will be presented with the option to remove listed devices and restore the available device count.": "如果你从账户中移除已注册的设备，该设备仍会计入你的设备数量上限。在新的会员资格年度开始时，账户持有人和管理员可以选择移除所列设备，并恢复可用设备数量。",
    "Provisioning Profile": "预置描述文件",
    "Note:": "注：",
    "Created": "创建日期",
    "Modified": "修改日期",
    "Expires on": "到期日期",
    "Bundle ID Prefix": "套装 ID 前缀",
    "Provisioning Profiles": "预置描述文件",
    "Provisioning profile": "预置描述文件",
    "Profile Name": "描述文件名称",
    "TestFlight": "TestFlight",
    "Apple Developer Program": "Apple Developer Program",
    "News": "最新动态",
    "Latest News": "最新动态",
    "Discover": "探索",
    "Design": "设计",
    "Develop": "开发",
    "Distribute": "分发",
    "Account": "账户",
    "Platforms": "平台",
    "Technologies": "技术",
    "Community": "社区",
    "Documentation": "文档",
    "Resources": "资源",
    "Programs": "计划",
    "Events": "活动",
    "Forums": "论坛",
    "Videos": "视频",
    "Sample Code": "示例代码",
    "Overview": "概览",
    "Help": "帮助",
    "Contact Us": "联系我们",
    "System Status": "系统状态",
    "Agreements and Guidelines": "协议和准则",
    "Developer Account Help": "开发者账户帮助",
    "App Review Guidelines": "App 审核指南",
    "App Store Connect Help": "App Store Connect 帮助",
    "Human Interface Guidelines": "人机界面指南",
    "Developer Forums": "开发者论坛",
    "Feedback Assistant": "反馈助理",
    "Reset": "重置",
    "Filter": "筛选",
    "Light": "浅色",
    "Dark": "深色",
    "Auto": "自动",
    "Developer profile": "开发者个人资料",
    "Email preferences": "电子邮件偏好设置",
    "Agreements": "协议",
    "Program resources": "计划资源",
    "Program Resources": "计划资源",
    "Membership details": "会员资格详细信息",
    "Membership Details": "会员资格详细信息",
    "Device reset date": "设备重置日期",
    "Code-level support": "代码级支持",
    "Automatic signing controls": "自动签名控制",
    "Certificates, IDs & Profiles": "证书、标识符和描述文件",
    "Certificates, IDs, & Profiles": "证书、标识符和描述文件",
    "Software downloads": "软件下载",
    "Users and Access": "用户和访问",
    "Apple Account": "Apple 账户",
    "Entity name": "实体名称",
    "Team ID": "团队 ID",
    "Program": "计划",
    "Enrolled as": "注册身份",
    "Annual fee": "年费",
    "Membership expiration": "会员资格到期日",
    "Renewal date": "续期日期",
    "Renew": "续订",
    "Role": "职能",
    "Membership": "会员资格",
    "Individual": "个人",
    "Organization": "组织",
    "Update your information": "更新你的信息",
    "Apple Developer Agreement": "Apple Developer 协议",
    "Apple Developer Program License Agreement": "Apple Developer Program 许可协议",
    "Account Holder": "账户持有人",
    "Admin": "管理",
    "App Manager": "App 管理",
    "Developer": "开发者",
    "Marketing": "营销",
    "Finance": "财务",
    "Sales": "销售",
    "Customer Support": "客户支持",
    "Invite": "邀请",
    "Next": "下一步",
    "Agree": "同意",
    "More": "更多",
    "Service Configurations": "服务配置",
    "Summary": "摘要",
    "Create a certificate": "创建证书",
    "Register a New Identifier": "注册新标识符",
    "Add": "添加",
    "Back": "返回",
    "Register": "注册",
    "Revoke": "撤销",
    "Done": "完成",
    "Cancel": "取消",
    "Learn More": "进一步了解",
    "Confirm": "确认",
    "Generate": "生成",
    "Delete": "删除",
    "Submit": "提交",
    "Create": "创建",
    "Enabled": "已启用",
    "Disabled": "已停用",
    "Expired": "已到期",
    "Invalid": "无效",
    "Revoked": "已撤销",
    "No results": "无任何结果",
    "Note": "注",
    "Apple Push Notification service (APNs)": "Apple 推送通知服务 (APNs)",
    "Sandbox": "沙盒",
    "Certificate Signing Request": "证书签名请求",
    "Keychain Access": "钥匙串访问",
    "App Clip": "轻 App",
    "Key ID": "密钥标识符",
    "Media Services": "媒体服务",
    "Unique Device Identifier (UDID)": "唯一设备标识符 (UDID)",
    "Mac App Development": "Mac App 开发",
    "Access WiFi Information": "访问 WiFi 信息",
    "Background Modes": "后台模式",
    "Hardened Runtime": "强化版运行时",
    "Keychain Sharing": "钥匙串共享",
    "Services Overview": "服务概览",
    "People": "成员",
    "Programs & Features": "项目与功能",
    "Menu": "菜单",
    "Sign In": "登录",
    "Sign Out": "退出登录",
    "Sign in": "登录",
    "Sign out": "退出登录",
    "Team Name": "团队名称",
    "Team": "团队",
    "Teams": "团队",
    "Entity Type": "实体类型",
    "Enrollment ID": "注册 ID",
    "Program Name": "项目名称",
    "Company": "公司",
    "Agreements, Tax, and Banking": "协议、税务和银行",
    "Review Agreement": "查看协议",
    "Review the Agreement": "查看协议",
    "Accept": "接受",
    "Renew Membership": "续订会员资格",
    "Renewal": "续订",
    "Auto-Renew": "自动续订",
    "Created on": "创建日期：",
    "Renewal Date": "续订日期",
    "Enrollment Date": "注册日期",
    "Release Date": "发布日期",
    "Capability": "功能",
    "Explicit": "精确",
    "Wildcard": "通配符",
    "Explicit App ID": "精确 App ID",
    "Wildcard App ID": "通配符 App ID",
    "Register a New Certificate": "注册新证书",
    "Register a New Profile": "注册新描述文件",
    "Register Devices": "注册设备",
    "Device ID": "设备 ID",
    "UDID": "UDID",
    "Serial Number": "序列号",
    "Model": "型号",
    "Create a CSR": "创建 CSR",
    "Upload": "上传",
    "Apple Push Notification service SSL": "Apple 推送通知服务 SSL",
    "Apple Push Notification service": "Apple 推送通知服务",
    "Apple Push Notifications service (APNs)": "Apple 推送通知服务 (APNs)",
    "App Store": "App Store",
    "Download Your Key": "下载你的密钥",
    "Create a Key": "创建密钥",
    "Valid": "有效",
    "Previous": "上一步",
    "Close": "关闭",
    "OK": "好",
    "Yes": "是",
    "No": "否",
    "Sort": "排序",
    "Show": "显示",
    "Hide": "隐藏",
    "Get Started": "开始使用",
    "Loading...": "正在载入...",
    "Loading": "正在载入",
    "No results found": "未找到结果",
    "No Results": "无结果",
    "Error": "错误",
    "Warning": "警告",
    "Required": "必填",
    "Optional": "可选",
    "Terms and Conditions": "条款与条件",
    "Copyright © Apple Inc. All rights reserved.": "版权所有 © Apple Inc. 保留一切权利。"
  };
  // ==DICT END==

  // ───────────────────────── 规范化与翻译核心（纯函数） ─────────────────────────

  /** 规范化：弯引号转直引号、NBSP 视为空格、合并空白、去首尾空白 */
  function normalize(s) {
    return String(s)
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[ \s]+/g, ' ')
      .trim();
  }

  /** 词典精确查找；找不到返回 null */
  function lookup(key) {
    return Object.prototype.hasOwnProperty.call(DICT, key) ? DICT[key] : null;
  }

  /** 查找规则中的固定前缀词（容忍末尾冒号），找不到返回 null */
  function lookupPrefix(p) {
    const k = normalize(p).replace(/\s*[:：]$/, '');
    return lookup(k);
  }

  const MONTHS = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8,
    sep: 9, sept: 9, oct: 10, nov: 11, dec: 12,
    january: 1, february: 2, march: 3, april: 4, june: 6, july: 7,
    august: 8, september: 9, october: 10, november: 11, december: 12,
  };
  const MONTH_RE =
    '(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sept?(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)';

  const UNIT_ZH = {
    item: '项', result: '条结果', certificate: '个证书', identifier: '个标识符',
    device: '台设备', profile: '个描述文件', key: '个密钥', app: '个 App',
    team: '个团队', member: '位成员', user: '位用户',
  };
  const unitZh = (w) => UNIT_ZH[w.toLowerCase().replace(/s$/, '')] || '项';

  /** 构造 "Mon D, YYYY" 的中文日期 */
  const zhDate = (y, mon, d) => `${y}年${mon}月${Number(d)}日`;
  const monthNum = (s) => MONTHS[s.toLowerCase()] || null;

  /** 前缀 + 值：前缀以冒号/顿号结尾则直接拼接，否则补「：」 */
  const joinPrefix = (p, v) => (/[：:]$/.test(p) ? p : p + '：') + v;

  const DATE_PART = MONTH_RE + '\\.?\\s+(\\d{1,2})';

  /**
   * 动态文案规则：[正则, 字符串或函数]。函数返回 null 表示放弃（继续后面的规则）。
   * 输入均为已规范化文本；顺序即优先级（具体规则在前，通用规则在后）。
   */
  const RULES = [
    // 重置日期："- Resets on Nov 14, 2026"
    [
      new RegExp('^-?\\s*Resets on ' + DATE_PART + ',\\s*(\\d{4})$'),
      (m, mon, day, year) => {
        const mm = monthNum(mon);
        return mm ? `- ${zhDate(year, mm, day)}重置` : null;
      },
    ],
    // 日期区间："Sep 15 - Oct 15, 2026"（同年）、"Dec 15, 2025 - Jan 15, 2026"（跨年）
    [
      new RegExp('^' + DATE_PART + '(?:,\\s*(\\d{4}))?\\s*[-\\u2013]\\s*' + DATE_PART + ',\\s*(\\d{4})$'),
      (m, mon1, d1, y1, mon2, d2, y2) => {
        const m1 = monthNum(mon1), m2 = monthNum(mon2);
        if (!m1 || !m2) return null;
        const end = zhDate(y2, m2, d2);
        if (!y1 || y1 === y2) return `${y2}年${m1}月${Number(d1)}日 - ${m2}月${Number(d2)}日`;
        return `${zhDate(y1, m1, d1)} - ${end}`;
      },
    ],
    // 证书名 + "(Expiring MM/DD/YYYY)"：名称保留英文（词典有则翻译），括注译成「（YYYY年M月D日到期）」
    [
      /^(.*?)\s*\(Expiring (\d{1,2})\/(\d{1,2})\/(\d{4})\)$/,
      (m, name, mo, d, y) => {
        const n = name ? (lookup(name) ?? name) : '';
        return `${n}（${zhDate(y, Number(mo), d)}到期）`;
      },
    ],
    // 单个日期（可带前缀）："Oct 15, 2026"、"Expires October 15, 2026"、"Created: Oct 1, 2026"
    [
      new RegExp('^(.*?)\\s*\\b' + DATE_PART + ',\\s*(\\d{4})$'),
      (m, prefix, mon, day, year) => {
        const mm = monthNum(mon);
        if (!mm) return null;
        const date = zhDate(year, mm, day);
        if (!prefix) return date;
        const p = lookupPrefix(prefix);
        return p === null ? null : joinPrefix(p, date);
      },
    ],
    // 欢迎语："Welcome, Appleseed" / "Welcome back, Appleseed"
    [/^Welcome(?: back)?,?\s+(.+?)!?$/i, (m, name) => `欢迎，${name}`],
    // 分页："Page 2 of 5"
    [/^Page (\d+) of (\d+)$/i, (m, a, b) => `第 ${a} 页，共 ${b} 页`],
    // 范围："1-10 of 25" / "Showing 1-10 of 25"
    [/^(?:Showing )?(\d+)\s*[-–]\s*(\d+) of (\d[\d,]*)$/i, (m, a, b, c) => `第 ${a}–${b} 项，共 ${c} 项`],
    // 计数："25 items" / "3 results" / "12 certificates"
    [
      /^(\d[\d,]*) (items?|results?|certificates?|identifiers?|devices?|profiles?|keys?|apps?|teams?|members?|users?)$/i,
      (m, n, unit) => `${n} ${unitZh(unit)}`,
    ],
    // "{n} total" → "共 {n} 个"
    [/^(\d[\d,]*) total$/i, (m, n) => `共 ${n} 个`],
    // "100 % of calls available" → "可用调用次数 100%"
    [/^(\d+(?:\.\d+)?)\s*% of calls available$/i, (m, n) => `可用调用次数 ${n}%`],
    // 天数："Expires in 30 days" / "30 days"
    [/^Expires in (\d+) days?$/i, (m, n) => `${n} 天后到期`],
    [/^(\d+) days?$/i, (m, n) => `${n} 天`],
    // aria-label："Request capability {能力名}" → "申请功能：{译文或原文}"
    [/^Request capability (.+)$/, (m, cap) => `申请功能：${lookup(cap) ?? cap}`],
    // "Enabled {词典项} ({n})" → "已启用的{译文} ({n})"
    [
      /^Enabled (.+?) \((\d+)\)$/,
      (m, item, n) => {
        const t = lookup(item);
        return t === null ? null : `已启用的${/^[A-Za-z0-9]/.test(t) ? ' ' : ''}${t} (${n})`;
      },
    ],
    // "{词典项} ({n})" → "{译文} ({n})"
    [
      /^(.+?) \((\d+)\)$/,
      (m, item, n) => {
        const t = lookup(item);
        return t === null ? null : `${t} (${n})`;
      },
    ],
    // Bundle ID 后缀："{任意} (explicit)" / "(wildcard)"：只翻括注
    [/^(.+?) \((explicit|wildcard)\)$/i, (m, id, kind) => `${id} (${kind.toLowerCase() === 'explicit' ? '精确' : '通配符'})`],
    // "固定前缀: 值"，前缀查词典，如 "Team ID: ABC123DEF4"
    [
      /^([A-Za-z][A-Za-z ()]{1,30}?)\s*:\s*(.+)$/,
      (m, label, value) => {
        const p = lookup(label);
        return p === null ? null : `${p}：${value}`;
      },
    ],
    // 页面标题："Certificates, Identifiers & Profiles - Apple Developer"：前半必须在词典中
    [
      /^(.+?) - Apple Developer$/,
      (m, head) => {
        const t = lookup(head);
        return t === null ? null : `${t} - Apple 开发者`;
      },
    ],
    // 逗号列表（兜底）：每项 ≤6 词且不以句号结尾、且所有项都在词典中 → 逐项翻译，用「、」连接
    // （能力名的英文自映射条目也算命中；部分命中不触发，避免误伤带逗号的标题/短语）
    [
      /^.+, .+$/,
      (m) => {
        const items = m.split(', ');
        if (items.length < 2) return null;
        for (const it of items) {
          if (!it || it.split(' ').length > 6 || /[.。]$/.test(it)) return null;
          if (lookup(it) === null) return null;
        }
        return items.map((it) => lookup(it)).join('、');
      },
    ],
  ];

  /** 相邻文本节点拼接后只查词典（不走规则）；texts 为各文本节点原值，未命中返回 null */
  function translateJoined(texts) {
    return lookup(normalize(texts.join('')));
  }

  const PLATFORMS = new Set(['iOS', 'iPadOS', 'macOS', 'tvOS', 'watchOS', 'visionOS']);

  /** 漏译候选判断（纯函数）：像界面文案则返回规范化文本，否则返回 null */
  function missingCandidate(raw) {
    const s = normalize(raw);
    if (s.length < 2 || s.length > 200) return null;
    if (!/[A-Za-z]/.test(s) || /[぀-ヿ一-鿿]/.test(s)) return null;
    if (!/^[A-Za-z0-9"'(]/.test(s)) return null;
    if (/https?:|\/\/|@|[{}<>=_\\|]/.test(s)) return null;
    if (s.split(' ').length > 30) return null;
    if (/^[A-Z0-9]{8,}$/.test(s)) return null;                 // 团队 ID/序列号
    if (s.split(/[,/\s]+/).filter(Boolean).every((w) => PLATFORMS.has(w))) return null; // 平台名/平台列表
    if (!s.includes(' ') && s.includes('.')) return null;      // Bundle ID、entitlement key
    if (!s.includes(' ') && /^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(s)) return null; // aps-environment 之类
    return s;
  }

  /** 翻译一段已规范化的文本；未命中返回 null */
  function translateNorm(norm) {
    if (!norm) return null;
    const hit = lookup(norm);
    if (hit !== null) return hit;
    for (const [re, rep] of RULES) {
      const m = re.exec(norm);
      if (!m) continue;
      const out = typeof rep === 'function' ? rep(...m) : norm.replace(re, rep);
      if (out !== null && out !== undefined) return out;
    }
    return null;
  }

  /** 翻译原始字符串，保留首尾空白；未命中返回 null */
  function translateRaw(raw) {
    const out = translateNorm(normalize(raw));
    if (out === null) return null;
    const lead = /^\s*/.exec(raw)[0];
    const trail = /\s*$/.exec(raw)[0];
    return lead + out + trail;
  }

  // 非浏览器环境（Node 自测）：只导出纯函数
  if (typeof document === 'undefined') {
    globalThis.__appleDevZhTest = { normalize, translateNorm, translateRaw, translateJoined, missingCandidate, RULES, DICT };
    return;
  }

  // ───────────────────────── 状态与存储 ─────────────────────────

  const STORE_KEY = 'appleDevZh.enabled';
  const ATTRS = ['placeholder', 'title', 'aria-label', 'alt', 'value'];
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'PRE', 'KBD']);
  const BUTTON_TYPES = new Set(['button', 'submit', 'reset']);

  function loadEnabled() {
    try { return localStorage.getItem(STORE_KEY) !== '0'; } catch (e) { return true; }
  }
  function saveEnabled(v) {
    try { localStorage.setItem(STORE_KEY, v ? '1' : '0'); } catch (e) { /* 忽略 */ }
  }

  let enabled = loadEnabled();
  const missing = new Set();                 // 未命中词典的英文文本
  const textState = new WeakMap();           // 文本节点 -> { orig, tr }
  const attrState = new WeakMap();           // 元素 -> Map(属性名 -> { orig, tr })
  const observedRoots = new WeakSet();       // 已 observe 的 shadowRoot
  const shadowRefs = [];                     // WeakRef<ShadowRoot>，用于切回英文时遍历

  // ───────────────────────── 跳过判断 ─────────────────────────

  /** 仅检查元素自身是否应跳过（用于 TreeWalker 过滤，整棵子树拒绝） */
  function isSkipEl(el) {
    if (SKIP_TAGS.has(el.tagName)) return true;
    if (el.isContentEditable || el.getAttribute('contenteditable') === '' ||
        el.getAttribute('contenteditable') === 'true') return true;
    if (el.getAttribute('translate') === 'no') return true;
    const cls = el.getAttribute('class');
    return !!cls && cls.indexOf('notranslate') !== -1;
  }

  /** 检查节点自身及所有祖先（穿过 shadow host）是否应跳过 */
  function isSkipped(node) {
    let el = node.nodeType === 1 ? node : node.parentNode;
    while (el) {
      if (el.nodeType === 1) {
        if (isSkipEl(el)) return true;
        el = el.parentNode;
      } else if (el.nodeType === 11 && el.host) {
        el = el.host;
      } else {
        break;
      }
    }
    return false;
  }

  // ───────────────────────── 漏译收集 ─────────────────────────

  /** 收集漏译文本（过滤逻辑见 missingCandidate） */
  function collectMissing(raw) {
    const s = missingCandidate(raw);
    if (s !== null) missing.add(s);
  }

  // ───────────────────────── 节点处理 ─────────────────────────

  function processText(node) {
    const cur = node.nodeValue;
    const st = textState.get(node);
    if (st && cur === st.tr) return;           // 自己写入的译文，跳过（防死循环）
    const out = translateRaw(cur);
    if (out === null) {
      if (st) textState.delete(node);          // React 把文字改成了新的英文
      collectMissing(cur);
      return;
    }
    if (out === cur) return;
    textState.set(node, { orig: cur, tr: out });
    node.nodeValue = out;
  }

  function isButtonInput(el) {
    return el.tagName === 'INPUT' && BUTTON_TYPES.has((el.getAttribute('type') || '').toLowerCase());
  }

  function processAttr(el, name) {
    if (name === 'value' && !isButtonInput(el)) return;   // 不碰可编辑 input 的值
    const cur = el.getAttribute(name);
    if (cur === null) return;
    let map = attrState.get(el);
    const st = map && map.get(name);
    if (st && cur === st.tr) return;
    const out = translateRaw(cur);
    if (out === null) {
      if (st) map.delete(name);
      collectMissing(cur);
      return;
    }
    if (out === cur) return;
    if (!map) { map = new Map(); attrState.set(el, map); }
    map.set(name, { orig: cur, tr: out });
    el.setAttribute(name, out);
  }

  /** 遍历 root 子树（跳过应忽略的子树），对元素/文本节点回调；并发现 shadowRoot */
  function walk(root, onEl, onText) {
    const visitEl = (el) => {
      onEl(el);
      if (el.shadowRoot) hookShadow(el.shadowRoot, onEl, onText);
    };
    if (root.nodeType === 1) visitEl(root);
    const walker = document.createTreeWalker(root, 1 | 4, {
      acceptNode: (n) => (n.nodeType === 1 && isSkipEl(n) ? 2 /* REJECT */ : 1 /* ACCEPT */),
    });
    let n;
    while ((n = walker.nextNode())) {
      if (n.nodeType === 1) visitEl(n); else onText(n);
    }
  }

  /**
   * React 常把一句话拆成多个相邻文本节点（如 "Provisioning support" / " required" / "."）。
   * 元素的子节点全为文本节点且非空节点 ≥2 时，拼接后只查 DICT；命中则译文写进第一个非空节点，
   * 其余置空，并照常记入 textState，保证切回英文可完整还原、后续逐节点处理因 cur===tr 跳过。
   */
  function processJoined(el) {
    const kids = el.childNodes;
    if (kids.length < 2) return;
    const nonEmpty = [];
    for (const k of kids) {
      if (k.nodeType !== 3) return;
      if (normalize(k.nodeValue) !== '') nonEmpty.push(k);
    }
    if (nonEmpty.length < 2) return;
    const texts = nonEmpty.map((k) => k.nodeValue);
    const tr = translateJoined(texts);
    if (tr === null) return;
    const first = nonEmpty[0];
    const lead = /^\s*/.exec(texts[0])[0];
    const trail = /\s*$/.exec(texts[texts.length - 1])[0];
    const out = lead + tr + trail;
    nonEmpty.forEach((k, i) => {
      textState.set(k, { orig: texts[i], tr: k === first ? out : '' });
      k.nodeValue = k === first ? out : '';
    });
  }

  const translateEl = (el) => {
    processJoined(el);
    for (const a of ATTRS) if (el.hasAttribute(a)) processAttr(el, a);
  };

  function hookShadow(sr, onEl, onText) {
    if (!observedRoots.has(sr)) {
      observedRoots.add(sr);
      shadowRefs.push(new WeakRef(sr));
      observer.observe(sr, OBSERVE_OPTS);
    }
    walk(sr, onEl, onText);
  }

  /** 翻译某节点（文本节点或元素子树） */
  function scan(node) {
    if (!enabled) return;
    if (node.nodeType === 3) {
      if (!isSkipped(node)) {
        if (node.parentNode && node.parentNode.nodeType === 1) processJoined(node.parentNode);
        processText(node);
      }
    } else if (node.nodeType === 1 || node.nodeType === 11) {
      if (node.nodeType === 1 && isSkipped(node)) return;
      walk(node, translateEl, processText);
    }
  }

  /** 还原某子树为英文原文 */
  function restore(root) {
    const restoreEl = (el) => {
      const map = attrState.get(el);
      if (!map) return;
      for (const [name, st] of map) {
        if (el.getAttribute(name) === st.tr) el.setAttribute(name, st.orig);
      }
      attrState.delete(el);
    };
    const restoreText = (n) => {
      const st = textState.get(n);
      if (st && n.nodeValue === st.tr) n.nodeValue = st.orig;
      textState.delete(n);
    };
    walk(root, restoreEl, restoreText);
  }

  // ───────────────────────── MutationObserver 批处理 ─────────────────────────

  const OBSERVE_OPTS = {
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATTRS,
    subtree: true,
  };

  const pending = new Set();
  let scheduled = false;

  function flush() {
    scheduled = false;
    const nodes = Array.from(pending);
    pending.clear();
    for (const n of nodes) {
      try { scan(n); } catch (e) { /* 单个节点失败不影响其余 */ }
    }
  }

  const observer = new MutationObserver((records) => {
    if (!enabled) return;
    for (const r of records) {
      if (r.type === 'childList') {
        for (const n of r.addedNodes) if (n.nodeType === 1 || n.nodeType === 3) pending.add(n);
      } else if (r.type === 'characterData') {
        pending.add(r.target);
      } else if (r.type === 'attributes') {
        pending.add(r.target);                 // 元素自身，scan 时也会顺带处理其子树
      }
    }
    if (pending.size && !scheduled) {
      scheduled = true;
      queueMicrotask(flush);                   // 微任务批处理：同一轮渲染内合并，避免闪烁
    }
  });

  // ───────────────────────── 切换与导出 ─────────────────────────

  function scanAll() {
    scan(document.documentElement);
  }

  function restoreAll() {
    restore(document.documentElement);
    for (const ref of shadowRefs) {
      const sr = ref.deref();
      if (sr) restore(sr);
    }
  }

  function toggle() {
    enabled = !enabled;
    saveEnabled(enabled);
    if (enabled) scanAll(); else { pending.clear(); restoreAll(); }
    console.info('[AppleDevZh] ' + (enabled ? '已启用中文' : '已切回英文（翻译暂停）'));
    return enabled;
  }

  function exportMissing() {
    const json = JSON.stringify(Array.from(missing).sort(), null, 2);
    console.log('[AppleDevZh] 未翻译文本 ' + missing.size + ' 条：\n' + json);
    try {
      navigator.clipboard.writeText(json).then(
        () => console.info('[AppleDevZh] 已复制到剪贴板'),
        () => console.warn('[AppleDevZh] 复制失败（页面可能未获焦点），请从控制台手动复制'),
      );
    } catch (e) {
      console.warn('[AppleDevZh] 剪贴板不可用，请从控制台手动复制');
    }
    return json;
  }

  // ───────────────────────── 启动 ─────────────────────────

  // 调试接口默认不暴露；仅当页面 localStorage 存在 appleDevZh.debug=1 时，
  // 才通过 unsafeWindow 暴露 window.__appleDevZh = { missing, dict, toggle }（避免页面脚本读取/调用）。
  try {
    if (localStorage.getItem('appleDevZh.debug') === '1') {
      const pageWin = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
      pageWin.__appleDevZh = { missing, dict: DICT, toggle };
    }
  } catch (e) { /* 忽略 */ }

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('切换中文/英文', toggle);
    GM_registerMenuCommand('导出未翻译文本', exportMissing);
  }

  observer.observe(document.documentElement, OBSERVE_OPTS);
  if (enabled) scanAll();
  document.addEventListener('DOMContentLoaded', () => { if (enabled) scanAll(); });
})();
