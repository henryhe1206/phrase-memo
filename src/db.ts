import Dexie, { type EntityTable } from 'dexie';
import { WORDBOOK, type Card, type ReviewLog } from './types';
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

export const findInWordbook = (text: string) =>
  db.cards.filter((c) => c.deleted === 0 && c.scene === WORDBOOK && c.text === text).first();

export const addToWordbook = (fields: Pick<Card, 'text' | 'meaning' | 'example' | 'note'>) =>
  db.cards.add(newCard({ ...fields, scene: WORDBOOK }));


/**
 * 每次启动时补齐缺失的内置短语（首次运行即全部导入，之后新增的内置卡片也会自动补上）。
 * uid 固定、updatedAt 为 0，因此各设备的内置卡片是同一批卡片，
 * 且云端的任何改动（进度、删除）都会覆盖这些未改动的初始版本。
 * 只补缺失的、不覆盖已有的，所以不会冲掉本地学习进度；删除是软删除，已删除的卡片仍在库里，不会被补回。
 */
export async function seedMissingPhrases(): Promise<void> {
  const seeds = SEED_PHRASES.map(([scene, text, meaning, example], i) =>
    newCard({ uid: `seed-${i}`, scene, text, meaning, example, createdAt: i, updatedAt: 0, dirty: 0 }),
  );
  const existing = new Set(await db.cards.where('uid').anyOf(seeds.map((c) => c.uid)).primaryKeys());
  await db.cards.bulkAdd(seeds.filter((c) => !existing.has(c.uid)));
}
