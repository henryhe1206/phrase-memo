import { candidates } from './wordForms';

/** [音标, 中文释义（多行）, 原形（可选）]；变化形式没有自己的释义时前两项为空 */
type Entry = [phonetic: string, translation: string, lemma?: string];
type Dict = Record<string, Entry>;

export interface LookupResult {
  word: string;
  phonetic: string;
  translation: string;
  /** 当前词是变化形式时的原形（如 went → go、peanuts → peanut） */
  base?: string;
  lemma?: { word: string; phonetic: string; translation: string };
}

let loading: Promise<Dict> | null = null;

export function loadDict(): Promise<Dict> {
  loading ??= fetch(`${import.meta.env.BASE_URL}dict.json`)
    .then((res) => {
      if (!res.ok) throw new Error(`词典加载失败（${res.status}）`);
      return res.json() as Promise<Dict>;
    })
    .catch((e) => {
      loading = null;
      throw e;
    });
  return loading;
}

export function lookup(dict: Dict, raw: string): LookupResult | null {
  const key = candidates(raw).find((c) => dict[c]);
  if (!key) return null;

  const entry = dict[key];
  const lemmaWord = entry[2];
  const lemmaEntry = lemmaWord ? dict[lemmaWord] : undefined;
  const lemma =
    lemmaWord && lemmaEntry
      ? { word: lemmaWord, phonetic: lemmaEntry[0], translation: lemmaEntry[1] }
      : undefined;

  return {
    word: key,
    phonetic: entry[0] || lemma?.phonetic || '',
    translation: entry[1] || lemma?.translation || '',
    // 自己没有释义时已经直接用原形的释义，不再重复展示
    lemma: entry[1] ? lemma : undefined,
    base: lemmaWord ?? (key !== raw.toLowerCase() ? key : undefined),
  };
}
