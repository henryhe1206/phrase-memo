import { toDateStr } from './srs';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * 生成每天重复的日历提醒（.ics）。
 * 开始时间不带时区（浮动时间），换时区或出差时仍然是当地的这个钟点；
 * UID 固定，重复导入时多数日历会更新同一个事件而不是新增一个。
 */
export function buildReminderIcs(time: string, appUrl: string): string {
  const [hour, minute] = time.split(':').map(Number);
  const day = toDateStr(new Date()).replaceAll('-', '');
  const start = `${day}T${pad(hour)}${pad(minute)}00`;
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//phrase-memo//reminder//CN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:daily-reminder@phrase-memo',
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    'DURATION:PT15M',
    'RRULE:FREQ=DAILY',
    'SUMMARY:该背单词啦：口语短语复习',
    `DESCRIPTION:打开应用复习今天的短语：${appUrl}`,
    `URL:${appUrl}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:该背单词啦',
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadReminder(time: string) {
  const appUrl = `${window.location.origin}${import.meta.env.BASE_URL}`;
  const blob = new Blob([buildReminderIcs(time, appUrl)], { type: 'text/calendar;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'phrase-memo-reminder.ics';
  a.click();
  URL.revokeObjectURL(a.href);
}

/** 主屏幕图标角标：只在应用打开时更新，不会在后台自动变化 */
export function updateBadge(count: number) {
  const nav = navigator as Navigator & {
    setAppBadge?: (n: number) => Promise<void>;
    clearAppBadge?: () => Promise<void>;
  };
  const result = count > 0 ? nav.setAppBadge?.(count) : nav.clearAppBadge?.();
  result?.catch(() => {}); // 没有权限或不支持时静默忽略，角标只是锦上添花
}
