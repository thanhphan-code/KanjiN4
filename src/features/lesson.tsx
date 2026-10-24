import { VocabularyGroups } from "./vocabulary";
import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeSlash,
  Lightbulb,
  Cards,
  Keyboard,
  CheckSquare,
  Headphones,
  PuzzlePiece,
  BookOpen,
  Exam,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import {
  data,
  kanjiById,
  lessonById,
  meaning,
  priority,
  wordById,
  learningWordsForKanji,
  type Lesson,
  type Word,
} from "../domain/content";
import {
  createAttempt,
  db,
  masteredKanji,
  setMeta,
  shuffled,
  type Mode,
} from "../storage/db";
import {
  AudioButton,
  Empty,
  Heading,
  Notice,
  ProgressBar,
  Ruby,
  usePreferences,
  useVoices,
} from "../components/common";
export function LessonPage() {
  const { lessonId } = useParams(),
    lesson = lessonById(lessonId ?? "");
  if (!lesson) return <Empty title="Không tìm thấy bài học" to="/lessons" />;
  return <LessonContent key={lesson.id} lesson={lesson} />;
}
function LessonContent({ lesson }: { lesson: Lesson }) {
  const location = useLocation(),
    navigate = useNavigate(),
    [search, setSearch] = useSearchParams();
  const tab = location.pathname.split("/")[3] ?? "kanji",
    prefs = usePreferences();
  const [index, setIndex] = useState(
      Math.max(0, lesson.kanjiIds.indexOf(search.get("kanji") ?? "")),
    ),
    [saveError, setSaveError] = useState("");
  const progress = useLiveQuery(() => db.progress.toArray()) ?? [];
  const cursor = useLiveQuery(() => db.meta.get("cursor-" + lesson.id));
  useEffect(() => {
    if (!search.get("kanji") && typeof cursor?.value === "number")
      setIndex(Math.min(cursor.value, lesson.kanjiIds.length - 1));
  }, [cursor, lesson.kanjiIds.length, search]);
  useEffect(() => {
    Promise.all([
      setMeta("lastLesson", lesson.id),
      setMeta("seen-" + lesson.id, true),
    ]).catch(() => setSaveError("Không lưu được vị trí bài học."));
  }, [lesson.id]);
  const k = kanjiById(lesson.kanjiIds[index])!,
    words = lesson.vocabularyIds.map((id) => wordById(id)!),
    mastered = masteredKanji(progress).filter(
      (k) => k.lessonId === lesson.id,
    ).length;
  const related = words.filter((w) => w.surface.includes(k.literal));
  function choose(i: number) {
    setIndex(i);
    setSearch({ kanji: lesson.kanjiIds[i] }, { replace: true });
    setMeta("cursor-" + lesson.id, i).catch(() =>
      setSaveError("Không lưu được vị trí chữ."),
    );
  }
  async function toggleRuby() {
    try {
      await setMeta("preferences", { ...prefs, furigana: !prefs.furigana });
    } catch {
      setSaveError("Chưa lưu được tùy chỉnh.");
    }
  }
  async function practiceCurrentKanji() {
    try {
      const a = await createAttempt(
        lesson.id,
        "recall",
        learningWordsForKanji(k).map((w) => w.id),
      );
      navigate("/practice/" + a.id);
    } catch {
      setSaveError("Chưa tạo được lượt luyện. Hãy thử lại.");
    }
  }
  return (
    <>
      <Link className="back-link" to="/lessons">
        <ArrowLeft size={17} />
        Tất cả bài học
      </Link>
      <div className="lesson-heading">
        <Heading
          eyebrow={`BÀI ${String(lesson.order).padStart(2, "0")} / 15`}
          title={lesson.title}
        >
          {lesson.kanjiIds.length} Kanji ·{" "}
          {words.filter((w) => priority(w, lesson.id) === "★").length} từ trọng
          tâm · 4 câu ví dụ
        </Heading>
        <button className="btn secondary compact" onClick={toggleRuby}>
          {prefs.furigana ? <Eye /> : <EyeSlash />}
          {prefs.furigana ? "Ẩn" : "Hiện"} Hiragana
        </button>
      </div>
      {saveError && <Notice>{saveError}</Notice>}
      <div className="lesson-progress">
        <ProgressBar
          value={mastered}
          max={lesson.kanjiIds.length}
          label="Kanji đã vững cách đọc"
        />
        <span>Học theo nhịp của bạn</span>
      </div>
      <nav className="tabs" aria-label="Nội dung bài">
        {[
          ["kanji", "Khám phá chữ"],
          ["vocabulary", "Từ vựng"],
          ["examples", "Câu ví dụ"],
          ["tips", "Mẹo nhớ"],
          ["practice", "Luyện tập"],
        ].map(([id, title]) => (
          <Link
            className={tab === id ? "active" : ""}
            to={`/lessons/${lesson.id}/${id}`}
            key={id}
          >
            {title}
          </Link>
        ))}
      </nav>
      {tab === "kanji" && (
        <>
          <div className="kanji-selector" aria-label="Chọn Kanji">
            {lesson.kanjiIds.map((id, i) => (
              <button
                lang="ja"
                aria-label={`Học chữ ${kanjiById(id)?.literal}`}
                aria-pressed={i === index}
                className={i === index ? "selected" : ""}
                key={id}
                onClick={() => choose(i)}
              >
                {kanjiById(id)?.literal}
              </button>
            ))}
          </div>
          <div className="study-layout">
            <section className="kanji-focus panel">
              <span className="eyebrow">
                CHỮ {index + 1} / {lesson.kanjiIds.length}
              </span>
              <div className="kanji-paper">
                <span lang="ja">{k.literal}</span>
              </div>
              <h2>{k.hanViet}</h2>
              <p>{k.meaning}</p>
              <div className="readings">
                <div>
                  <span className="reading-tag">ON</span>
                  <span lang="ja">{k.on}</span>
                </div>
                <div>
                  <span className="reading-tag kun">KUN</span>
                  <span lang="ja">{k.kun}</span>
                </div>
              </div>
              <div className="study-navigation">
                <button
                  className="btn ghost"
                  disabled={index === 0}
                  onClick={() => choose(index - 1)}
                >
                  <ArrowLeft />
                  Trước
                </button>
                <button
                  className="btn primary"
                  onClick={() =>
                    index < lesson.kanjiIds.length - 1
                      ? choose(index + 1)
                      : navigate(`/lessons/${lesson.id}/practice`)
                  }
                >
                  {index < lesson.kanjiIds.length - 1
                    ? "Chữ tiếp theo"
                    : "Luyện thử nhớ"}
                  <ArrowRight />
                </button>
              </div>
            </section>
            <div className="study-context">
              <section className="panel">
                <div className="small-heading">
                  <h2>Nhớ chữ qua từ</h2>
                  <span>{related.length} từ liên quan</span>
                </div>
                {related.length ? (
                  related.map((w) => (
                    <VocabularyRow key={w.id} word={w} lessonId={lesson.id} />
                  ))
                ) : (
                  <p>Chưa có từ ghép liên quan trong nguồn.</p>
                )}
                {related.length > 0 && (
                  <button
                    className="btn secondary practice-current"
                    onClick={practiceCurrentKanji}
                  >
                    Luyện cách đọc chữ này
                    <ArrowRight />
                  </button>
                )}
              </section>
              <section className="tip-box">
                <Lightbulb size={24} />
                <div>
                  <h3>Một cách học dễ nhớ</h3>
                  <p>
                    Đọc cả từ, che Hiragana rồi thử nhớ lại. Một chữ có thể có
                    nhiều cách đọc tùy từ ghép.
                  </p>
                </div>
              </section>
              {data.examples
                .filter(
                  (e) =>
                    e.lessonId === lesson.id && e.japanese.includes(k.literal),
                )
                .slice(0, 1)
                .map((e) => (
                  <ExampleCard key={e.id} example={e} />
                ))}
            </div>
          </div>
        </>
      )}
      {tab === "vocabulary" && <VocabularyGroups lesson={lesson} />}
      {tab === "examples" && (
        <div className="example-grid">
          {data.examples
            .filter((e) => e.lessonId === lesson.id)
            .map((e) => (
              <ExampleCard key={e.id} example={e} />
            ))}
        </div>
      )}
      {tab === "tips" && (
        <div className="panel prose">
          <h2>Liên tưởng và phân biệt</h2>
          <p className="muted">
            Mẹo nhớ từ giáo trình, không phải giải thích từ nguyên.
          </p>
          {lesson.tips.map((tip, i) => (
            <p className="source-tip" key={i}>
              <Lightbulb size={20} />
              {tip}
            </p>
          ))}
        </div>
      )}
      {tab === "practice" && <PracticeOptions lesson={lesson} />}
    </>
  );
}
function VocabularyRow({ word, lessonId }: { word: Word; lessonId: string }) {
  const prefs = usePreferences();
  return (
    <div className="vocabulary-row">
      <div>
        <span
          className="priority-star"
          title={priority(word, lessonId) === "★" ? "Trọng tâm" : "Mở rộng"}
        >
          {priority(word, lessonId)}
        </span>
        <Link to={`/library/words/${encodeURIComponent(word.id)}`}>
          <Ruby
            text={word.surface}
            reading={word.reading}
            show={prefs.furigana}
          />
        </Link>
        <AudioButton text={word.reading} />
      </div>
      <p>{meaning(word, lessonId)}</p>
      {word.outside.length > 0 && (
        <small className="extension-label">
          Kanji mở rộng: {word.outside.join("・")}
        </small>
      )}
    </div>
  );
}
export function ExampleCard({
  example,
}: {
  example: (typeof data.examples)[number];
}) {
  const [reading, setReading] = useState(false),
    [translation, setTranslation] = useState(false);
  return (
    <article className="panel example-card">
      <div className="small-heading">
        <span className="eyebrow">TRONG MỘT CÂU</span>
        <AudioButton text={example.reading} />
      </div>
      <p className="ja example-japanese" lang="ja">
        {example.japanese}
      </p>
      <div className="example-actions">
        <button className="text-button" onClick={() => setReading(!reading)}>
          {reading ? "Ẩn" : "Xem"} cách đọc
        </button>
        <button
          className="text-button"
          onClick={() => setTranslation(!translation)}
        >
          {translation ? "Ẩn" : "Xem"} nghĩa
        </button>
      </div>
      {reading && (
        <p lang="ja" className="ja reading-line">
          {example.reading}
        </p>
      )}
      {translation && <p>{example.meaning}</p>}
    </article>
  );
}
function PracticeOptions({ lesson }: { lesson: Lesson }) {
  const navigate = useNavigate(),
    voices = useVoices();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [extra, setExtra] = useState(false),
    [local, setLocal] = useState<"flash" | "matching" | null>(null);
  const attempts =
    useLiveQuery(() =>
      db.attempts.where("scope").equals(lesson.id).toArray(),
    ) ?? [];
  const words = lesson.vocabularyIds
    .map((id) => wordById(id)!)
    .filter((w) => extra || priority(w, lesson.id) === "★");
  const options = [
    {
      mode: "recall",
      icon: Keyboard,
      title: "Nhập cách đọc",
      description: "Nhìn từ, tự nhớ Hiragana. Không có gợi ý đáp án.",
    },
    {
      mode: "reading",
      icon: Cards,
      title: "Thẻ thử nhớ",
      description: "Chọn cách đọc trước khi xem lời giải.",
    },
    {
      mode: "orthography",
      icon: CheckSquare,
      title: "Chọn Kanji đúng",
      description: "Từ cách đọc, nhận diện đúng mặt chữ.",
    },
    {
      mode: "meaning",
      icon: BookOpen,
      title: "Hiểu nghĩa của từ",
      description: "Kết nối chữ Nhật với nghĩa tiếng Việt.",
    },
    {
      mode: "context",
      icon: Lightbulb,
      title: "Dùng trong ngữ cảnh",
      description: "Chọn từ phù hợp để hoàn thành câu.",
    },
    {
      mode: "listening",
      icon: Headphones,
      title: "Nghe và chọn từ",
      description: voices.length
        ? "Nghe cách đọc, chọn cách viết đúng."
        : "Thiết bị này chưa có giọng đọc tiếng Nhật.",
    },
  ];
  async function start(mode: Mode) {
    setBusy(true);
    setError("");
    try {
      const active = attempts.find((a) => a.mode === mode && !a.completedAt);
      if (active) {
        navigate("/practice/" + active.id);
        return;
      }
      const ids =
        mode === "recall"
          ? words.map((w) => w.id)
          : data.questions
              .filter(
                (q) =>
                  q.lessonId === lesson.id &&
                  (mode === "quiz"
                    ? lesson.questionIds.includes(q.id)
                    : q.skill ===
                      (mode === "listening" ? "orthography" : mode)),
              )
              .map((q) => q.id);
      if (!ids.length) {
        setError("Nguồn chưa có câu hỏi phù hợp cho chế độ này.");
        return;
      }
      const a = await createAttempt(lesson.id, mode, ids);
      navigate("/practice/" + a.id);
    } catch {
      setError("Chưa lưu được phiên học. Hãy thử lại.");
    } finally {
      setBusy(false);
    }
  }
  if (local === "flash")
    return <Flashcards words={words} onBack={() => setLocal(null)} />;
  if (local === "matching")
    return <Matching words={words} onBack={() => setLocal(null)} />;
  return (
    <>
      {error && <Notice>{error}</Notice>}
      <div className="review-banner">
        <div>
          <span className="eyebrow">SẴN SÀNG THỬ SỨC?</span>
          <h2>Kiểm tra cuối bài</h2>
          <p>8 câu hỏi · Không giới hạn thời gian · Giải thích từng câu</p>
        </div>
        <button
          className="btn primary"
          disabled={busy}
          onClick={() => start("quiz")}
        >
          <Exam size={21} />
          Làm bài kiểm tra
        </button>
      </div>
      <label className="check-label">
        <input
          type="checkbox"
          checked={extra}
          onChange={(e) => setExtra(e.target.checked)}
        />
        Thêm từ mở rộng ☆ vào thẻ xem lại, nhập cách đọc và ghép cặp
      </label>
      <div className="practice-grid">
        {options.map((o) => (
          <button
            key={o.mode}
            className="practice-card"
            disabled={busy || (o.mode === "listening" && !voices.length)}
            onClick={() => start(o.mode as Mode)}
          >
            <o.icon size={28} weight="duotone" />
            <h3>{o.title}</h3>
            <p>{o.description}</p>
            <span>
              {attempts.some((a) => a.mode === o.mode && !a.completedAt)
                ? "Tiếp tục phiên đang học"
                : "Bắt đầu luyện"}
              <ArrowRight />
            </span>
          </button>
        ))}
        <button className="practice-card" onClick={() => setLocal("flash")}>
          <ArrowsClockwise size={28} />
          <h3>Xem lại nhanh</h3>
          <p>Lật thẻ để làm quen. Không chấm và không tăng mức thành thạo.</p>
          <span>
            Mở thẻ
            <ArrowRight />
          </span>
        </button>
        <button className="practice-card" onClick={() => setLocal("matching")}>
          <PuzzlePiece size={28} />
          <h3>Ghép cặp</h3>
          <p>
            Chạm từ và cách đọc tương ứng để luyện nhận diện. Không tính thành
            thạo.
          </p>
          <span>
            Ghép thử
            <ArrowRight />
          </span>
        </button>
      </div>
    </>
  );
}
function Flashcards({ words, onBack }: { words: Word[]; onBack: () => void }) {
  const [index, setIndex] = useState(0),
    [flipped, setFlipped] = useState(false);
  const w = words[index];
  return (
    <>
      <button className="back-link" onClick={onBack}>
        <ArrowLeft />
        Chọn chế độ
      </button>
      <div className="flashcard panel">
        <p>
          Xem lại nhanh · {index + 1}/{words.length} · Không chấm điểm
        </p>
        <button
          className="flash-face"
          onClick={() => setFlipped(!flipped)}
          aria-label={flipped ? "Ẩn lời giải" : "Lật thẻ"}
        >
          <span className="ja" lang="ja">
            {w.surface}
          </span>
          {flipped ? (
            <>
              <span className="flash-reading" lang="ja">
                {w.reading}
              </span>
              <strong>{w.meaning}</strong>
              <small>{w.mnemonic}</small>
            </>
          ) : (
            <small>Thử nhớ cách đọc và nghĩa, rồi chạm để lật</small>
          )}
        </button>
        {flipped && <AudioButton text={w.reading} />}
        <div className="study-navigation">
          <button
            className="btn secondary"
            disabled={index === 0}
            onClick={() => {
              setIndex(index - 1);
              setFlipped(false);
            }}
          >
            <ArrowLeft />
            Trước
          </button>
          <button
            className="btn primary"
            onClick={() => {
              if (index === words.length - 1) onBack();
              else {
                setIndex(index + 1);
                setFlipped(false);
              }
            }}
          >
            {index === words.length - 1 ? "Hoàn tất" : "Thẻ tiếp"}
            <ArrowRight />
          </button>
        </div>
      </div>
    </>
  );
}
function Matching({ words, onBack }: { words: Word[]; onBack: () => void }) {
  const [pairs, setPairs] = useState(() =>
    shuffled(
      words.filter(
        (w, i, list) => list.findIndex((v) => v.reading === w.reading) === i,
      ),
    ).slice(0, 5),
  );
  const [right, setRight] = useState(() => shuffled(pairs)),
    [left, setLeft] = useState<string | null>(null),
    [done, setDone] = useState<string[]>([]),
    [feedback, setFeedback] = useState("");
  function match(w: Word) {
    if (!left) {
      setFeedback("Chọn từ ở cột bên trái trước.");
      return;
    }
    if (left === w.id) {
      setDone([...done, w.id]);
      setFeedback(`Đúng rồi! ${w.surface} đọc là ${w.reading}.`);
    } else {
      const target = pairs.find((p) => p.id === left)!;
      setFeedback(`Chưa đúng. ${target.surface} đọc là ${target.reading}.`);
    }
    setLeft(null);
  }
  return (
    <>
      <button className="back-link" onClick={onBack}>
        <ArrowLeft />
        Chọn chế độ
      </button>
      <div className="panel">
        <h2>Chạm để ghép từ và cách đọc</h2>
        <p>Luyện nhận diện, không dùng để đánh dấu đã thuộc.</p>
        <div className="matching">
          <div>
            {pairs.map((w) => (
              <button
                key={w.id}
                disabled={done.includes(w.id)}
                className={left === w.id ? "selected" : ""}
                onClick={() => setLeft(w.id)}
                lang="ja"
              >
                {w.surface}
                {done.includes(w.id) && " ✓"}
              </button>
            ))}
          </div>
          <div>
            {right.map((w) => (
              <button
                key={w.id}
                disabled={done.includes(w.id)}
                onClick={() => match(w)}
                lang="ja"
              >
                {w.reading}
                {done.includes(w.id) && " ✓"}
              </button>
            ))}
          </div>
        </div>
        <p role="status">{feedback}</p>
        {done.length === pairs.length && (
          <button
            className="btn primary"
            onClick={() => {
              const next = shuffled(
                words.filter(
                  (w, i, list) =>
                    list.findIndex((v) => v.reading === w.reading) === i,
                ),
              ).slice(0, 5);
              setPairs(next);
              setRight(shuffled(next));
              setDone([]);
              setFeedback("");
            }}
          >
            Ghép lượt mới
            <ArrowRight />
          </button>
        )}
      </div>
    </>
  );
}
