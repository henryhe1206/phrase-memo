import type { Card, Rating, Settings } from './types';

export function toDateStr(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export const today = () => toDateStr(new Date());

export function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return toDateStr(new Date(y, m - 1, d + n));
}

type Schedule = Pick<
  Card,
  'ease' | 'interval' | 'due' | 'reps' | 'lapses' | 'introduced' | 'introducedOn'
>;

/** 简化版 SM-2：0 忘了 / 1 模糊 / 2 记得 / 3 很熟 */
export function schedule(card: Card, rating: Rating): Schedule {
  const t = today();
  const introducedOn = card.introduced === 1 ? card.introducedOn : t;
  let { ease, interval, reps, lapses } = card;

  if (rating === 0) {
    return {
      ease: Math.max(1.3, ease - 0.2),
      interval: 1,
      due: t,
      reps: 0,
      lapses: lapses + 1,
      introduced: 1,
      introducedOn,
    };
  }

  if (rating === 1) {
    interval = reps === 0 ? 1 : Math.max(interval + 1, Math.round(interval * 1.2));
    ease = Math.max(1.3, ease - 0.15);
  } else if (rating === 2) {
    interval = reps === 0 ? 1 : reps === 1 ? 3 : Math.max(interval + 1, Math.round(interval * ease));
  } else {
    interval = reps === 0 ? 3 : Math.max(4, Math.round(interval * ease * 1.3));
    ease += 0.15;
  }

  return {
    ease,
    interval,
    due: addDays(t, interval),
    reps: reps + 1,
    lapses,
    introduced: 1,
    introducedOn,
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 今日队列：先到期复习，再补新卡（受每日上限限制） */
export function buildQueue(cards: Card[], settings: Settings, scene?: string): Card[] {
  const t = today();
  const inScope = scene ? cards.filter((c) => c.scene === scene) : cards;

  const due = inScope
    .filter((c) => c.introduced === 1 && c.due <= t)
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, settings.dailyReview);

  const newToday = cards.filter((c) => c.introducedOn === t).length;
  const quota = Math.max(0, settings.dailyNew - newToday);
  const fresh = shuffle(inScope.filter((c) => c.introduced === 0)).slice(0, quota);

  return [...due, ...fresh];
}

export type StudyMode = 'recall' | 'cloze' | 'listen';

export function modeOf(card: Card): StudyMode {
  const modes: StudyMode[] = ['recall', 'cloze', 'listen'];
  return modes[card.reps % 3];
}

/** 填空：挖掉最长的单词 */
export function makeCloze(text: string): { masked: string; answer: string } {
  const words = text.split(/\s+/);
  let best = 0;
  let bestLen = -1;
  words.forEach((w, i) => {
    const len = w.replace(/[^A-Za-z']/g, '').length;
    if (len > bestLen) {
      bestLen = len;
      best = i;
    }
  });
  const word = words[best];
  const core = word.replace(/[^A-Za-z']/g, '');
  const masked = words.map((w, i) => (i === best ? w.replace(core, '_____') : w)).join(' ');
  return { masked, answer: core };
}
