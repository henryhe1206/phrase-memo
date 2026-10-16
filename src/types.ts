/** 用户从句子里选出来的生词，作为普通卡片参与复习和同步 */
export const WORDBOOK = '单词本';

export const SCENES = ['日常', '社交', '职场', '学术', '旅行', '餐饮购物', '情绪表达', WORDBOOK] as const;

export type Rating = 0 | 1 | 2 | 3;

export interface Card {
  uid: string;
  text: string;
  meaning: string;
  example: string;
  scene: string;
  note: string;
  createdAt: number;
  ease: number;
  interval: number;
  due: string;
  reps: number;
  lapses: number;
  introduced: 0 | 1;
  introducedOn: string;
  /** 软删除：同步时需要把删除状态传给其他设备 */
  deleted: 0 | 1;
  /** 最后修改时间（毫秒），同步时以较新者为准 */
  updatedAt: number;
  /** 本地有尚未上传的改动 */
  dirty: 0 | 1;
}

export interface ReviewLog {
  uid: string;
  cardUid: string;
  date: string;
  rating: Rating;
  at: number;
  dirty: 0 | 1;
}

export interface Settings {
  dailyNew: number;
  dailyReview: number;
  accent: 'en-US' | 'en-GB';
  speechRate: number;
}

export const DEFAULT_SETTINGS: Settings = {
  dailyNew: 10,
  dailyReview: 100,
  accent: 'en-US',
  speechRate: 0.9,
};
