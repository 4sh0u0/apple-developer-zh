// DOM 级测试：在 jsdom 中运行真实的油猴脚本文件，验证拆分句合并、标题、动态插入、切换还原
// 用法：npm install && node test-dom.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const scriptPath = fileURLToPath(new URL('./apple-developer-zh.user.js', import.meta.url));

const html = `<!doctype html><html><head><title>Certificates, Identifiers &amp; Profiles - Apple Developer</title></head><body>
<div id="j"></div>
<div id="k"></div>
<span id="s">Certificates</span>
<span id="d">Development, Ad hoc, App Store Connect</span>
<span id="p">iOS, visionOS</span>
<input id="q" placeholder="Search">
<input id="v" value="Certificates">
<code id="c">Certificates</code>
<span id="e">Enabled App Groups (5)</span>
<span id="b">es.example.app (explicit)</span>
<span id="w">- Resets on Nov 14, 2026</span>
<span id="n">&nbsp; Continue &nbsp;</span>
</body></html>`;

const dom = new JSDOM(html, { url: 'https://developer.apple.com/account/resources/identifiers/list', runScripts: 'outside-only' });
const { window } = dom;
const doc = window.document;
// 模拟 React 把一句话拆成三个相邻文本节点
const j = doc.getElementById('j');
['Provisioning support', ' required', '.'].forEach((t) => j.appendChild(doc.createTextNode(t)));
// 模拟 React 把 "{a} of {b} item(s) selected" 拆成多个相邻文本节点
const k = doc.getElementById('k');
['1', ' of ', '5', ' ', 'item(s) selected'].forEach((t) => k.appendChild(doc.createTextNode(t)));
window.localStorage.setItem('appleDevZh.debug', '1');

window.eval(readFileSync(scriptPath, 'utf8'));
const tick = () => new Promise((r) => setTimeout(r, 20));

let pass = 0, fail = 0;
const eq = (name, got, want) => {
  if (got === want) { pass++; } else { fail++; console.log(`✗ ${name}\n   得到: ${JSON.stringify(got)}\n   期望: ${JSON.stringify(want)}`); }
};
const txt = (id) => doc.getElementById(id).textContent;

await tick();
eq('标题', doc.title, '证书、标识符和描述文件 - Apple 开发者');
eq('拆分句合并', txt('j'), '需要描述文件支持。');
eq('拆分句合并（含规则）', txt('k'), '已选择 1/5 项');
eq('普通词条', txt('s'), '证书');
eq('描述文件类型列表', txt('d'), '开发、Ad Hoc、App Store Connect');
eq('平台列表不翻', txt('p'), 'iOS, visionOS');
eq('placeholder', doc.getElementById('q').getAttribute('placeholder'), '搜索');
eq('可编辑 input 的 value 不翻', doc.getElementById('v').getAttribute('value'), 'Certificates');
eq('code 内不翻', txt('c'), 'Certificates');
eq('Enabled 计数', txt('e'), '已启用的 App 小组 (5)');
eq('Bundle ID 后缀', txt('b'), 'es.example.app (精确)');
eq('重置日期', txt('w'), '- 2026年11月14日重置');
eq('保留首尾空白', txt('n'), '  继续  ');

// 动态插入（模拟 SPA 路由切换后渲染新内容）
const dyn = doc.createElement('span');
dyn.textContent = 'Register a New Device';
doc.body.appendChild(dyn);
// 模拟 React 把已翻译文本改回新的英文
doc.getElementById('s').firstChild.nodeValue = 'Devices';
doc.getElementById('q').setAttribute('placeholder', 'Search');
await tick();
eq('动态插入', dyn.textContent, '注册新设备');
eq('React 改写文本后重翻', txt('s'), '设备');
eq('React 改写属性后重翻', doc.getElementById('q').getAttribute('placeholder'), '搜索');

// 切回英文
const api = window.__appleDevZh;
eq('调试接口已暴露（debug=1）', typeof api?.toggle, 'function');
api.toggle();
await tick();
eq('还原：标题', doc.title, 'Certificates, Identifiers & Profiles - Apple Developer');
eq('还原：拆分句', txt('j'), 'Provisioning support required.');
eq('还原：规则拼接句', txt('k'), '1 of 5 item(s) selected');
eq('还原：改写后的文本', txt('s'), 'Devices');
eq('还原：动态插入', dyn.textContent, 'Register a New Device');
eq('还原：placeholder', doc.getElementById('q').getAttribute('placeholder'), 'Search');
eq('还原：保留空白', txt('n'), '  Continue  ');
// 英文模式下新增内容不翻译
const dyn2 = doc.createElement('span');
dyn2.textContent = 'Certificates';
doc.body.appendChild(dyn2);
await tick();
eq('英文模式不翻新内容', dyn2.textContent, 'Certificates');
eq('切换状态已保存', window.localStorage.getItem('appleDevZh.enabled'), '0');

// 再切回中文
api.toggle();
await tick();
eq('再切中文：拆分句', txt('j'), '需要描述文件支持。');
eq('再切中文：规则拼接句', txt('k'), '已选择 1/5 项');
eq('再切中文：新内容', dyn2.textContent, '证书');
eq('再切中文：标题', doc.title, '证书、标识符和描述文件 - Apple 开发者');

console.log(`DOM 测试：通过 ${pass} 项，失败 ${fail} 项；漏译集合 ${api.missing.size} 条：${JSON.stringify([...api.missing])}`);
process.exit(fail ? 1 : 0);
