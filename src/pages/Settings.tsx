import { useRef, useState } from 'react';
import { db, liveCards, newCard } from '../db';
import { speak } from '../tts';
import {
  scheduleSync,
  signIn,
  signOut,
  signUp,
  supabase,
  syncNow,
  useSession,
  useSyncStatus,
} from '../sync';
import type { Card, Settings } from '../types';

interface Props {
  settings: Settings;
  onChange: (s: Settings) => void;
}

function clampInt(value: string, min: number, max: number): number {
  const n = Math.round(Number(value));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
}

function SyncSection() {
  const session = useSession();
  const status = useSyncStatus();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  if (!supabase) {
    return <p className="hint">未配置同步服务（缺少 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY）。</p>;
  }
  if (session === undefined) return null;

  if (session) {
    return (
      <>
        <p>
          已登录：<b>{session.user.email}</b>
        </p>
        <p className="hint">
          {status.state === 'syncing' && '同步中…'}
          {status.state === 'idle' &&
            (status.lastAt ? `上次同步：${new Date(status.lastAt).toLocaleString()}` : '尚未同步')}
          {status.state === 'error' && `同步失败：${status.error}`}
        </p>
        <div className="form-actions">
          <button disabled={status.state === 'syncing'} onClick={() => void syncNow()}>
            立即同步
          </button>
          <button onClick={() => void signOut()}>退出登录</button>
        </div>
      </>
    );
  }

  async function submit(action: typeof signIn) {
    setMessage('');
    const error = await action(email.trim(), password);
    if (error) setMessage(error);
    else void syncNow();
  }

  return (
    <>
      <div className="form">
        <input type="email" placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          type="password"
          placeholder="密码（至少 6 位）"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="form-actions">
          <button className="primary" onClick={() => submit(signIn)}>
            登录
          </button>
          <button onClick={() => submit(signUp)}>首次使用：注册</button>
        </div>
      </div>
      {message && <p className="hint">{message}</p>}
    </>
  );
}

export default function SettingsPage({ settings, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  async function exportData() {
    const cards = (await liveCards()).map(({ text, meaning, example, scene, note }) => ({
      text,
      meaning,
      example,
      scene,
      note,
    }));
    const blob = new Blob([JSON.stringify(cards, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `phrase-memo-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importData(file: File) {
    let items: unknown;
    try {
      items = JSON.parse(await file.text());
    } catch {
      alert('文件不是有效的 JSON');
      return;
    }
    if (!Array.isArray(items)) {
      alert('JSON 顶层必须是数组');
      return;
    }
    const existing = new Set((await liveCards()).map((c) => c.text.toLowerCase()));
    const toAdd: Card[] = [];
    for (const item of items) {
      if (typeof item?.text !== 'string' || typeof item?.meaning !== 'string') continue;
      if (existing.has(item.text.toLowerCase())) continue;
      existing.add(item.text.toLowerCase());
      const { text, meaning, example, scene, note } = item;
      toAdd.push(
        newCard({
          text,
          meaning,
          ...(typeof example === 'string' && { example }),
          ...(typeof scene === 'string' && { scene }),
          ...(typeof note === 'string' && { note }),
        }),
      );
    }
    await db.cards.bulkAdd(toAdd);
    scheduleSync();
    alert(`已导入 ${toAdd.length} 张，跳过 ${items.length - toAdd.length} 张（重复或格式不符）`);
  }

  return (
    <section className="panel">
      <h3>云同步</h3>
      <SyncSection />

      <h3>学习设置（仅本设备）</h3>
      <label className="field">
        每日新卡上限
        <input
          type="number"
          min={0}
          max={200}
          value={settings.dailyNew}
          onChange={(e) => onChange({ ...settings, dailyNew: clampInt(e.target.value, 0, 200) })}
        />
      </label>
      <label className="field">
        每日复习上限
        <input
          type="number"
          min={0}
          max={1000}
          value={settings.dailyReview}
          onChange={(e) => onChange({ ...settings, dailyReview: clampInt(e.target.value, 0, 1000) })}
        />
      </label>
      <label className="field">
        发音口音
        <select
          value={settings.accent}
          onChange={(e) => onChange({ ...settings, accent: e.target.value as Settings['accent'] })}
        >
          <option value="en-US">美音</option>
          <option value="en-GB">英音</option>
        </select>
      </label>
      <label className="field">
        语速 {settings.speechRate.toFixed(1)}
        <input
          type="range"
          min={0.5}
          max={1.2}
          step={0.1}
          value={settings.speechRate}
          onChange={(e) => onChange({ ...settings, speechRate: Number(e.target.value) })}
        />
      </label>
      <button onClick={() => speak('Nice to meet you. How have you been?', settings)}>🔊 试听</button>

      <h3>卡片内容</h3>
      <div className="form-actions">
        <button onClick={exportData}>导出 JSON</button>
        <button onClick={() => fileRef.current?.click()}>导入 JSON</button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importData(f);
            e.target.value = '';
          }}
        />
      </div>
      <p className="hint">
        导入/导出只包含卡片内容（不含学习进度，进度由云同步负责）。数组每项至少含 <code>text</code> 和{' '}
        <code>meaning</code>，可选 <code>example</code>、<code>scene</code>、<code>note</code>。英文相同的卡片会被跳过。
      </p>
    </section>
  );
}
