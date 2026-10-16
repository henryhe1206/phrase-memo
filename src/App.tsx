import { useEffect, useState } from 'react';
import { syncNow, useSession } from './sync';
import { DEFAULT_SETTINGS, type Settings as SettingsT } from './types';
import Home from './pages/Home';
import Study from './pages/Study';
import Library from './pages/Library';
import Grammar from './pages/Grammar';
import Today from './pages/Today';
import Stats from './pages/Stats';
import SettingsPage from './pages/Settings';

type View = 'home' | 'study' | 'today' | 'library' | 'grammar' | 'stats' | 'settings';

const SETTINGS_KEY = 'phrase-memo:settings';

function loadSettings(): SettingsT {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

const NAV: { view: View; label: string }[] = [
  { view: 'home', label: '首页' },
  { view: 'library', label: '卡片库' },
  { view: 'grammar', label: '语法' },
  { view: 'stats', label: '统计' },
  { view: 'settings', label: '设置' },
];

export default function App() {
  const [view, setView] = useState<View>('home');
  const [scene, setScene] = useState<string>('');
  const [settings, setSettings] = useState<SettingsT>(loadSettings);
  const loggedIn = !!useSession();

  // 登录后、回到页面、恢复网络时自动同步
  useEffect(() => {
    if (!loggedIn) return;
    const sync = () => void syncNow();
    const onVisible = () => document.visibilityState === 'visible' && sync();
    sync();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', sync);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', sync);
    };
  }, [loggedIn]);

  function updateSettings(s: SettingsT) {
    setSettings(s);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  }

  if (view === 'study') {
    return (
      <div className="app">
        <Study settings={settings} scene={scene || undefined} onExit={() => setView('home')} />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>口语短语记忆</h1>
        <nav>
          {NAV.map((n) => (
            <button
              key={n.view}
              className={view === n.view ? 'tab active' : 'tab'}
              onClick={() => setView(n.view)}
            >
              {n.label}
            </button>
          ))}
        </nav>
      </header>
      <main>
        {view === 'home' && (
          <Home
            settings={settings}
            scene={scene}
            onSceneChange={setScene}
            onStart={() => setView('study')}
            onOpenToday={() => setView('today')}
          />
        )}
        {view === 'today' && <Today settings={settings} onBack={() => setView('home')} />}
        {view === 'library' && <Library settings={settings} />}
        {view === 'grammar' && <Grammar settings={settings} />}
        {view === 'stats' && <Stats />}
        {view === 'settings' && <SettingsPage settings={settings} onChange={updateSettings} />}
      </main>
    </div>
  );
}
