import { useLiveQuery } from 'dexie-react-hooks';
import { db, liveCards } from '../db';
import { addDays, today } from '../srs';

export default function Stats() {
  const cards = useLiveQuery(liveCards, []);
  const logs = useLiveQuery(() => db.logs.toArray(), []);
  if (!cards || !logs) return null;

  const t = today();
  const fresh = cards.filter((c) => c.introduced === 0).length;
  const mastered = cards.filter((c) => c.introduced === 1 && c.interval >= 21).length;
  const learning = cards.length - fresh - mastered;

  const perDay = new Map<string, number>();
  for (const l of logs) perDay.set(l.date, (perDay.get(l.date) ?? 0) + 1);

  let streak = 0;
  let cursor = perDay.has(t) ? t : addDays(t, -1);
  while (perDay.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }

  const since = addDays(t, -29);
  const recent = logs.filter((l) => l.date >= since);
  const retention = recent.length
    ? Math.round((recent.filter((l) => l.rating > 0).length / recent.length) * 100)
    : null;

  const days = Array.from({ length: 14 }, (_, i) => addDays(t, i - 13));
  const max = Math.max(1, ...days.map((d) => perDay.get(d) ?? 0));

  return (
    <section className="panel">
      <div className="stat-row">
        <div className="stat">
          <b>{streak}</b>
          <span>连续打卡（天）</span>
        </div>
        <div className="stat">
          <b>{retention === null ? '—' : `${retention}%`}</b>
          <span>近 30 天记住率</span>
        </div>
        <div className="stat">
          <b>{logs.length}</b>
          <span>累计复习次数</span>
        </div>
      </div>

      <h3>掌握度</h3>
      <div className="stat-row">
        <div className="stat">
          <b>{fresh}</b>
          <span>未学</span>
        </div>
        <div className="stat">
          <b>{learning}</b>
          <span>学习中</span>
        </div>
        <div className="stat">
          <b>{mastered}</b>
          <span>已掌握（间隔≥21天）</span>
        </div>
      </div>

      <h3>近 14 天复习量</h3>
      <div className="bars">
        {days.map((d) => {
          const n = perDay.get(d) ?? 0;
          return (
            <div key={d} className="bar-col" title={`${d}：${n}`}>
              <div className="bar" style={{ height: `${(n / max) * 100}%` }} />
              <small>{d.slice(8)}</small>
            </div>
          );
        })}
      </div>
    </section>
  );
}
