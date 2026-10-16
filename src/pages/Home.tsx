import { useLiveQuery } from 'dexie-react-hooks';
import { liveCards } from '../db';
import { buildQueue, today } from '../srs';
import { SCENES, type Settings } from '../types';

interface Props {
  settings: Settings;
  scene: string;
  onSceneChange: (scene: string) => void;
  onStart: () => void;
}

export default function Home({ settings, scene, onSceneChange, onStart }: Props) {
  const cards = useLiveQuery(liveCards, []);
  if (!cards) return null;

  const t = today();
  const queue = buildQueue(cards, settings, scene || undefined);
  const dueCount = queue.filter((c) => c.introduced === 1).length;
  const newCount = queue.length - dueCount;
  const learnedToday = cards.filter((c) => c.introducedOn === t).length;

  return (
    <section className="panel">
      <div className="stat-row">
        <div className="stat">
          <b>{dueCount}</b>
          <span>待复习</span>
        </div>
        <div className="stat">
          <b>{newCount}</b>
          <span>待学新卡</span>
        </div>
        <div className="stat">
          <b>{learnedToday}</b>
          <span>今日已学新卡</span>
        </div>
      </div>

      <label className="field">
        学习范围
        <select value={scene} onChange={(e) => onSceneChange(e.target.value)}>
          <option value="">全部场景</option>
          {SCENES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <button className="primary big" disabled={queue.length === 0} onClick={onStart}>
        {queue.length === 0 ? '今天的任务已完成 🎉' : `开始学习（${queue.length} 张）`}
      </button>

      <p className="hint">
        每张卡会轮流用「看中文回忆 / 填空搭配 / 听音复述」三种方式出现，务必开口说出来再翻面。
      </p>
    </section>
  );
}
