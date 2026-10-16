import Dexie, { type EntityTable } from 'dexie';
import type { Card, ReviewLog } from './types';
import { SEED_PHRASES } from './data/phrases';
import { today } from './srs';

export const db = new Dexie('phrase-memo-sync') as Dexie & {
  cards: EntityTable<Card, 'uid'>;
  logs: EntityTable<ReviewLog, 'uid'>;
};

db.version(1).stores({
  cards: 'uid, scene, due, introduced, introducedOn, dirty',
  logs: 'uid, cardUid, date, dirty',
});

/** 本地写入卡片时附带：更新修改时间并标记待上传 */
export const touch = () => ({ updatedAt: Date.now(), dirty: 1 as const });

export const liveCards = () => db.cards.filter((c) => c.deleted === 0).toArray();

export function newCard(partial: Pick<Card, 'text' | 'meaning'> & Partial<Card>): Card {
  return {
    uid: crypto.randomUUID(),
    example: '',
    scene: '日常',
    note: '',
    createdAt: Date.now(),
    ease: 2.5,
    interval: 0,
    due: today(),
    reps: 0,
    lapses: 0,
    introduced: 0,
    introducedOn: '',
    deleted: 0,
    ...touch(),
    ...partial,
  };
}

const SEEDED_KEY = 'phrase-memo-sync:seeded';

/**
 * 首次运行时导入内置短语。
 * uid 固定、updatedAt 为 0，因此各设备的内置卡片是同一批卡片，
 * 且云端的任何改动（进度、删除）都会覆盖这些未改动的初始版本。
 */
export async function seedIfFirstRun(): Promise<void> {
  if (localStorage.getItem(SEEDED_KEY)) return;
  await db.cards.bulkPut(
    SEED_PHRASES.map(([scene, text, meaning, example], i) =>
      newCard({ uid: `seed-${i}`, scene, text, meaning, example, createdAt: i, updatedAt: 0, dirty: 0 }),
    ),
  );
  localStorage.setItem(SEEDED_KEY, '1');
}
