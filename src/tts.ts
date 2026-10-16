import type { Settings } from './types';

export function speak(text: string, settings: Settings) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = settings.accent;
  u.rate = settings.speechRate;
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang === settings.accent);
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
}
