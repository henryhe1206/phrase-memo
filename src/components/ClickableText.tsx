const WORD = /([A-Za-z]+(?:'[A-Za-z]+)*)/;

/** 把英文文本中的每个单词渲染成可点击的元素；点击时同时给出单词所在的整句，作为生词的语境例句 */
export default function ClickableText({
  text,
  onWord,
}: {
  text: string;
  onWord: (word: string, context: string) => void;
}) {
  return (
    <>
      {text.split(WORD).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="word" onClick={() => onWord(part, text)}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
