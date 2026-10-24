import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle,
  MagnifyingGlass,
  Plant,
  ArrowClockwise,
  Leaf,
  Sun,
  Mountains,
  MapPin,
  BowlFood,
  Heart,
  Users,
  House,
  Train,
  GraduationCap,
  ChatCircle,
  Briefcase,
  Hand,
  Scales,
  MusicNotes,
  Sparkle,
  type Icon,
} from "@phosphor-icons/react";
import {
  data,
  normalizeSearch,
  supplementForWord,
  lessonById,
  wordById,
  kanjiById,
  skillLabels,
} from "../domain/content";
import { createAttempt, db, masteredKanji, reviewPlan } from "../storage/db";
import {
  AudioButton,
  Empty,
  Heading,
  ProgressBar,
  Ruby,
  usePreferences,
} from "../components/common";
const lessonIcons: Icon[] = [
  Sun,
  Mountains,
  MapPin,
  BowlFood,
  Heart,
  Users,
  House,
  Train,
  GraduationCap,
  ChatCircle,
  Briefcase,
  Hand,
  Scales,
  MusicNotes,
  Sparkle,
];
export function Home() {
  const [filter, setFilter] = useState("all");
  const progress = useLiveQuery(() => db.progress.toArray()) ?? [],
    attempts = useLiveQuery(() => db.attempts.toArray()) ?? [];
  const last = useLiveQuery(() => db.meta.get("lastLesson"));
  const lesson = lessonById(String(last?.value)) ?? data.lessons[0],
    mastered = masteredKanji(progress);
  const seen = useLiveQuery(() => db.meta.toArray()) ?? [];
  const learned = seen.filter((m) => m.id.startsWith("seen-")).length;
  const needReview = new Set(
    progress
      .filter((p) => p.status === "learning" || p.dueAt <= Date.now())
      .map((p) => p.itemId),
  ).size;
  const visible = data.lessons.filter(
    (l) =>
      filter === "all" ||
      (filter === "started"
        ? seen.some((m) => m.id === "seen-" + l.id)
        : mastered.filter((k) => k.lessonId === l.id).length ===
          l.kanjiIds.length),
  );
  return (
    <>
      <section className="welcome">
        <div>
          <span className="eyebrow">
            <span className="tiny-leaf">
              <Leaf weight="fill" />
            </span>{" "}
            CHÀO MỪNG ĐẾN KHU VƯỜN KANJI
          </span>
          <h1>
            Học Kanji N4,
            <br />
            <span>nhớ từng chữ một.</span>
          </h1>
          <p>
            181 chữ Kanji. 15 bài học gần gũi.
            <br />
            Một hành trình nhỏ, theo nhịp của riêng bạn.
          </p>
          <Link className="btn primary" to={`/lessons/${lesson.id}`}>
            {last
              ? `Học tiếp Bài ${String(lesson.order).padStart(2, "0")}`
              : "Bắt đầu Bài 01"}
            <ArrowRight size={19} />
          </Link>
          <span className="welcome-note">Tất cả bài học đều mở sẵn</span>
        </div>
        <div
          className="hero-art"
          aria-label="Chữ học, mùa xuân và cây tượng trưng cho hành trình học Kanji"
        >
          <div className="art-circle" />
          <div className="art-tile tile-back">
            <span lang="ja">春</span>
            <small>はる · mùa xuân</small>
          </div>
          <div className="art-tile tile-front">
            <span lang="ja">学</span>
            <small>まなぶ · học</small>
          </div>
          <div className="art-tile tile-small">
            <span lang="ja">木</span>
          </div>
          <span className="art-caption">小さな一歩、大きな成長。</span>
        </div>
      </section>
      <section className="stats-strip" aria-label="Tiến độ của bạn">
        <div>
          <span className="stat-icon green">
            <Plant size={23} />
          </span>
          <span>
            <strong>
              {mastered.length}
              <small> / 181</small>
            </strong>
            <span>Kanji đã vững</span>
          </span>
        </div>
        <div>
          <span className="stat-icon sand">
            <ArrowClockwise size={23} />
          </span>
          <span>
            <strong>
              {needReview}
              <small> từ</small>
            </strong>
            <span>Đến lượt ôn / chưa vững</span>
          </span>
          {needReview > 0 && (
            <Link to="/review" className="stat-action" aria-label="Ôn tập">
              <ArrowUpRight />
            </Link>
          )}
        </div>
        <div>
          <span className="stat-icon lilac">
            <BookOpen size={23} />
          </span>
          <span>
            <strong>
              {learned}
              <small> / 15</small>
            </strong>
            <span>Bài đã khám phá</span>
          </span>
        </div>
      </section>
      <section className="lesson-section">
        <div className="section-title">
          <div>
            <h2>Khu vườn 15 bài học</h2>
            <p>Chọn một chủ đề bạn thích. Bắt đầu từ bất cứ đâu.</p>
          </div>
          <span className="subtle-badge">181 KANJI</span>
        </div>
        <div className="filter-row">
          <div className="segmented" aria-label="Lọc bài học">
            {[
              ["all", "Tất cả bài học"],
              ["started", "Đang khám phá"],
              ["mastered", "Đã vững"],
            ].map(([id, title]) => (
              <button
                key={id}
                className={filter === id ? "selected" : ""}
                onClick={() => setFilter(id)}
              >
                {title}
                {id === "all" && <span>15</span>}
              </button>
            ))}
          </div>
          <span className="filter-note">
            <CheckCircle size={16} />
            Học tự do, không khóa bài
          </span>
        </div>
        {!visible.length ? (
          <Empty title="Chưa có bài trong nhóm này">
            Bắt đầu một bài yêu thích. Tiến độ sẽ lớn lên cùng bạn.
          </Empty>
        ) : (
          <div className="lesson-grid">
            {visible.map((l) => {
              const Icon = lessonIcons[l.order - 1],
                complete = mastered.filter((k) => k.lessonId === l.id).length,
                started = seen.some((m) => m.id === "seen-" + l.id),
                tested = attempts.some(
                  (a) => a.scope === l.id && a.mode === "quiz" && a.completedAt,
                );
              return (
                <Link
                  to={`/lessons/${l.id}`}
                  key={l.id}
                  className={`lesson-card ${started ? "started" : ""}`}
                >
                  <div className="lesson-card-top">
                    <span className={`topic-icon tone-${(l.order - 1) % 4}`}>
                      <Icon size={24} weight="duotone" />
                    </span>
                    <span className="lesson-number">
                      BÀI {String(l.order).padStart(2, "0")}
                    </span>
                    <ArrowUpRight className="card-arrow" size={20} />
                  </div>
                  <h3>{l.title}</h3>
                  <p className="kanji-preview" lang="ja">
                    {l.kanjiIds
                      .slice(0, 5)
                      .map((id) => kanjiById(id)?.literal)
                      .join(" ")}
                    <span>…</span>
                  </p>
                  <div className="card-meta">
                    <span>
                      {l.kanjiIds.length} Kanji <span>·</span>{" "}
                      {
                        l.vocabularyIds.filter(
                          (id) =>
                            (
                              wordById(id)?.priorities as Record<
                                string,
                                string | undefined
                              >
                            )[l.id] === "★",
                        ).length
                      }{" "}
                      từ trọng tâm
                    </span>
                  </div>
                  <div className="lesson-card-bottom">
                    <span className={started ? "status-learning" : ""}>
                      {complete === l.kanjiIds.length
                        ? "Đã vững"
                        : tested
                          ? "Đã làm kiểm tra"
                          : started
                            ? "Đang khám phá"
                            : "Chưa bắt đầu"}
                    </span>
                    <span>
                      {complete}/{l.kanjiIds.length}
                      <ArrowRight size={16} />
                    </span>
                  </div>
                  <progress
                    value={complete}
                    max={l.kanjiIds.length}
                    aria-label={`Kanji đã vững Bài ${l.order}`}
                  />
                </Link>
              );
            })}
          </div>
        )}
      </section>
      <div className="learning-note">
        <Plant size={28} />
        <div>
          <strong>Không cần nhớ tất cả trong một lần.</strong>
          <p>
            Khám phá chữ, luyện nhớ chủ động, rồi quay lại những từ chưa vững.
          </p>
        </div>
        <Link to="/about">
          Cách học <ArrowRight />
        </Link>
      </div>
    </>
  );
}
export function Library() {
  const [params, setParams] = useSearchParams(),
    { kanjiId, wordId } = useParams();
  const prefs = usePreferences();
  const query = params.get("q") ?? "",
    [type, setType] = useState("all");
  const needle = normalizeSearch(query);
  const selectedKanji = kanjiId ? kanjiById(kanjiId) : undefined,
    selectedWord = wordId ? wordById(wordId) : undefined;
  const ks = data.kanji.filter((k) =>
    normalizeSearch(
      [k.literal, k.hanViet, k.meaning, k.on, k.kun].join(" "),
    ).includes(needle),
  );
  const words = data.vocabulary.filter((w) =>
    normalizeSearch(
      [
        w.surface,
        w.reading,
        supplementForWord(w.id)?.romaji,
        supplementForWord(w.id)?.meaningVi,
        ...Object.values(w.meanings),
      ].join(" "),
    ).includes(needle),
  );
  if (selectedKanji)
    return (
      <>
        <Link className="back-link" to="/library">
          ← Tra cứu
        </Link>
        <Heading title={`${selectedKanji.literal} · ${selectedKanji.hanViet}`}>
          {selectedKanji.meaning}
        </Heading>
        <div className="panel">
          <p className="ja">Âm On: {selectedKanji.on}</p>
          <p className="ja">Âm Kun: {selectedKanji.kun}</p>
          <Link
            className="btn primary"
            to={`/lessons/${selectedKanji.lessonId}?kanji=${encodeURIComponent(selectedKanji.id)}`}
          >
            Học chữ này
            <ArrowRight />
          </Link>
        </div>
        <WordList
          words={data.vocabulary.filter((w) =>
            w.surface.includes(selectedKanji.literal),
          )}
        />
      </>
    );
  if (selectedWord)
    return (
      <>
        <Link className="back-link" to="/library">
          ← Tra cứu
        </Link>
        <Heading title="Chi tiết từ vựng" />
        <div className="panel word-detail">
          <Ruby
            text={selectedWord.surface}
            reading={selectedWord.reading}
            show={prefs.furigana}
          />
          <AudioButton text={selectedWord.reading} />
          <h2>{selectedWord.meaning}</h2>
          {selectedWord.mnemonic && <p>Mẹo nhớ: {selectedWord.mnemonic}</p>}
          {supplementForWord(selectedWord.id) && (
            <div className="source-tip">
              <div>
                <p>
                  {supplementForWord(selectedWord.id)?.partOfSpeech} ·{" "}
                  {supplementForWord(selectedWord.id)?.romaji}
                </p>
                <p>
                  Nguồn bổ sung: {supplementForWord(selectedWord.id)?.meaningVi}
                </p>
                {supplementForWord(selectedWord.id)?.correction && (
                  <p>{supplementForWord(selectedWord.id)?.correction}</p>
                )}
              </div>
            </div>
          )}
          {selectedWord.outside.length > 0 && (
            <p className="muted">
              Kanji mở rộng: {selectedWord.outside.join("・")}
            </p>
          )}
          {selectedWord.lessonIds.map((id) => (
            <Link
              className="btn secondary"
              to={`/lessons/${id}/vocabulary`}
              key={id}
            >
              {lessonById(id)?.title}
              <ArrowRight />
            </Link>
          ))}
        </div>
      </>
    );
  if (kanjiId || wordId)
    return (
      <Empty title="Không tìm thấy mục từ" to="/library" action="Về tra cứu" />
    );
  return (
    <>
      <Heading eyebrow="THƯ VIỆN CỦA BẠN" title="Một chữ, nhiều kết nối.">
        Tra Kanji, Hiragana, Hán Việt hoặc nghĩa tiếng Việt.
      </Heading>
      <div className="large-search">
        <MagnifyingGlass size={23} />
        <input
          aria-label="Tìm kiếm thư viện"
          placeholder="Thử tìm: 病院, びょういん, bệnh viện…"
          value={query}
          onChange={(e) => setParams({ q: e.target.value }, { replace: true })}
        />
      </div>
      <div className="tabs">
        {[
          ["all", "Tất cả"],
          ["kanji", `Kanji (${ks.length})`],
          ["words", `Từ vựng (${words.length})`],
        ].map(([id, label]) => (
          <button
            className={type === id ? "active" : ""}
            key={id}
            onClick={() => setType(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {type !== "words" && (
        <div className="library-grid">
          {ks.map((k) => (
            <Link
              className="library-kanji"
              to={`/library/kanji/${encodeURIComponent(k.id)}`}
              key={k.id}
            >
              <strong lang="ja">{k.literal}</strong>
              <span>{k.hanViet}</span>
              <small>{k.meaning}</small>
            </Link>
          ))}
        </div>
      )}
      {type !== "kanji" && <WordList words={words} />}{" "}
      {!ks.length && !words.length && (
        <Empty title="Chưa tìm thấy từ phù hợp">
          Thử một chữ Kanji hoặc rút gọn từ khóa tiếng Việt.
        </Empty>
      )}
    </>
  );
}
export function WordList({ words }: { words: typeof data.vocabulary }) {
  const prefs = usePreferences();
  return (
    <div className="word-list">
      {words.map((w) => (
        <div key={w.id} className="word-row">
          <Link to={`/library/words/${encodeURIComponent(w.id)}`}>
            <Ruby text={w.surface} reading={w.reading} show={prefs.furigana} />
          </Link>
          <span>
            {w.meaning}
            {w.outside.length > 0 && (
              <small className="extension-label">
                Kanji mở rộng: {w.outside.join("・")}
              </small>
            )}
          </span>
          <AudioButton text={w.reading} />
        </div>
      ))}
    </div>
  );
}
export function ReviewPage() {
  const active = useLiveQuery(async () =>
    (await db.attempts.where("scope").equals("review").toArray()).find(
      (a) => !a.completedAt,
    ),
  );
  const progress = useLiveQuery(() => db.progress.toArray()) ?? [],
    navigate = useNavigate();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const plan = reviewPlan(progress),
    items = plan.ids;
  async function start() {
    setBusy(true);
    try {
      const a =
        active ??
        (await createAttempt("review", "review", items, plan.overrides));
      navigate("/practice/" + a.id);
    } catch {
      setError("Chưa tạo được lượt ôn. Hãy thử lại.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Heading eyebrow="ÔN TẬP CHỦ ĐỘNG" title="Gặp lại để nhớ lâu hơn.">
        Ưu tiên từ chưa vững và từ đã đến lượt ôn. Bạn luôn có thể luyện thêm
        trong từng bài.
      </Heading>
      {error && <p role="alert">{error}</p>}
      {!items.length && !active ? (
        <Empty title="Chưa có từ cần ôn" to="/lessons">
          Sau khi làm bài, những từ cần luyện thêm sẽ xuất hiện ở đây.
        </Empty>
      ) : (
        <>
          <div className="review-banner">
            <div>
              <h2>
                {active
                  ? "Lượt ôn đang học"
                  : `${items.length} mục đang chờ bạn`}
              </h2>
              <p>
                Luyện lại cách đọc và những kỹ năng chưa vững, rồi xem giải
                thích.
              </p>
            </div>
            <button className="btn primary" disabled={busy} onClick={start}>
              {active ? "Tiếp tục ôn" : "Bắt đầu ôn"}
              <ArrowRight />
            </button>
          </div>
          <div className="word-list">
            {items.map((id) => {
              const w = wordById(id),
                q = data.questions.find((q) => q.id === id);
              return (
                <div className="word-row" key={id}>
                  <span className="ja">{w?.surface ?? q?.stem}</span>
                  <span>{w?.meaning ?? "Ôn lại câu hỏi trong ngữ cảnh"}</span>
                  <small>Cần ôn</small>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
export function ProgressPage() {
  const progress = useLiveQuery(() => db.progress.toArray()) ?? [],
    attempts = useLiveQuery(() => db.attempts.toArray()) ?? [],
    mastered = masteredKanji(progress);
  const words = new Set(
    progress.filter((p) => p.itemId.startsWith("w-")).map((p) => p.itemId),
  );
  return (
    <>
      <Heading eyebrow="NHỮNG BƯỚC TIẾN NHỎ" title="Nhìn lại khu vườn của bạn.">
        Tiến độ dựa trên câu trả lời có chấm. Xem thẻ chưa được tính là đã nhớ.
      </Heading>
      <div className="metrics">
        <div className="panel">
          <Plant />
          <strong>
            {mastered.length}
            <small> / 181</small>
          </strong>
          <p>Kanji đã vững cách đọc</p>
        </div>
        <div className="panel">
          <BookOpen />
          <strong>{words.size}</strong>
          <p>Từ đã luyện</p>
        </div>
        <div className="panel">
          <CheckCircle />
          <strong>{attempts.filter((a) => a.completedAt).length}</strong>
          <p>Lượt luyện đã hoàn thành</p>
        </div>
      </div>
      <h2 className="block-heading">Từng kỹ năng một</h2>
      <div className="skill-grid">
        {Object.entries(skillLabels)
          .filter(([id]) => id !== "matching")
          .map(([id, title]) => {
            const ps = progress.filter((p) => p.skill === id),
              correct = ps.reduce((n, p) => n + p.correct, 0),
              total = ps.reduce((n, p) => n + p.correct + p.wrong, 0);
            return (
              <div className="panel" key={id}>
                <h3>{title}</h3>
                <ProgressBar
                  value={correct}
                  max={total}
                  label="Câu trả lời đúng"
                />
                <small>
                  {total
                    ? `${Math.round((correct / total) * 100)}% chính xác`
                    : "Chưa có dữ liệu"}
                </small>
              </div>
            );
          })}
      </div>
      <h2 className="block-heading">Tiến độ theo bài</h2>
      <div className="panel">
        {data.lessons.map((l) => (
          <Link className="progress-lesson" to={"/lessons/" + l.id} key={l.id}>
            <span>
              {String(l.order).padStart(2, "0")} · {l.title}
            </span>
            <ProgressBar
              value={mastered.filter((k) => k.lessonId === l.id).length}
              max={l.kanjiIds.length}
              label="Đã vững"
            />
            <ArrowRight />
          </Link>
        ))}
      </div>
      <h2 className="block-heading">Lịch sử luyện tập</h2>
      {!attempts.length ? (
        <Empty title="Trang mới cho hành trình của bạn" to="/lessons">
          Hãy thử một bài luyện để thấy kết quả tại đây.
        </Empty>
      ) : (
        <div className="panel">
          {[...attempts]
            .sort((a, b) => b.startedAt - a.startedAt)
            .map((a) => (
              <Link className="history-row" to={"/practice/" + a.id} key={a.id}>
                <span>
                  <strong>
                    {lessonById(a.scope)?.title ??
                      (a.scope === "review"
                        ? "Ôn tập"
                        : "Đọc hiểu / luyện bổ sung")}
                  </strong>
                  <small>{new Date(a.startedAt).toLocaleString("vi-VN")}</small>
                </span>
                <span>
                  {a.completedAt
                    ? `${Object.values(a.answers).filter((x) => x.correct).length}/${a.items.length} đúng`
                    : "Tiếp tục"}
                  <ArrowRight />
                </span>
              </Link>
            ))}
        </div>
      )}
    </>
  );
}
export function About() {
  return (
    <>
      <Heading
        eyebrow="KANJI GARDEN · 漢字の庭"
        title="Học từng chữ, nhớ thật lâu."
      >
        Một không gian học Kanji N4 độc lập, dành cho người Việt.
      </Heading>
      <article className="panel prose">
        <h2>Một vòng học dễ theo</h2>
        <ol>
          <li>Chọn bất kỳ bài nào trong 15 chủ đề.</li>
          <li>
            Khám phá chữ, đọc từ ghép và câu ví dụ. Ưu tiên những từ đánh dấu ★.
          </li>
          <li>Che cách đọc, tự thử nhớ, rồi làm bài luyện hoặc kiểm tra.</li>
          <li>Quay lại mục Ôn tập để luyện những từ chưa vững.</li>
        </ol>
        <h2>Tiến độ có ý nghĩa</h2>
        <p>
          Xem chữ không đồng nghĩa với đã thuộc. Hệ thống theo dõi từng kỹ năng,
          cần ít nhất ba lần đúng và bằng chứng ở những thời điểm cách nhau tối
          thiểu 24 giờ. Kanji chỉ được tính đã vững khi các từ trọng tâm chứa
          chữ đó có đủ bằng chứng về cách đọc. Nếu chữ không có từ trọng tâm
          trong nguồn, hệ thống dùng các từ mở rộng liên quan của bài đó.
        </p>
        <h2>Nguồn nội dung</h2>
        <p>
          Giáo trình “Kanji N4 – 181 chữ theo 15 bài” do bạn cung cấp. Bao gồm
          từ vựng, 60 câu ví dụ, 120 câu hỏi theo bài, 15 câu đọc hiểu và 16 câu
          luyện bổ sung. Đáp án đối chiếu theo khóa đáp án nguồn; kiểm tra cấu
          trúc không thay thế thẩm định của giáo viên tiếng Nhật.
        </p>
        <p>
          Đây là bài tập tự biên soạn, không phải đề JLPT chính thức. Hoàn thành
          nội dung không thay thế học ngữ pháp và luyện nghe N4. Các mẹo liên
          tưởng không phải giải thích từ nguyên.
        </p>
        <h2>Dữ liệu ở lại thiết bị của bạn</h2>
        <p>
          Không tài khoản, không gửi kết quả học lên máy chủ. Tiến độ lưu trên
          trình duyệt này. Xóa dữ liệu trình duyệt hoặc đổi thiết bị có thể làm
          mất tiến độ nếu chưa sao lưu.
        </p>
        <Link className="btn secondary" to="/settings">
          Cài đặt và sao lưu
          <ArrowRight />
        </Link>
      </article>
    </>
  );
}
