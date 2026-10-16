import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { today } from '../srs';
import { speak } from '../tts';
import ClickableText from '../components/ClickableText';
import WordPanel from '../components/WordPanel';
import type { Card, Rating, ReviewLog, Settings } from '../types';

interface Props {
  settings: Settings;
  onBack: () => void;
}

interface Reviewed {
  card: Card;
  times: number;
  lastRating: Rating;
  lastAt: number;
}

const RATING_LABEL = ['忘了', '模糊', '记得', '很熟'] as const;

/** 今天的复习记录按卡片归并：复习次数 + 最近一次的评分，最近复习的排在前面 */
async function loadToday(): Promise<Reviewed[]> {
  const logs = await db.logs.where('date').equals(today()).toArray();

  const tally = new Map<string, { times: number; last: ReviewLog }>();
  for (const log of logs) {
    const prev = tally.get(log.cardUid);
    tally.set(log.cardUid, {
      times: (prev?.times ?? 0) + 1,
      last: prev && prev.last.at > log.at ? prev.last : log,
    });
  }

  const entries = [...tally.entries()];
  const cards = await db.cards.bulkGet(entries.map(([uid]) => uid));
  return entries
    .flatMap(([, { times, last }], i) => {
      const card = cards[i];
      return card && card.deleted === 0 ? [{ card, times, lastRating: last.rating, lastAt: last.at }] : [];
    })
    .sort((a, b) => b.lastAt - a.lastAt);
}

export default function Today({ settings, onBack }: Props) {
  const items = useLiveQuery(loadToday, []);
  const [onlyForgotten, setOnlyForgotten] = useState(false);
  const [lookup, setLookup] = useState<{ word: string; context: string } | null>(null);
  const onWord = (word: string, context: string) => setLookup({ word, context });

  if (!items) return null;

  const shown = onlyForgotten ? items.filter((i) => i.lastRating <= 1) : items;
  const forgottenCount = items.filter((i) => i.lastRating <= 1).length;

  return (
    <section className="panel">
      <div className="study-top">
        <button className="link" onClick={onBack}>
          ← 返回
        </button>
        <span>今天复习了 {items.length} 张</span>
      </div>

      <label className="check">
        <input type="checkbox" checked={onlyForgotten} onChange={(e) => setOnlyForgotten(e.target.checked)} />
        只看没记牢的（忘了 / 模糊，共 {forgottenCount} 张）
      </label>

      {shown.length === 0 && (
        <p className="hint">{items.length === 0 ? '今天还没有复习过卡片。' : '没有需要再看的卡片 🎉'}</p>
      )}

      <ul className="list">
        {shown.map(({ card, times, lastRating }) => (
          <li key={card.uid}>
            <div>
              <b>
                <ClickableText text={card.text} onWord={onWord} />
              </b>
              <button className="speaker small" onClick={() => speak(card.text, settings)}>
                🔊
              </button>
              <span className={`tag rated r${lastRating}`}>
                {RATING_LABEL[lastRating]}
                {times > 1 && ` · ${times} 次`}
              </span>
              <div className="sub-text">{card.meaning}</div>
              {card.example && (
                <div className="example">
                  <ClickableText text={card.example} onWord={onWord} />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      {lookup && (
        <WordPanel
          key={lookup.word}
          word={lookup.word}
          context={lookup.context}
          settings={settings}
          onClose={() => setLookup(null)}
        />
      )}
    </section>
  );
}
