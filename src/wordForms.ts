const IRREGULAR_CONTRACTIONS: Record<string, string> = {
  "can't": 'can',
  "won't": 'will',
  "ain't": 'be',
};

const UNDOUBLE = /([^aeiou])\1$/;

/**
 * 返回单词可能的原形，按优先级排列（第一项是原词本身）。
 * 只处理规则变化；不规则变化（went、children 等）由词典数据里的原形字段处理。
 */
export function candidates(raw: string): string[] {
  const word = raw.toLowerCase();
  const out = [word];
  const add = (w: string) => w.length > 1 && !out.includes(w) && out.push(w);

  const contracted = IRREGULAR_CONTRACTIONS[word];
  if (contracted) add(contracted);
  const base = contracted ?? word.replace(/('s|n't|'ll|'re|'ve|'d|'m)$/, '');
  if (base !== word) add(base);
  // 单个字母的缩写（如 I'm 中的 I）不受长度限制
  if (base !== word && base.length === 1 && !out.includes(base)) out.push(base);

  if (base.endsWith('ies')) add(`${base.slice(0, -3)}y`);
  if (base.endsWith('ied')) add(`${base.slice(0, -3)}y`);
  for (const suffix of ['ing', 'ed']) {
    if (!base.endsWith(suffix)) continue;
    const stem = base.slice(0, -suffix.length);
    add(stem);
    add(`${stem}e`);
    if (UNDOUBLE.test(stem)) add(stem.slice(0, -1));
  }
  if (base.endsWith('es')) add(base.slice(0, -2));
  if (base.endsWith('s')) add(base.slice(0, -1));

  return out;
}
