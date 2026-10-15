// 纯 Node 自测：用 vm 加载用户脚本（无 document 时只导出纯函数），不依赖 jsdom
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const file = join(dirname(fileURLToPath(import.meta.url)), 'apple-developer-zh.user.js');
const src = readFileSync(file, 'utf8');
const ctx = vm.createContext({});
vm.runInContext(src, ctx);
const { normalize, translateNorm, translateRaw, translateJoined, missingCandidate, DICT } = ctx.__appleDevZhTest;

let n = 0;
const eq = (a, b, msg) => { assert.equal(a, b, msg); n++; };

// 规范化
eq(normalize('  Hello \n\t World  '), 'Hello World', '合并空白');
eq(normalize('A B'), 'A B', 'NBSP');
eq(normalize('It’s “ok” ‘x’'), 'It\'s "ok" \'x\'', '弯引号');

// 词典 + 保留首尾空白
eq(translateRaw('  Certificates \n'), '  证书 \n', '保留空白');
eq(translateRaw('Not in dict'), null, '未命中');

// 日期
eq(translateNorm('Oct 15, 2026'), '2026年10月15日');
eq(translateNorm('October 15, 2026'), '2026年10月15日');
eq(translateNorm('Sept. 3, 2027'), '2027年9月3日');
eq(translateNorm('Expires Oct 15, 2026'), '到期日期：2026年10月15日');
eq(translateNorm('Expires: October 5, 2026'), '到期日期：2026年10月5日');
eq(translateNorm('Foo Oct 15, 2026'), null, '未知前缀不翻译');

// 其他规则
eq(translateNorm('Welcome, Appleseed'), '欢迎，Appleseed');
eq(translateNorm('25 items'), '25 项');
eq(translateNorm('1 result'), '1 条结果');
eq(translateNorm('Page 2 of 5'), '第 2 页，共 5 页');
eq(translateNorm('Team ID: ABC123DEF4'), '团队 ID：ABC123DEF4');

// ── 第二轮新增规则 ──
// 重置日期
eq(translateNorm('- Resets on Nov 14, 2026'), '- 2026年11月14日重置');
// 日期区间：同年 / 跨年
eq(translateNorm('Sep 15 - Oct 15, 2026'), '2026年9月15日 - 10月15日');
eq(translateNorm('Dec 15, 2025 - Jan 15, 2026'), '2025年12月15日 - 2026年1月15日');
eq(translateNorm('September 1 \u2013 October 1, 2026'), '2026年9月1日 - 10月1日');
// (Expiring MM/DD/YYYY) 括注
eq(translateNorm('Worldwide Developer Relations - G4 (Expiring 12/10/2030)'), 'Worldwide Developer Relations - G4（2030年12月10日到期）');
eq(translateNorm('Worldwide Developer Relations Certificate Authority (Expiring 02/07/2023)'), 'Worldwide Developer Relations Certificate Authority（2023年2月7日到期）');
// Enabled {词典项} ({n}) 与 {词典项} ({n})
eq(translateNorm('Enabled App Groups (5)'), '已启用的 App 小组 (5)');
eq(translateNorm('Enabled Merchant IDs (0)'), '已启用的商家 ID (0)');
eq(translateNorm('Certificates (1)'), '证书 (1)');
eq(translateNorm('Foo Bar (3)'), null, '前半部分不在词典则不翻');
eq(translateNorm('Enabled Foo Bar (3)'), null);
// total / calls available
eq(translateNorm('6 total'), '共 6 个');
eq(translateNorm('100 % of calls available'), '可用调用次数 100%');
// (explicit)/(wildcard)
eq(translateNorm('es.example.app (explicit)'), 'es.example.app (精确)');
eq(translateNorm('es.example.* (wildcard)'), 'es.example.* (通配符)');
// aria-label
eq(translateNorm('Request capability CarPlay Audio App'), '申请功能：CarPlay 音频 App');
eq(translateNorm('Request capability Unknown Thing'), '申请功能：Unknown Thing');
// 逗号列表
eq(translateNorm('Development, Ad hoc, App Store Connect, Developer ID'), '开发、Ad Hoc、App Store Connect、Developer ID');
eq(translateNorm('Access Wi-Fi Information, App Groups, Wireless Accessory Configuration'), '访问 Wi-Fi 信息、App 小组、无线配件配置');
eq(translateNorm('App Groups, Some Unknown Cap'), null, '须全部命中，部分命中不翻');
eq(translateNorm('iOS, iPadOS, macOS, tvOS, watchOS, visionOS'), null, '平台列表不翻');
eq(translateNorm('Hello there, this is a long sentence that has many words in it.'), null, '描述句不误伤');
eq(translateNorm('Foo, Bar, Baz'), null, '全不命中不翻');
// 术语一致性抽查
eq(DICT['Bundle ID'], '套装 ID');
eq(DICT['Save'], '存储');
eq(DICT['Profiles'], '描述文件');
eq(DICT['Sign in with Apple'], '通过 Apple 登录');
for (const k of ['iOS', 'macOS', 'tvOS', 'watchOS', 'visionOS']) assert.ok(!(k in DICT), k + ' 不应在词典'), n++;
for (const k of Object.keys(DICT)) assert.ok(!/com\.apple\./.test(k), 'entitlement 不应在词典: ' + k);

// ── 第三轮 ──
// 标题规则与逗号列表「全部命中」
eq(translateNorm('Certificates, Identifiers & Profiles - Apple Developer'), '证书、标识符和描述文件 - Apple 开发者');
eq(translateNorm('Certificates, Identifiers & Foo'), null, '部分命中不翻');
eq(translateNorm('Certificates, Identifiers'), '证书、标识符', '两项都在词典，按规则逐项翻');
eq(translateNorm('Development, Ad hoc, App Store Connect'), '开发、Ad Hoc、App Store Connect');
eq(translateNorm('Unknown Page - Apple Developer'), null, '标题前半不在词典则放弃');
// 相邻文本节点拼接
eq(translateJoined(['Provisioning support', ' required', '.']), '需要描述文件支持。');
eq(translateJoined(['Provisioning support', ' required']), null, '无句号不命中该句');
eq(translateJoined(['Foo', 'bar']), null);
eq(DICT['required'], '必需');
// 漏译过滤
eq(missingCandidate('Some real label'), 'Some real label');
eq(missingCandidate('iOS'), null);
eq(missingCandidate('iOS, iPadOS, macOS, tvOS, watchOS, visionOS'), null);
eq(missingCandidate('iPadOS / , macOS'), null);
eq(missingCandidate('com.apple.developer.healthkit'), null);
eq(missingCandidate('es.example.app'), null);
eq(missingCandidate('aps-environment'), null);
eq(missingCandidate('inter-app-audio'), null);
eq(missingCandidate('Wi-Fi Aware'), 'Wi-Fi Aware', '含空格的连字符不过滤');

// ── 第四轮 ──
// 拼接句走词典 + 规则（排除逗号列表）
eq(translateJoined(['1', ' of ', '5', ' ', 'item(s) selected']), '已选择 1/5 项');
eq(translateJoined(['Certificates', ', ', 'Identifiers']), null, '拼接句不走逗号列表规则');
// 新规则
eq(translateNorm('Sep 16'), '9月16日');
eq(translateNorm('Oct 04'), '10月4日');
eq(translateNorm('Sep 15 - Oct 15, 2026'), '2026年9月15日 - 10月15日', '区间规则不被短日期抢先');
eq(translateNorm('Oct 15, 2026'), '2026年10月15日', '完整日期不受短日期影响');
eq(translateNorm('6 App IDs'), '6 个 App ID');
eq(translateNorm('1 Selected'), '已选择 1 项');
eq(translateNorm('5 Selected'), '已选择 5 项');
eq(translateNorm('2 of 5 items selected'), '已选择 2/5 项');
eq(translateNorm('0 results available. Select is focused ,type to refine list, press Down to open the menu,'),
  '有 0 个结果。选择框已聚焦，输入可筛选，按下方向键打开菜单。');
eq(translateNorm('12 results available. Select is focused ,type to refine list, press Down to open the menu,'),
  '有 12 个结果。选择框已聚焦，输入可筛选，按下方向键打开菜单。');
// 漏译收集：放宽长度上限、过滤 UDID
const longPara = 'Certificates issued from the Developer ID G2 intermediary certificate authority '.repeat(8).trim();
eq(missingCandidate(longPara), normalize(longPara), '长段落可进入漏译集合');
eq(missingCandidate('00008000-000A1B2C3D4E5F60'), null, 'UDID 不收集');
eq(missingCandidate('A1B2C3D4-E5F6-4789-8ABC-0123456789AB'), null, 'UUID 不收集');
// 片段词条
for (const [k, v] of [['Enter your', '输入你的'], ['Pass', 'Pass'], ['certificate Name', '证书名称'], ['will be displayed.', '。'], [': App ID Configuration', '：App ID 配置'], ['App', 'App'], ['ID', 'ID']]) eq(translateNorm(k), v, '片段 ' + k);

// ── 第五轮 ──
// 设备型号
eq(translateNorm('iPad Mini 6th Generation'), 'iPad mini（第 6 代）');
eq(translateNorm('iPad Pro 11-inch Wi-Fi (4th generation)'), 'iPad Pro 11 英寸 Wi-Fi（第 4 代）');
eq(translateNorm('iPhone 15 Pro Max'), null, '无代数/尺寸保持原样');
eq(translateNorm('Machine 5th generation'), null, '非设备名开头不处理') ;
eq(translateNorm('Device Model'), '设备型号');
// 功能名新策略：纯品牌名保持英文，其余翻译并保留框架名
eq(translateNorm('StoreKit External Purchases or Offers (EU)'), 'StoreKit 外部购买或优惠（欧盟）');
eq(translateNorm('DriverKit Family Audio'), 'DriverKit 音频系列');
eq(translateNorm('DriverKit Family Audio (development)'), 'DriverKit 音频系列（开发）');
eq(translateNorm('DriverKit USB Transport - VendorID and ProductID'), 'DriverKit USB 传输 - VendorID 和 ProductID');
eq(translateNorm('Web Browser Engine Rendering'), '网页浏览器引擎 - 渲染');
eq(translateNorm('Push to Talk'), '一键通话');
eq(translateNorm('eSim'), 'eSIM');
eq(translateNorm('App Attest'), 'App Attest', '纯品牌名保持英文');
eq(translateNorm('None'), '无');
eq(translateNorm('Other'), '其他');
eq(translateNorm('about how to create tokens for the Apple Maps Server API.'), '如何为 Apple Maps Server API 创建令牌。');

// source/ui-strings-*.json 为本地采集稿（已 gitignore），存在时逐条检查命中，不存在则跳过
import { existsSync } from 'node:fs';
for (const name of ['ui-strings-2.json', 'ui-strings-3.json']) {
  const f = join(dirname(fileURLToPath(import.meta.url)), 'source', name);
  if (!existsSync(f)) { console.log(`（未找到 source/${name}，跳过采集稿覆盖检查）`); continue; }
  const data = JSON.parse(readFileSync(f, 'utf8'));
  const miss = [];
  let total = 0;
  for (const [g, arr] of Object.entries(data)) {
    if (g === '_note') continue;
    for (const raw of arr) {
      if (/^型号名示例/.test(raw)) continue;   // 说明文字，不是原文
      const s = raw.split('←')[0].replace(/^@[\w-]+:\s*/, '');
      const cands = /^(Sep 16 \/|1 Selected \/)/.test(s) ? s.split(' / ') : [s];
      for (const c of cands) {
        total++;
        if (translateNorm(normalize(c)) === null) miss.push(c);
      }
    }
  }
  assert.deepEqual(miss, [], `${name} 漏译: ` + JSON.stringify(miss));
  n++;
  console.log(`${name}：${total} 条全部命中`);
}

// 译文以全角左括号开头时也丢掉前导空白（「端点（可选）」）
eq(translateRaw(' (Optional)'), '（可选）', '全角括号前不留空格');
eq(translateNorm('Create Services ID'), '创建服务 ID', '服务 ID 用词统一');

// DICT 区块必须是合法 JSON，且位于标记之间
const m = /\/\/ ==DICT START==\s*const DICT = (\{[\s\S]*?\});\s*\/\/ ==DICT END==/.exec(src);
assert.ok(m, '找不到 DICT 标记');
const parsed = JSON.parse(m[1]);
eq(Object.keys(parsed).length, Object.keys(DICT).length, '词条数一致');
for (const k of Object.keys(parsed)) assert.equal(k, normalize(k), '键需已规范化: ' + k);
console.log(`通过 ${n} 项断言，词典 ${Object.keys(parsed).length} 条`);
