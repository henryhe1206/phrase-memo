import { useEffect, useRef, useState } from 'react';
import { db, liveCards, touch } from '../db';
import { scheduleSync } from '../sync';
import ClickableText from '../components/ClickableText';
import WordPanel from '../components/WordPanel';
import { buildQueue, makeCloze, modeOf, schedule, today } from '../srs';
import { speak } from '../tts';
import type { Card, Rating, Settings } from '../types';

interface Props {
  settings: Settings;
  scene?: string;
  onExit: () => void;
}

const RATINGS: { rating: Rating; label: string }[] = [
  { rating: 0, label: '忘了' },
  { rating: 1, label: '模糊' },
  { rating: 2, label: '记得' },
  { rating: 3, label: '很熟' },
];

const MODE_LABEL = {
  recall: '看中文，说出英文',
  cloze: '填空搭配',
  listen: '听音复述',
} as const;

export default function Study({ settings, scene, onExit }: Props) {
  const [queue, setQueue] = useState<Card[] | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(0);
  const [word, setWord] = useState<string | null>(null);
  const busy = useRef(false);

  useEffect(() => {
    liveCards().then((all) => setQueue(buildQueue(all, settings, scene)));
    // 队列只在进入学习页时构建一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const card = queue?.[0];
  const mode = card ? modeOf(card) : null;

  // 听音模式：卡片出现时自动朗读
  useEffect(() => {
    if (card && mode === 'listen' && !flipped) speak(card.text, settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.uid, mode]);

  async function rate(rating: Rating) {
    if (!card || !queue || busy.current) return;
    busy.current = true;
    const patch = schedule(card, rating);
    const stamp = touch();
    await db.cards.update(card.uid, { ...patch, ...stamp });
    await db.logs.add({
      uid: crypto.randomUUID(),
      cardUid: card.uid,
      date: today(),
      rating,
      at: stamp.updatedAt,
      dirty: 1,
    });
    scheduleSync();
    const rest = queue.slice(1);
    setQueue(rating === 0 ? [...rest, { ...card, ...patch, ...stamp }] : rest);
    setFlipped(false);
    setDone((d) => d + 1);
    busy.current = false;
  }

  function flip() {
    if (!card) return;
    setFlipped(true);
    speak(card.text, settings);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (word !== null) return; // 查词面板打开时，不响应翻面和评分快捷键
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!flipped) flip();
      } else if (flipped && ['1', '2', '3', '4'].includes(e.key)) {
        rate((Number(e.key) - 1) as Rating);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!queue) return null;

  if (!card || !mode) {
    return (
      <section className="panel center">
        <h2>本轮完成 🎉</h2>
        <p>共完成 {done} 次复习。</p>
        <button className="primary" onClick={onExit}>
          返回首页
        </button>
      </section>
    );
  }

  const cloze = mode === 'cloze' ? makeCloze(card.text) : null;

  return (
    <section className="panel study">
      <div className="study-top">
        <button className="link" onClick={onExit}>
          ← 退出
        </button>
        <span>
          剩余 {queue.length} · {card.scene} · {MODE_LABEL[mode]}
        </span>
      </div>

      <div className="card">
        {!flipped && (
          <>
            {mode === 'recall' && <div className="big-text">{card.meaning}</div>}
            {mode === 'cloze' && (
              <>
                <div className="sub-text">{card.meaning}</div>
                <div className="big-text">{cloze!.masked}</div>
              </>
            )}
            {mode === 'listen' && (
              <>
                <button className="speaker" onClick={() => speak(card.text, settings)}>
                  🔊
                </button>
                <div className="sub-text">听一遍，尝试跟读并回忆意思</div>
              </>
            )}
            <p className="hint">先开口说出来，再翻面核对</p>
          </>
        )}

        {flipped && (
          <>
            <div className="big-text">
              <ClickableText text={card.text} onWord={setWord} />
              <button className="speaker small" onClick={() => speak(card.text, settings)}>
                🔊
              </button>
            </div>
            {cloze && <div className="sub-text">填空答案：{cloze.answer}</div>}
            <div className="sub-text">{card.meaning}</div>
            {card.example && (
              <div className="example">
                <ClickableText text={card.example} onWord={setWord} />
              </div>
            )}
            <p className="hint">点击英文单词可查看发音、释义和语法搭配</p>
            {card.note && <div className="note">{card.note}</div>}
          </>
        )}
      </div>

      {!flipped ? (
        <button className="primary big" onClick={flip}>
          翻面（空格）
        </button>
      ) : (
        <div className="rating-row">
          {RATINGS.map(({ rating, label }) => (
            <button key={rating} className={`rate r${rating}`} onClick={() => rate(rating)}>
              <b>{label}</b>
              <small>{rating === 0 ? '稍后' : `${schedule(card, rating).interval} 天`}</small>
              <kbd>{rating + 1}</kbd>
            </button>
          ))}
        </div>
      )}

      {word !== null && <WordPanel key={word} word={word} settings={settings} onClose={() => setWord(null)} />}
    </section>
  );
}
