import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import {
  data,
  meaning,
  normalizeSearch,
  priority,
  supplementForWord,
  wordById,
  type Lesson,
} from "../domain/content";
import { createAttempt, db } from "../storage/db";
import {
  AudioButton,
  Notice,
  Ruby,
  usePreferences,
} from "../components/common";

export function VocabularyGroups({ lesson }: { lesson: Lesson }) {
  const navigate = useNavigate(),
    prefs = usePreferences();
  const [filter, setFilter] = useState("core");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const progress = useLiveQuery(() => db.progress.toArray()) ?? [];
  const words = lesson.vocabularyIds
    .map((id) => wordById(id)!)
    .filter((w) => {
      const meta = supplementForWord(w.id);
      const mastered = progress.some(
        (p) =>
          p.itemId === w.id && p.skill === "reading" && p.status === "mastered",
      );
      const matches =
        filter === "all" ||
        (filter === "new"
          ? meta?.isNew && meta.lessonId === lesson.id
          : filter === "weak"
            ? !mastered
            : filter === "mastered"
              ? mastered
              : priority(w, lesson.id) === (filter === "core" ? "★" : "☆"));
      return (
        matches &&
        normalizeSearch(
          [
            w.surface,
            w.reading,
            meaning(w, lesson.id),
            meta?.romaji,
            meta?.meaningVi,
          ].join(" "),
        ).includes(normalizeSearch(query))
      );
    });
  const pages = Math.ceil(words.length / 6);
  const currentPage = Math.min(page, Math.max(0, pages - 1));
  const group = words.slice(currentPage * 6, currentPage * 6 + 6);
  const questions = group.flatMap((w) => {
    const supplemental = data.questions.filter(
      (q) => q.wordId === w.id && q.id.startsWith("q-sup-"),
    );
    return supplemental.length
      ? supplemental
      : data.questions
          .filter(
            (q) =>
              q.wordId === w.id &&
              ["reading", "meaning", "orthography"].includes(q.skill),
          )
          .slice(0, 2);
  });
  async function start(typed: boolean) {
    setBusy(true);
    setError("");
    try {
      const ids = typed ? group.map((w) => w.id) : questions.map((q) => q.id);
      if (!ids.length) return;
      const attempts = await db.attempts
        .where("scope")
        .equals(lesson.id)
        .toArray();
      const old = attempts.find(
        (a) =>
          a.mode === "vocabulary" &&
          !a.completedAt &&
          a.items.length === ids.length &&
          a.items.every((id) => ids.includes(id)),
      );
      const attempt =
        old ?? (await createAttempt(lesson.id, "vocabulary", ids));
      navigate("/practice/" + attempt.id);
    } catch {
      setError("Chưa lưu được phiên luyện. Hãy thử lại.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section
      className="vocabulary-workspace"
      aria-label="Học từ vựng theo nhóm"
    >
      <div className="vocabulary-intro">
        <div>
          <span className="eyebrow">MỖI LẦN MỘT NHÓM NHỎ</span>
          <h2>Nhìn chữ. Nhớ nghĩa. Thử lại.</h2>
          <p>
            Học 6 từ, che đáp án rồi luyện ngay. Từ trùng dùng chung tiến độ với
            bài cũ.
          </p>
        </div>
        <button className="btn secondary" onClick={() => setHidden(!hidden)}>
          {hidden ? "Hiện đáp án" : "Che cách đọc và nghĩa"}
        </button>
      </div>
      <div className="segmented vocabulary-filters">
        {[
          ["core", "★ Trọng tâm"],
          ["extended", "☆ Mở rộng"],
          ["new", "Mới bổ sung"],
          ["all", "Tất cả"],
          ["weak", "Chưa vững"],
          ["mastered", "Đã vững"],
        ].map(([id, label]) => (
          <button
            key={id}
            className={filter === id ? "selected" : ""}
            aria-pressed={filter === id}
            onClick={() => {
              setFilter(id);
              setPage(0);
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <label className="vocabulary-search">
        Tìm trong bài
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          placeholder="Kanji, Hiragana, nghĩa hoặc Romaji…"
        />
      </label>
      {error && <Notice>{error}</Notice>}
      {!words.length ? (
        <p role="status">
          Không có từ phù hợp. Thử bộ lọc khác hoặc xóa tìm kiếm.
        </p>
      ) : (
        <>
          <div className="vocabulary-count">
            <span>
              {words.length} từ · Nhóm {currentPage + 1}/{pages}
            </span>
            <span>★ Trọng tâm · ☆ Mở rộng</span>
          </div>
          <div className="vocabulary-cards">
            {group.map((w) => {
              const meta = supplementForWord(w.id);
              return (
                <article className="vocabulary-card" key={w.id}>
                  <div className="vocabulary-card-top">
                    <span>
                      {priority(w, lesson.id)} {meta?.partOfSpeech || "Từ vựng"}
                    </span>
                    {meta?.isNew && (
                      <span className="vocabulary-badge">Mới</span>
                    )}
                  </div>
                  <Link
                    to={"/library/words/" + encodeURIComponent(w.id)}
                    className="vocabulary-surface"
                  >
                    <Ruby
                      text={w.surface}
                      reading={w.reading}
                      show={!hidden && prefs.furigana}
                    />
                  </Link>
                  {!hidden ? (
                    <>
                      <p className="vocabulary-gloss">
                        {meaning(w, lesson.id)}
                      </p>
                      {meta && meta.meaningVi !== meaning(w, lesson.id) && (
                        <p className="muted">Nguồn bổ sung: {meta.meaningVi}</p>
                      )}
                      <div className="vocabulary-card-bottom">
                        <span>{meta?.romaji}</span>
                        <AudioButton text={w.reading} />
                      </div>
                      {meta?.correction && <small>{meta.correction}</small>}
                    </>
                  ) : (
                    <p className="muted">
                      Thử nhớ cách đọc và nghĩa trước khi hiện đáp án.
                    </p>
                  )}
                </article>
              );
            })}
          </div>
          <div className="vocabulary-actions">
            <div>
              <h3>Luyện ngay nhóm này</h3>
              <p>Chấm tự động, giải thích từng câu và lưu từ cần ôn.</p>
            </div>
            <div>
              <button
                className="btn primary"
                disabled={busy || !questions.length}
                onClick={() => start(false)}
              >
                Quiz {questions.length} câu
              </button>
              <button
                className="btn secondary"
                disabled={busy}
                onClick={() => start(true)}
              >
                Gõ Hiragana · {group.length} từ
              </button>
            </div>
          </div>
          <nav className="vocabulary-pagination" aria-label="Nhóm từ">
            <button
              className="btn secondary"
              disabled={currentPage === 0}
              onClick={() => setPage(currentPage - 1)}
            >
              Nhóm trước
            </button>
            <span>
              {currentPage + 1} / {pages}
            </span>
            <button
              className="btn secondary"
              disabled={currentPage + 1 >= pages}
              onClick={() => setPage(currentPage + 1)}
            >
              Nhóm tiếp
            </button>
          </nav>
        </>
      )}
    </section>
  );
}
