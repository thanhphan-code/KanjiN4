import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Headphones,
  FlagCheckered,
  BookBookmark,
} from "@phosphor-icons/react";
import {
  data,
  lessonById,
  questionById,
  skillLabels,
  wordById,
} from "../domain/content";
import {
  advanceAttempt,
  createAttempt,
  db,
  submitAnswer,
  type Attempt,
} from "../storage/db";
import {
  AudioButton,
  Empty,
  Heading,
  Notice,
  useVoices,
} from "../components/common";
export function PracticePage() {
  const { attemptId } = useParams();
  const result = useLiveQuery(
    async () => ({ attempt: await db.attempts.get(attemptId ?? "") }),
    [attemptId],
  );
  if (!result)
    return (
      <div className="loading" role="status">
        Đang khôi phục phiên học…
      </div>
    );
  if (!result.attempt)
    return (
      <Empty title="Không tìm thấy phiên học" to="/lessons">
        Bạn có thể bắt đầu lượt luyện mới trong bài học.
      </Empty>
    );
  if (result.attempt.contentVersion !== data.version)
    return (
      <Empty title="Nội dung phiên học thuộc phiên bản khác" to="/lessons">
        Tiến độ cũ vẫn được giữ. Hãy tạo phiên luyện mới.
      </Empty>
    );
  return result.attempt.completedAt ? (
    <Results attempt={result.attempt} />
  ) : (
    <Player
      key={result.attempt.id + "-" + result.attempt.index}
      attempt={result.attempt}
    />
  );
}
function Player({ attempt: a }: { attempt: Attempt }) {
  const id = a.items[a.index],
    q = questionById(id),
    word = wordById(id),
    answer = a.answers[id],
    voices = useVoices();
  const [input, setInput] = useState(a.draft),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const tested = a.mode === "quiz",
    listening =
      a.mode === "listening" || a.skillOverrides?.[id] === "listening";
  const passage = data.passages.find((p) => p.id === a.scope);
  const audioWord = q
    ? data.vocabulary.find(
        (w) =>
          w.surface === q.options.find((o) => o.id === q.correctOptionId)?.text,
      )
    : undefined;
  const options =
    a.optionOrders[id]
      ?.map((oid) => q?.options.find((o) => o.id === oid))
      .filter((o): o is { id: string; text: string } => !!o) ?? [];
  async function draft(value: string) {
    setInput(value);
    try {
      await db.attempts.update(a.id, { draft: value });
    } catch {
      setError("Chưa lưu được lựa chọn. Hãy kiểm tra bộ nhớ trình duyệt.");
    }
  }
  async function submit(skip = false) {
    setBusy(true);
    setError("");
    try {
      await submitAnswer(a.id, input, skip, id);
    } catch {
      setError("Chưa lưu được câu trả lời. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }
  async function next() {
    setBusy(true);
    try {
      await advanceAttempt(a.id, a.index);
    } catch {
      setError("Chưa lưu được vị trí tiếp theo.");
    } finally {
      setBusy(false);
    }
  }
  if (!q && !word)
    return <Empty title="Nội dung câu hỏi không còn khả dụng" to="/lessons" />;
  return (
    <div className="practice-shell">
      <Link
        className="back-link"
        to={
          lessonById(a.scope)
            ? `/lessons/${a.scope}/${a.mode === "vocabulary" ? "vocabulary" : "practice"}`
            : a.scope.startsWith("passage")
              ? `/reading/${a.scope}`
              : "/review"
        }
      >
        <ArrowLeft size={17} />
        Tạm dừng, quay lại
      </Link>
      <div className="practice-top">
        <span>
          {tested
            ? "KIỂM TRA CUỐI BÀI"
            : listening
              ? "NGHE VÀ CHỌN TỪ"
              : word
                ? "NHẬP CÁCH ĐỌC"
                : skillLabels[q?.skill ?? "reading"].toUpperCase()}
        </span>
        <span>
          Câu {a.index + 1} / {a.items.length}
        </span>
      </div>
      <progress
        className="quiz-progress"
        value={a.index}
        max={a.items.length}
        aria-label="Số câu đã làm"
      />
      {passage && (
        <div className="panel reading-passage ja" lang="ja">
          {passage.japanese}
        </div>
      )}
      <section className="question-panel panel">
        <p className="muted">
          {tested
            ? "Đáp án và giải thích sẽ hiện khi hoàn thành bài."
            : "Thử nhớ trước, xem lời giải sau."}
        </p>
        {listening ? (
          <div className="listening-prompt">
            <Headphones size={40} />
            <h1>Nghe và chọn cách viết đúng</h1>
            {audioWord ? (
              <AudioButton text={audioWord.reading} label="Nghe từ cần chọn" />
            ) : (
              <Notice>
                Không có bản đọc xác minh cho câu này. Hãy bỏ qua.
              </Notice>
            )}
            {!voices.length && (
              <Notice>
                Thiết bị chưa có giọng Nhật. Bạn có thể bỏ qua hoặc chọn chế độ
                khác.
              </Notice>
            )}
          </div>
        ) : word ? (
          <>
            <h1 className="recall-word ja" lang="ja">
              {word.surface}
            </h1>
            <p>Nhập cách đọc bằng Hiragana</p>
          </>
        ) : (
          <h1 className="question-stem ja" lang="ja">
            {q?.stem}
          </h1>
        )}
        {word ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim() && !answer && !busy) void submit();
            }}
          >
            <label className="answer-label" htmlFor="kana-answer">
              Cách đọc của từ
            </label>
            <input
              id="kana-answer"
              className="kana-input ja"
              lang="ja"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Nhập Hiragana…"
              value={input}
              disabled={!!answer || busy}
              onChange={(e) => void draft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.nativeEvent.isComposing)
                  e.preventDefault();
              }}
            />
            <small className="input-help">
              Dùng bàn phím tiếng Nhật (IME). Katakana tương đương cũng được
              chấp nhận.
            </small>
            <button
              type="submit"
              className="sr-only"
              disabled={!!answer || !input.trim()}
            >
              Kiểm tra cách đọc
            </button>
          </form>
        ) : (
          <fieldset className="answer-options" disabled={!!answer || busy}>
            <legend className="sr-only">Chọn một đáp án</legend>
            {options.map((option, index) => {
              const selected = (answer?.response ?? input) === option.id;
              const showCorrect =
                !!answer && !tested && option.id === q?.correctOptionId;
              const showWrong =
                !!answer && !tested && selected && !answer.correct;
              return (
                <label
                  key={option.id}
                  className={`answer-choice ${selected ? "chosen" : ""} ${showCorrect ? "correct" : ""} ${showWrong ? "wrong" : ""}`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option.id}
                    checked={selected}
                    onChange={() => void draft(option.id)}
                  />
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span lang="ja">{option.text}</span>
                  {showCorrect && <CheckCircle size={23} />}{" "}
                  {showWrong && <XCircle size={23} />}
                </label>
              );
            })}
          </fieldset>
        )}
        {answer && (
          <div
            role="status"
            className={`answer-feedback ${tested ? "" : answer.correct ? "success" : "incorrect"}`}
          >
            <strong>
              {tested
                ? "Đã lưu câu trả lời."
                : answer.correct === null
                  ? "Đã bỏ qua, không tính đúng."
                  : answer.correct
                    ? "Đúng rồi!"
                    : "Chưa đúng. Cùng xem lại nhé."}
            </strong>
            {!tested && (
              <>
                <p>
                  {word
                    ? `${word.surface} đọc là ${word.reading}: ${word.meaning}.`
                    : `Đáp án: ${q?.options.find((o) => o.id === q.correctOptionId)?.text}`}
                </p>
                <p>{word ? `Mẹo nhớ: ${word.mnemonic}` : q?.explanation}</p>
                {word && <AudioButton text={word.reading} />}
              </>
            )}
          </div>
        )}
        {error && <Notice>{error}</Notice>}
        <div className="question-actions">
          {!answer ? (
            <>
              <button
                className="btn ghost"
                disabled={busy}
                onClick={() => submit(true)}
              >
                Bỏ qua
              </button>
              <button
                className="btn primary"
                disabled={
                  !input.trim() || busy || (listening && !voices.length)
                }
                onClick={() => submit()}
              >
                {busy ? "Đang lưu…" : tested ? "Lưu câu trả lời" : "Kiểm tra"}
                <ArrowRight />
              </button>
            </>
          ) : (
            <button className="btn primary" disabled={busy} onClick={next}>
              {a.index === a.items.length - 1 ? "Xem kết quả" : "Câu tiếp theo"}
              <ArrowRight />
            </button>
          )}
        </div>
      </section>
      <p className="save-note">
        Tự động lưu trên thiết bị này. Bạn có thể tạm dừng bất cứ lúc nào.
      </p>
    </div>
  );
}
function Results({ attempt: a }: { attempt: Attempt }) {
  const navigate = useNavigate(),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const answers = Object.values(a.answers),
    correct = answers.filter((x) => x.correct === true).length,
    skipped = answers.filter((x) => x.correct === null).length,
    graded = answers.length - skipped,
    wrong = a.items.filter((id) => a.answers[id]?.correct === false);
  async function repeat(ids: string[]) {
    setBusy(true);
    try {
      const next = await createAttempt(a.scope, a.mode, ids, a.skillOverrides);
      navigate("/practice/" + next.id);
    } catch {
      setError("Chưa tạo được phiên mới. Hãy thử lại.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="results">
      <div className="result-hero">
        <span className="result-icon">
          <FlagCheckered size={36} />
        </span>
        <p className="eyebrow">MỘT BƯỚC TIẾN NỮA</p>
        <h1>Bạn đã hoàn thành lượt học.</h1>
        <p>
          {wrong.length
            ? "Biết mình chưa nhớ gì cũng là một phần của việc học."
            : "Hãy để kiến thức có thời gian lắng lại, rồi quay lại ôn."}
        </p>
        <div className="result-stats">
          <div>
            <strong>
              {correct}
              <small>/{a.items.length}</small>
            </strong>
            <span>Câu đúng</span>
          </div>
          <div>
            <strong>
              {graded ? Math.round((correct / graded) * 100) : 0}%
            </strong>
            <span>Chính xác trên {graded} câu đã chấm</span>
          </div>
          <div>
            <strong>{skipped}</strong>
            <span>Câu bỏ qua</span>
          </div>
        </div>
        <div className="button-row">
          {wrong.length > 0 && (
            <button
              className="btn primary"
              disabled={busy}
              onClick={() => repeat(wrong)}
            >
              Luyện lại {wrong.length} câu sai
              <ArrowRight />
            </button>
          )}
          <button
            className={`btn ${wrong.length ? "secondary" : "primary"}`}
            disabled={busy}
            onClick={() => repeat(a.items)}
          >
            Làm lượt mới
          </button>
          <Link
            className="btn ghost"
            to={lessonById(a.scope) ? "/lessons/" + a.scope : "/lessons"}
          >
            Về bài học
          </Link>
        </div>
        {error && <Notice>{error}</Notice>}
      </div>
      <h2>Xem lại từng câu</h2>
      {a.items.map((id, i) => {
        const q = questionById(id),
          word = wordById(id),
          answer = a.answers[id];
        return (
          <article key={id} className="panel result-answer">
            <div className="result-answer-heading">
              {answer?.correct ? (
                <CheckCircle className="success-text" />
              ) : (
                <XCircle className="error-text" />
              )}
              <strong>
                Câu {i + 1} ·{" "}
                {answer?.correct === null
                  ? "Bỏ qua"
                  : answer?.correct
                    ? "Đúng"
                    : "Chưa đúng"}
              </strong>
            </div>
            <p className="ja" lang="ja">
              {word?.surface ?? q?.stem}
            </p>
            <p>
              Bạn trả lời:{" "}
              <strong>
                {word
                  ? answer?.response || "Bỏ qua"
                  : (q?.options.find((o) => o.id === answer?.response)?.text ??
                    "Bỏ qua")}
              </strong>
            </p>
            <p>
              Đáp án:{" "}
              <strong lang="ja">
                {word?.reading ??
                  q?.options.find((o) => o.id === q.correctOptionId)?.text}
              </strong>
            </p>
            <p className="muted">
              {word
                ? word.meaning + " · Mẹo nhớ: " + word.mnemonic
                : q?.explanation}
            </p>
          </article>
        );
      })}
    </div>
  );
}
export function ReadingPage() {
  const { passageId } = useParams(),
    navigate = useNavigate(),
    [reading, setReading] = useState(false),
    [meaning, setMeaning] = useState(false),
    [error, setError] = useState("");
  const p = data.passages.find((p) => p.id === passageId);
  const attempts = useLiveQuery(() => db.attempts.toArray()) ?? [];
  async function start(scope: string, ids: string[]) {
    try {
      const old = attempts.find((a) => a.scope === scope && !a.completedAt);
      const a = old ?? (await createAttempt(scope, "quiz", ids));
      navigate("/practice/" + a.id);
    } catch {
      setError("Chưa mở được bài tập. Hãy thử lại.");
    }
  }
  if (passageId && !p)
    return (
      <Empty title="Không tìm thấy bài đọc" to="/reading" action="Về bài đọc" />
    );
  if (p)
    return (
      <>
        <Link className="back-link" to="/reading">
          <ArrowLeft />
          Tất cả bài đọc
        </Link>
        <Heading eyebrow="ĐỌC ĐỂ KẾT NỐI KIẾN THỨC" title={p.title}>
          Thử đọc và hiểu ý chính trước khi xem cách đọc hoặc bản dịch.
        </Heading>
        <article className="panel reading-passage">
          <p className="ja" lang="ja">
            {p.japanese}
          </p>
          <AudioButton text={p.reading} label="Nghe bài đọc" />
          <div className="button-row">
            <button
              className="btn secondary"
              onClick={() => setReading(!reading)}
            >
              {reading ? "Ẩn" : "Xem"} cách đọc
            </button>
            <button
              className="btn secondary"
              onClick={() => setMeaning(!meaning)}
            >
              {meaning ? "Ẩn" : "Xem"} bản dịch
            </button>
          </div>
          {reading && (
            <p className="ja reading-line" lang="ja">
              {p.reading}
            </p>
          )}
          {meaning && <p>{p.meaning}</p>}
          <p className="muted small">
            Bài đọc có thể chứa Kanji mở rộng ngoài bộ 181 chữ. Tra từ trong mục
            Tra cứu.
          </p>
        </article>
        <div className="review-banner">
          <div>
            <h2>Bạn hiểu được bao nhiêu?</h2>
            <p>3 câu hỏi dựa trên nội dung vừa đọc.</p>
          </div>
          <button
            className="btn primary"
            onClick={() => start(p.id, p.questionIds)}
          >
            Luyện đọc hiểu
            <ArrowRight />
          </button>
        </div>
        {error && <Notice>{error}</Notice>}
      </>
    );
  return (
    <>
      <Heading
        eyebrow="TỪ CHỮ ĐẾN CÂU CHUYỆN"
        title="Đọc một chút, hiểu thêm nhiều."
      >
        5 đoạn văn ngắn để gặp lại Kanji trong những tình huống quen thuộc.
      </Heading>
      <div className="reading-grid">
        {data.passages.map((p, i) => (
          <Link
            className="panel reading-card"
            to={"/reading/" + p.id}
            key={p.id}
          >
            <span className="topic-icon tone-1">
              <BookBookmark size={26} />
            </span>
            <span className="eyebrow">BÀI ĐỌC 0{i + 1}</span>
            <h2>{p.title}</h2>
            <p className="ja" lang="ja">
              {p.japanese.slice(0, 55)}…
            </p>
            <span className="text-button">
              3 câu hỏi · Bắt đầu đọc
              <ArrowRight />
            </span>
          </Link>
        ))}
      </div>
      <div className="review-banner">
        <div>
          <h2>Diễn đạt gần nghĩa & cách dùng</h2>
          <p>16 câu hỏi bổ sung từ giáo trình, có giải thích.</p>
        </div>
        <button
          className="btn primary"
          onClick={() =>
            start(
              "extra",
              data.questions
                .filter((q) => q.lessonId === "extra")
                .map((q) => q.id),
            )
          }
        >
          Luyện thêm
          <ArrowRight />
        </button>
      </div>
      {error && <Notice>{error}</Notice>}
    </>
  );
}
