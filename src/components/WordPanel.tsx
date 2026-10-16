import { useEffect, useState } from 'react';
import { loadDict, lookup, type LookupResult } from '../dictionary';
import { grammarFor } from '../data/grammar';
import { candidates } from '../wordForms';
import { speak } from '../tts';
import type { Settings } from '../types';
import { CollocationBlock, PrepositionBlock } from './GrammarBlocks';

interface Props {
  word: string;
  settings: Settings;
  onClose: () => void;
}

type Result = { status: 'loading' } | { status: 'error'; message: string } | { status: 'done'; found: LookupResult | null };

function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </>
  );
}

/** 点击单词后从底部弹出的面板：释义 + 语法搭配。父组件应以 word 作为 key，切换单词时重置状态 */
export default function WordPanel({ word, settings, onClose }: Props) {
  const [result, setResult] = useState<Result>({ status: 'loading' });
  const [tab, setTab] = useState<'meaning' | 'grammar'>('meaning');

  useEffect(() => {
    speak(word, settings);
    loadDict()
      .then((dict) => setResult({ status: 'done', found: lookup(dict, word) }))
      .catch((e: Error) => setResult({ status: 'error', message: e.message }));
    // 只在打开时朗读并查词一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const grammar = grammarFor(candidates(word));
  const hasGrammar = !!grammar.preposition || grammar.collocations.length > 0;
  const onSpeak = (text: string) => speak(text, settings);

  const found = result.status === 'done' ? result.found : null;

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <b>{word}</b>
          {found?.phonetic && <span className="phonetic">/{found.phonetic}/</span>}
          <button className="speaker small" onClick={() => speak(word, settings)}>
            🔊
          </button>
          <button className="link close" onClick={onClose}>
            ✕
          </button>
        </div>

        {hasGrammar && (
          <div className="tabs">
            <button className={tab === 'meaning' ? 'tab active' : 'tab'} onClick={() => setTab('meaning')}>
              释义
            </button>
            <button className={tab === 'grammar' ? 'tab active' : 'tab'} onClick={() => setTab('grammar')}>
              语法搭配
            </button>
          </div>
        )}

        <div className="sheet-body">
          {tab === 'meaning' && (
            <>
              {result.status === 'loading' && <p className="hint">查询中…</p>}
              {result.status === 'error' && <p className="hint">{result.message}</p>}
              {result.status === 'done' && !found && <p className="hint">词典里没有收录这个词。</p>}
              {found && (
                <>
                  <div className="meaning">
                    <Lines text={found.translation} />
                  </div>
                  {found.lemma && (
                    <div className="lemma">
                      <b>原形 {found.lemma.word}</b>
                      {found.lemma.phonetic && <span className="phonetic"> /{found.lemma.phonetic}/</span>}
                      <Lines text={found.lemma.translation} />
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {tab === 'grammar' && (
            <>
              {grammar.preposition && (
                <>
                  <h4>介词 {grammar.preposition.word}</h4>
                  <PrepositionBlock prep={grammar.preposition} onSpeak={onSpeak} />
                </>
              )}
              {grammar.collocations.length > 0 && (
                <>
                  <h4>固定搭配</h4>
                  {grammar.collocations.map((c) => (
                    <CollocationBlock key={c.pattern} c={c} onSpeak={onSpeak} />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
