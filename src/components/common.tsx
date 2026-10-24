import { useEffect, useState, type ReactNode } from "react";
import {
  SpeakerHigh,
  ArrowRight,
  Plant,
  WarningCircle,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { db, defaults, type Preferences } from "../storage/db";
export function usePreferences() {
  return (
    useLiveQuery(
      async () =>
        (await db.meta.get("preferences"))?.value as Preferences | undefined,
    ) ?? defaults
  );
}
export function Empty({
  title,
  children,
  to,
  action,
}: {
  title: string;
  children?: ReactNode;
  to?: string;
  action?: string;
}) {
  return (
    <div className="empty">
      <Plant size={42} weight="duotone" />
      <h2>{title}</h2>
      <p>{children}</p>
      {to && (
        <Link className="btn primary" to={to}>
          {action ?? "Khám phá bài học"}
          <ArrowRight />
        </Link>
      )}
    </div>
  );
}
export function ProgressBar({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  return (
    <div className="progress-block">
      <div className="progress-label">
        <span>{label}</span>
        <span>
          {value}/{max}
        </span>
      </div>
      <progress value={value} max={max || 1} aria-label={label} />
    </div>
  );
}
export function useVoices() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const sync = () =>
      setVoices(
        speechSynthesis
          .getVoices()
          .filter((v) => v.lang.toLowerCase().startsWith("ja")),
      );
    sync();
    speechSynthesis.addEventListener("voiceschanged", sync);
    return () => speechSynthesis.removeEventListener("voiceschanged", sync);
  }, []);
  return voices;
}
export function AudioButton({ text, label }: { text: string; label?: string }) {
  const voices = useVoices(),
    prefs = usePreferences();
  const [playing, setPlaying] = useState(false),
    [error, setError] = useState("");
  useEffect(
    () => () => {
      if ("speechSynthesis" in window) speechSynthesis.cancel();
    },
    [],
  );
  function play() {
    if (!voices.length) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ja-JP";
    u.voice = voices.find((v) => v.voiceURI === prefs.voiceURI) ?? voices[0];
    u.rate = prefs.rate;
    u.onstart = () => setPlaying(true);
    u.onend = () => setPlaying(false);
    u.onerror = () => {
      setPlaying(false);
      setError("Không phát được âm thanh. Bạn có thể đọc Hiragana.");
    };
    setError("");
    speechSynthesis.speak(u);
  }
  return (
    <span className="audio-control">
      <button
        className="icon-button"
        aria-label={label ?? `Nghe ${text}`}
        title={
          voices.length
            ? "Nghe cách đọc"
            : "Thiết bị chưa có giọng đọc tiếng Nhật"
        }
        disabled={!voices.length}
        onClick={play}
      >
        <SpeakerHigh size={21} weight={playing ? "fill" : "regular"} />
      </button>
      {error && <small role="status">{error}</small>}
    </span>
  );
}
export function Ruby({
  text,
  reading,
  show = true,
}: {
  text: string;
  reading: string;
  show?: boolean;
}) {
  return (
    <span lang="ja" className="ja">
      {show ? (
        <ruby>
          {text}
          <rt>{reading}</rt>
        </ruby>
      ) : (
        text
      )}
    </span>
  );
}
export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="notice" role="status">
      <WarningCircle size={20} />
      <span>{children}</span>
    </div>
  );
}
export function Heading({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {children && <p className="subtitle">{children}</p>}
    </div>
  );
}
