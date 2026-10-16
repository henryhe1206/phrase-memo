// 用法：node scripts/build-dict.mjs <stardict.db 路径> [词频上限，默认 30000]
// 从 ECDICT 的 SQLite 数据库中裁剪常用词，输出 public/dict.json
import { DatabaseSync } from 'node:sqlite';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const [dbPath, limitArg] = process.argv.slice(2);
if (!dbPath) {
  console.error('用法：node scripts/build-dict.mjs <stardict.db 路径> [词频上限]');
  process.exit(1);
}
const limit = Number(limitArg ?? 30000);

const db = new DatabaseSync(dbPath, { readOnly: true });
const rows = db
  .prepare(
    `SELECT word, phonetic, translation, exchange, frq, bnc, oxford, tag FROM stardict
     WHERE translation IS NOT NULL AND translation != ''`,
  )
  .all();

const rankOf = (r) => {
  const ranks = [r.frq, r.bnc].filter((n) => n > 0);
  return ranks.length ? Math.min(...ranks) : Infinity;
};

const MAX_LINES = 4;
const clean = (t) =>
  t
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('[网络]'))
    .slice(0, MAX_LINES)
    .join('\n');

const dict = {};
const exchangeOf = {};
for (const r of rows) {
  if (!/^[A-Za-z][A-Za-z'-]*$/.test(r.word)) continue;
  const common = rankOf(r) <= limit || r.oxford === 1 || (r.tag && r.tag.trim());
  if (!common) continue;

  const key = r.word.toLowerCase();
  // 同名词条（如 Turkey / turkey）优先保留小写形式
  if (dict[key] && r.word !== key) continue;

  const translation = clean(r.translation);
  if (!translation) continue;

  const lemma = /(?:^|\/)0:([^/]+)/.exec(r.exchange ?? '')?.[1]?.toLowerCase();
  const entry = [r.phonetic ?? '', translation];
  if (lemma && lemma !== key) entry.push(lemma);
  dict[key] = entry;
  exchangeOf[key] = r.exchange ?? '';
}

// 规则变化（加 s / es / ed / ing 等）由前端按规则还原，这里只收不规则的
const isRegular = (base, form) => {
  const stem = base.endsWith('e') ? base.slice(0, -1) : base;
  const last = base.at(-1);
  const forms = [
    `${base}s`,
    `${base}es`,
    `${base}ed`,
    `${base}d`,
    `${stem}ing`,
    `${base}${last}ed`,
    `${base}${last}ing`,
  ];
  if (base.endsWith('y')) forms.push(`${base.slice(0, -1)}ies`, `${base.slice(0, -1)}ied`);
  return forms.includes(form);
};

// 不规则变化形式（went、gone、children 等）：在原形词条的 exchange 里，反向映射回原形
for (const [base, exchange] of Object.entries(exchangeOf)) {
  for (const item of exchange.split('/')) {
    const [kind, form] = item.split(':');
    if (!form || kind === '0' || kind === '1') continue;
    const key = form.toLowerCase();
    if (/^[a-z'-]+$/.test(key) && !dict[key] && !isRegular(base, key)) dict[key] = ['', '', base];
  }
}

const out = fileURLToPath(new URL('../public/dict.json', import.meta.url));
const json = JSON.stringify(dict);
writeFileSync(out, json);
console.log(`词条数 ${Object.keys(dict).length}，文件 ${(json.length / 1024 / 1024).toFixed(2)} MB（按字符数估算）`);
