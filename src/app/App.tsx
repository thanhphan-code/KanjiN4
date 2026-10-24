import { Component, useEffect, useState, type ReactNode } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import {
  BookOpen,
  Books,
  ArrowClockwise,
  ChartBar,
  GearSix,
  MagnifyingGlass,
  Plant,
  ArrowUpRight,
  WifiSlash,
  CheckCircle,
  House,
  BookBookmark,
} from "@phosphor-icons/react";
import { registerSW } from "virtual:pwa-register";
import { db, defaults, masteredKanji } from "../storage/db";
import { Notice, usePreferences } from "../components/common";
import {
  Home,
  Library,
  ProgressPage,
  ReviewPage,
  About,
} from "../features/overview";
import { LessonPage } from "../features/lesson";
import { PracticePage, ReadingPage } from "../features/practice";
import { Settings } from "../features/settings";
const nav = [
  { to: "/lessons", name: "Học bài", icon: BookOpen },
  { to: "/review", name: "Ôn tập", icon: ArrowClockwise },
  { to: "/library", name: "Tra cứu", icon: Books },
  { to: "/progress", name: "Tiến độ", icon: ChartBar },
];
class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="empty">
        <h1>Chưa mở được dữ liệu học</h1>
        <p>
          Dữ liệu không bị tự động xóa. Hãy thử tải lại hoặc kiểm tra quyền lưu
          trữ của trình duyệt.
        </p>
        <button className="btn primary" onClick={() => location.reload()}>
          Thử lại
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
function Shell() {
  const location = useLocation(),
    navigate = useNavigate(),
    prefs = usePreferences();
  const [query, setQuery] = useState(""),
    [offline, setOffline] = useState(!navigator.onLine),
    [ready, setReady] = useState(false),
    [update, setUpdate] = useState(false);
  const [storageError, setStorageError] = useState("");
  const progress = useLiveQuery(() => db.progress.toArray()) ?? [];
  const count = masteredKanji(progress).length;
  useEffect(() => {
    db.open()
      .then(async () => {
        if (!(await db.meta.get("preferences")))
          await db.meta.put({ id: "preferences", value: defaults });
      })
      .catch(() =>
        setStorageError(
          "Không lưu được tiến độ. Hãy kiểm tra quyền lưu trữ hoặc chế độ riêng tư của trình duyệt.",
        ),
      );
  }, []);
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      document.documentElement.dataset.theme =
        prefs.theme === "system"
          ? media.matches
            ? "dark"
            : "light"
          : prefs.theme;
    };
    sync();
    media.addEventListener("change", sync);
    document.documentElement.style.setProperty(
      "--jp-scale",
      String(prefs.fontScale),
    );
    return () => media.removeEventListener("change", sync);
  }, [prefs]);
  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    if (import.meta.env.PROD)
      registerSW({
        onOfflineReady: () => setReady(true),
        onNeedRefresh: () => setUpdate(true),
      });
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    document
      .querySelector<HTMLElement>("#main-content")
      ?.focus({ preventScroll: true });
  }, [location.pathname]);
  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        Đến nội dung chính
      </a>
      <aside className="sidebar">
        <Link className="brand" to="/">
          <span className="brand-mark">字</span>
          <span>
            kanji garden<small>漢字の庭</small>
          </span>
        </Link>
        <div className="sidebar-caption">KHÔNG GIAN HỌC CỦA BẠN</div>
        <nav aria-label="Điều hướng chính">
          <NavLink to="/" end>
            <House size={21} />
            Tổng quan
          </NavLink>
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to}>
              <n.icon size={21} />
              {n.name}
              {n.to === "/lessons" && <span className="nav-count">15</span>}
            </NavLink>
          ))}
          <NavLink to="/reading">
            <BookBookmark size={21} />
            Đọc hiểu
          </NavLink>
        </nav>
        <div className="sidebar-garden">
          <Plant size={30} weight="duotone" />
          <p>
            Mỗi chữ một chút.
            <br />
            Mỗi lần một bước.
          </p>
          <small>Cứ học theo nhịp của bạn.</small>
          <div className="sidebar-progress">
            <span>{count} / 181 chữ đã vững</span>
            <progress value={count} max={181} />
          </div>
        </div>
        <div className="sidebar-bottom">
          <NavLink to="/settings">
            <GearSix size={20} />
            Cài đặt
          </NavLink>
          <Link to="/about">
            Về Kanji Garden <ArrowUpRight size={16} />
          </Link>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            Khu vườn của bạn <span>/</span>{" "}
            <strong>
              {location.pathname.startsWith("/lessons")
                ? "Bài học"
                : location.pathname.startsWith("/practice")
                  ? "Luyện tập"
                  : location.pathname.startsWith("/library")
                    ? "Tra cứu"
                    : location.pathname.startsWith("/reading")
                      ? "Đọc hiểu"
                      : location.pathname.startsWith("/settings")
                        ? "Cài đặt"
                        : location.pathname.startsWith("/review")
                          ? "Ôn tập"
                          : location.pathname.startsWith("/progress")
                            ? "Tiến độ"
                            : "Tổng quan"}
            </strong>
          </div>
          <form
            className="header-search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/library?q=" + encodeURIComponent(query));
            }}
          >
            <MagnifyingGlass size={19} />
            <input
              aria-label="Tìm Kanji, cách đọc, nghĩa"
              placeholder="Tìm Kanji, cách đọc, nghĩa…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <kbd>↵</kbd>
          </form>
          <span className="level-badge">JLPT N4</span>
          <Link
            className="mobile-settings icon-button"
            to="/settings"
            aria-label="Cài đặt"
          >
            <GearSix size={23} />
          </Link>
        </header>
        <main id="main-content" tabIndex={-1}>
          {storageError && <Notice>{storageError}</Notice>}
          {offline && (
            <div className="connection">
              <WifiSlash />
              Bạn đang học ngoại tuyến. Tiến độ vẫn lưu trên thiết bị.
            </div>
          )}
          {ready && (
            <div className="connection">
              <CheckCircle />
              Đã tải nội dung để học ngoại tuyến.
              <button onClick={() => setReady(false)}>Đóng</button>
            </div>
          )}
          {update && (
            <Notice>
              Có bản cập nhật. Hãy hoàn tất câu đang làm rồi đóng và mở lại ứng
              dụng.
            </Notice>
          )}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lessons" element={<Home />} />
            <Route path="/lessons/:lessonId/*" element={<LessonPage />} />
            <Route path="/library" element={<Library />} />
            <Route path="/library/kanji/:kanjiId" element={<Library />} />
            <Route path="/library/words/:wordId" element={<Library />} />
            <Route path="/practice/:attemptId" element={<PracticePage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/reading" element={<ReadingPage />} />
            <Route path="/reading/:passageId" element={<ReadingPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route
              path="*"
              element={
                <div className="empty">
                  <h1>Không tìm thấy trang</h1>
                  <Link className="btn primary" to="/">
                    Về bài học
                  </Link>
                </div>
              }
            />
          </Routes>
          <footer className="page-footer">
            <span>
              漢字の庭 <span className="footer-dot">·</span> Học từng chữ, nhớ
              thật lâu.
            </span>
            <span>Không tài khoản. Không áp lực.</span>
          </footer>
        </main>
      </div>
      <nav className="mobile-nav" aria-label="Điều hướng di động">
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to}>
            <n.icon size={23} />
            <span>{n.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
