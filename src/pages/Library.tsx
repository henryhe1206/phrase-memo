import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, liveCards, newCard, touch } from '../db';
import { scheduleSync } from '../sync';
import { SCENES, type Card } from '../types';

interface Draft {
  uid?: string;
  text: string;
  meaning: string;
  example: string;
  scene: string;
  note: string;
}

const EMPTY: Draft = { text: '', meaning: '', example: '', scene: SCENES[0], note: '' };

export default function Library() {
  const cards = useLiveQuery(liveCards, []);
  const [query, setQuery] = useState('');
  const [scene, setScene] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);

  if (!cards) return null;

  const q = query.trim().toLowerCase();
  const list = cards
    .filter((c) => !scene || c.scene === scene)
    .filter((c) => !q || c.text.toLowerCase().includes(q) || c.meaning.includes(q))
    .sort((a, b) => b.createdAt - a.createdAt);

  async function save() {
    if (!draft || !draft.text.trim() || !draft.meaning.trim()) return;
    const fields = {
      text: draft.text.trim(),
      meaning: draft.meaning.trim(),
      example: draft.example.trim(),
      scene: draft.scene,
      note: draft.note.trim(),
    };
    if (draft.uid !== undefined) await db.cards.update(draft.uid, { ...fields, ...touch() });
    else await db.cards.add(newCard(fields));
    setDraft(null);
    scheduleSync();
  }

  async function remove(c: Card) {
    if (!confirm(`删除「${c.text}」？学习进度也会一并删除。`)) return;
    await db.cards.update(c.uid, { deleted: 1, ...touch() });
    scheduleSync();
  }

  return (
    <section className="panel">
      <div className="toolbar">
        <input placeholder="搜索英文或中文" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select value={scene} onChange={(e) => setScene(e.target.value)}>
          <option value="">全部场景</option>
          {SCENES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button className="primary" onClick={() => setDraft(EMPTY)}>
          ＋ 新增
        </button>
      </div>

      {draft && (
        <div className="form">
          <input
            placeholder="英文短语 *"
            value={draft.text}
            onChange={(e) => setDraft({ ...draft, text: e.target.value })}
          />
          <input
            placeholder="中文释义 *"
            value={draft.meaning}
            onChange={(e) => setDraft({ ...draft, meaning: e.target.value })}
          />
          <input
            placeholder="例句"
            value={draft.example}
            onChange={(e) => setDraft({ ...draft, example: e.target.value })}
          />
          <input
            placeholder="备注"
            value={draft.note}
            onChange={(e) => setDraft({ ...draft, note: e.target.value })}
          />
          <select value={draft.scene} onChange={(e) => setDraft({ ...draft, scene: e.target.value })}>
            {SCENES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <div className="form-actions">
            <button className="primary" onClick={save}>
              保存
            </button>
            <button onClick={() => setDraft(null)}>取消</button>
          </div>
        </div>
      )}

      <p className="hint">共 {list.length} 张</p>
      <ul className="list">
        {list.map((c) => (
          <li key={c.uid}>
            <div>
              <b>{c.text}</b>
              <span className="tag">{c.scene}</span>
              <div className="sub-text">{c.meaning}</div>
              {c.example && <div className="example">{c.example}</div>}
            </div>
            <div className="row-actions">
              <button
                onClick={() =>
                  setDraft({
                    uid: c.uid,
                    text: c.text,
                    meaning: c.meaning,
                    example: c.example,
                    scene: c.scene,
                    note: c.note,
                  })
                }
              >
                编辑
              </button>
              <button onClick={() => remove(c)}>删除</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
