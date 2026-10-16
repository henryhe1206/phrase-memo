import { useEffect, useState, useSyncExternalStore } from 'react';
import { createClient, type Session } from '@supabase/supabase-js';
import { db } from './db';
import type { Card, Rating, ReviewLog } from './types';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** 未配置环境变量时为 null，界面会提示同步不可用 */
export const supabase = url && key ? createClient(url, key) : null;

const CURSOR_KEY = 'phrase-memo:pull-cursor';
const LAST_SYNC_KEY = 'phrase-memo:last-sync';
const PAGE = 1000;
const CHUNK = 500;

interface CardRow {
  user_id: string;
  uid: string;
  phrase: string;
  meaning: string;
  example: string;
  scene: string;
  note: string;
  created_at: number;
  ease: number;
  interval_days: number;
  due: string;
  reps: number;
  lapses: number;
  introduced: 0 | 1;
  introduced_on: string;
  deleted: 0 | 1;
  updated_at: number;
  server_at: string;
}

interface LogRow {
  user_id: string;
  uid: string;
  card_uid: string;
  day: string;
  rating: Rating;
  at: number;
  server_at: string;
}

const cardToRow = (c: Card, userId: string): Omit<CardRow, 'server_at'> => ({
  user_id: userId,
  uid: c.uid,
  phrase: c.text,
  meaning: c.meaning,
  example: c.example,
  scene: c.scene,
  note: c.note,
  created_at: c.createdAt,
  ease: c.ease,
  interval_days: c.interval,
  due: c.due,
  reps: c.reps,
  lapses: c.lapses,
  introduced: c.introduced,
  introduced_on: c.introducedOn,
  deleted: c.deleted,
  updated_at: c.updatedAt,
});

const rowToCard = (r: CardRow): Card => ({
  uid: r.uid,
  text: r.phrase,
  meaning: r.meaning,
  example: r.example,
  scene: r.scene,
  note: r.note,
  createdAt: r.created_at,
  ease: r.ease,
  interval: r.interval_days,
  due: r.due,
  reps: r.reps,
  lapses: r.lapses,
  introduced: r.introduced,
  introducedOn: r.introduced_on,
  deleted: r.deleted,
  updatedAt: r.updated_at,
  dirty: 0,
});

const logToRow = (l: ReviewLog, userId: string): Omit<LogRow, 'server_at'> => ({
  user_id: userId,
  uid: l.uid,
  card_uid: l.cardUid,
  day: l.date,
  rating: l.rating,
  at: l.at,
});

const rowToLog = (r: LogRow): ReviewLog => ({
  uid: r.uid,
  cardUid: r.card_uid,
  date: r.day,
  rating: r.rating,
  at: r.at,
  dirty: 0,
});

// ---------- 状态 ----------

export interface SyncStatus {
  state: 'idle' | 'syncing' | 'error';
  lastAt: number | null;
  error: string | null;
}

let status: SyncStatus = {
  state: 'idle',
  lastAt: Number(localStorage.getItem(LAST_SYNC_KEY)) || null,
  error: null,
};
const listeners = new Set<() => void>();

function setStatus(patch: Partial<SyncStatus>) {
  status = { ...status, ...patch };
  listeners.forEach((l) => l());
}

export function useSyncStatus(): SyncStatus {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => status,
  );
}

/** undefined = 读取中，null = 未登录 */
export function useSession(): Session | null | undefined {
  const [session, setSession] = useState<Session | null | undefined>(supabase ? undefined : null);
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  return session;
}

// ---------- 认证 ----------

export async function signIn(email: string, password: string): Promise<string | null> {
  const { error } = await supabase!.auth.signInWithPassword({ email, password });
  return error?.message ?? null;
}

export async function signUp(email: string, password: string): Promise<string | null> {
  const { data, error } = await supabase!.auth.signUp({ email, password });
  if (error) return error.message;
  return data.session ? null : '注册成功，请到邮箱点击验证链接后再登录';
}

export async function signOut(): Promise<void> {
  await supabase!.auth.signOut();
  localStorage.removeItem(CURSOR_KEY);
}

// ---------- 同步 ----------

async function pullTable<T extends { server_at: string }>(
  table: 'cards' | 'logs',
  cursor: string,
): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase!
      .from(table)
      .select('*')
      .gt('server_at', cursor)
      .order('server_at')
      .order('uid')
      .range(from, from + PAGE - 1);
    if (error) throw error;
    out.push(...(data as T[]));
    if (data.length < PAGE) return out;
  }
}

function chunks<T>(items: T[]): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += CHUNK) out.push(items.slice(i, i + CHUNK));
  return out;
}

async function pull() {
  const cursor = localStorage.getItem(CURSOR_KEY) ?? '1970-01-01T00:00:00Z';
  const cardRows = await pullTable<CardRow>('cards', cursor);
  const logRows = await pullTable<LogRow>('logs', cursor);

  // 冲突时以修改时间较新的一方为准
  const locals = await db.cards.bulkGet(cardRows.map((r) => r.uid));
  const winners = cardRows.map(rowToCard).filter((c, i) => !locals[i] || c.updatedAt > locals[i].updatedAt);
  await db.cards.bulkPut(winners);
  await db.logs.bulkPut(logRows.map(rowToLog));

  const latest = [...cardRows, ...logRows].map((r) => r.server_at).sort().at(-1);
  if (latest) localStorage.setItem(CURSOR_KEY, latest);
}

async function push(userId: string) {
  const cards = await db.cards.where('dirty').equals(1).toArray();
  for (const batch of chunks(cards)) {
    const { error } = await supabase!
      .from('cards')
      .upsert(batch.map((c) => cardToRow(c, userId)), { onConflict: 'user_id,uid' });
    if (error) throw error;
  }
  // 上传期间又被修改过的卡片保持 dirty，留给下次上传
  const pushed = new Map(cards.map((c) => [c.uid, c.updatedAt]));
  await db.cards
    .where('uid')
    .anyOf([...pushed.keys()])
    .modify((c) => {
      if (c.updatedAt === pushed.get(c.uid)) c.dirty = 0;
    });

  const logs = await db.logs.where('dirty').equals(1).toArray();
  for (const batch of chunks(logs)) {
    const { error } = await supabase!
      .from('logs')
      .upsert(batch.map((l) => logToRow(l, userId)), { onConflict: 'user_id,uid' });
    if (error) throw error;
  }
  await db.logs
    .where('uid')
    .anyOf(logs.map((l) => l.uid))
    .modify({ dirty: 0 });
}

async function doSync() {
  if (!supabase) return;
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user.id;
  if (!userId) return;

  setStatus({ state: 'syncing', error: null });
  try {
    await pull();
    await push(userId);
    const now = Date.now();
    localStorage.setItem(LAST_SYNC_KEY, String(now));
    setStatus({ state: 'idle', lastAt: now });
  } catch (e) {
    setStatus({ state: 'error', error: e instanceof Error ? e.message : String(e) });
  }
}

let running: Promise<void> | null = null;
let rerun = false;

/** 立即同步；同步进行中再次调用时，本轮结束后补跑一轮。失败不抛出，结果记录在 SyncStatus 中 */
export function syncNow(): Promise<void> {
  if (running) {
    rerun = true;
    return running;
  }
  running = (async () => {
    do {
      rerun = false;
      await doSync();
    } while (rerun);
  })().finally(() => {
    running = null;
  });
  return running;
}

let timer: ReturnType<typeof setTimeout> | undefined;

/** 本地数据变化后调用，稍等片刻合并多次改动再同步 */
export function scheduleSync() {
  clearTimeout(timer);
  timer = setTimeout(() => void syncNow(), 3000);
}
