import { useState } from 'react';
import { COLLOCATIONS, PREPOSITIONS, TIME_PLACE_COMPARE } from '../data/grammar';
import { CollocationBlock, PrepositionBlock } from '../components/GrammarBlocks';
import { speak } from '../tts';
import type { Settings } from '../types';

function CompareTable({ title, rows }: { title: string; rows: { prep: string; rule: string; examples: string }[] }) {
  return (
    <>
      <h4>{title}</h4>
      <table className="compare">
        <tbody>
          {rows.map((r) => (
            <tr key={r.prep}>
              <th>{r.prep}</th>
              <td>
                <b>{r.rule}</b>
                <div className="sub-text">{r.examples}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default function Grammar({ settings }: { settings: Settings }) {
  const [query, setQuery] = useState('');
  const onSpeak = (text: string) => speak(text, settings);

  const q = query.trim().toLowerCase();
  const collocations = COLLOCATIONS.filter(
    (c) => !q || c.pattern.toLowerCase().includes(q) || c.meaning.includes(q) || c.words.some((w) => w.includes(q)),
  );

  return (
    <section className="panel">
      <h3>at / in / on 对比</h3>
      <CompareTable title="表示时间" rows={TIME_PLACE_COMPARE.time} />
      <CompareTable title="表示地点" rows={TIME_PLACE_COMPARE.place} />

      <h3>常用介词</h3>
      <p className="hint">点开每个介词，看它后面接什么。学习时点击句子里的单词也能直接看到。</p>
      {PREPOSITIONS.map((p) => (
        <details key={p.word} className="prep">
          <summary>
            <b>{p.word}</b>
            <span className="sub-text"> {p.summary}</span>
          </summary>
          <PrepositionBlock prep={p} onSpeak={onSpeak} />
        </details>
      ))}

      <h3>固定搭配</h3>
      <input
        placeholder="搜索搭配、中文或关键词"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <p className="hint">共 {collocations.length} 条</p>
      {collocations.map((c) => (
        <CollocationBlock key={c.pattern} c={c} onSpeak={onSpeak} />
      ))}
    </section>
  );
}
