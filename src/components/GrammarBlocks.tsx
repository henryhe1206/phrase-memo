import type { Collocation, Example, Preposition } from '../data/grammar';

function ExampleLine({ example, onSpeak }: { example: Example; onSpeak: (text: string) => void }) {
  return (
    <div className="g-example">
      <button className="speaker small" onClick={() => onSpeak(example[0])}>
        🔊
      </button>
      <span>
        <i>{example[0]}</i>
        <small>{example[1]}</small>
      </span>
    </div>
  );
}

export function PrepositionBlock({ prep, onSpeak }: { prep: Preposition; onSpeak: (text: string) => void }) {
  return (
    <div>
      <p className="hint">{prep.summary}</p>
      {prep.uses.map((u) => (
        <div key={u.pattern} className="g-use">
          <b>{u.pattern}</b>
          <div className="sub-text">{u.meaning}</div>
          {u.examples.map((e) => (
            <ExampleLine key={e[0]} example={e} onSpeak={onSpeak} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CollocationBlock({ c, onSpeak }: { c: Collocation; onSpeak: (text: string) => void }) {
  return (
    <div className="g-use">
      <b>{c.pattern}</b>
      <div className="sub-text">{c.meaning}</div>
      {c.note && <div className="note">{c.note}</div>}
      <ExampleLine example={c.example} onSpeak={onSpeak} />
    </div>
  );
}
