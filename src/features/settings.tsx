import { useState } from "react";
import {
  DownloadSimple,
  UploadSimple,
  ShieldCheck,
  Trash,
  CheckCircle,
} from "@phosphor-icons/react";
import { db, defaults, setMeta } from "../storage/db";
import {
  backupSchema,
  exportBackup,
  replaceBackup,
  type Backup,
} from "../storage/backup";
import {
  AudioButton,
  Heading,
  Notice,
  usePreferences,
  useVoices,
} from "../components/common";
export function Settings() {
  const prefs = usePreferences(),
    voices = useVoices();
  const [message, setMessage] = useState(""),
    [pending, setPending] = useState<Backup | null>(null),
    [deleteStep, setDeleteStep] = useState(false),
    [confirmation, setConfirmation] = useState(""),
    [busy, setBusy] = useState(false);
  async function change(patch: Partial<typeof prefs>) {
    try {
      await setMeta("preferences", { ...prefs, ...patch });
    } catch {
      setMessage("Không lưu được cài đặt.");
    }
  }
  async function download() {
    try {
      await exportBackup();
      setMessage("Đã tạo bản sao lưu. Hãy giữ file JSON ở nơi an toàn.");
    } catch {
      setMessage("Chưa xuất được dữ liệu.");
    }
  }
  async function fileChanged(file?: File) {
    if (!file) return;
    setMessage("");
    setPending(null);
    if (file.size > 10 * 1024 * 1024) {
      setMessage("File quá lớn. Giới hạn 10 MB.");
      return;
    }
    try {
      const data = backupSchema.parse(JSON.parse(await file.text()));
      setPending(data);
    } catch {
      setMessage(
        "File không hợp lệ, sai phiên bản hoặc chứa ID nội dung không tồn tại. Dữ liệu hiện tại chưa thay đổi.",
      );
    }
  }
  async function restore() {
    if (!pending) return;
    setBusy(true);
    try {
      await exportBackup();
      await replaceBackup(pending);
      setPending(null);
      setMessage(
        "Đã khôi phục tiến độ. Bản cũ đã được xuất trước khi thay thế.",
      );
    } catch {
      setMessage("Chưa khôi phục được dữ liệu. Hãy thử lại.");
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (confirmation !== "XÓA") return;
    setBusy(true);
    try {
      await db.transaction(
        "rw",
        db.progress,
        db.attempts,
        db.meta,
        async () => {
          await db.progress.clear();
          await db.attempts.clear();
          await db.meta.clear();
          await db.meta.put({ id: "preferences", value: defaults });
        },
      );
      setDeleteStep(false);
      setConfirmation("");
      setMessage("Đã xóa dữ liệu học trên trình duyệt này.");
    } catch {
      setMessage("Không xóa được dữ liệu.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Heading
        eyebrow="KHÔNG GIAN HỌC CỦA RIÊNG BẠN"
        title="Học theo cách bạn thấy dễ chịu."
      >
        Điều chỉnh cách hiển thị và giữ an toàn cho tiến độ của bạn.
      </Heading>
      {message && <Notice>{message}</Notice>}
      <section className="panel settings-panel">
        <h2>Hiển thị</h2>
        <label className="setting-row">
          <span>
            <strong>Hiragana trên từ vựng</strong>
            <small>
              Ẩn cách đọc để tự thử nhớ; không áp dụng trong câu hỏi.
            </small>
          </span>
          <input
            type="checkbox"
            checked={prefs.furigana}
            onChange={(e) => change({ furigana: e.target.checked })}
          />
        </label>
        <label className="setting-row">
          <span>
            <strong>Kích thước chữ Nhật</strong>
            <small>{Math.round(prefs.fontScale * 100)}%</small>
          </span>
          <input
            aria-label="Kích thước chữ Nhật"
            type="range"
            min="0.9"
            max="1.5"
            step="0.1"
            value={prefs.fontScale}
            onChange={(e) => change({ fontScale: Number(e.target.value) })}
          />
        </label>
        <label className="setting-row">
          <span>
            <strong>Giao diện</strong>
            <small>Chọn nền phù hợp với ánh sáng xung quanh.</small>
          </span>
          <select
            value={prefs.theme}
            onChange={(e) =>
              change({ theme: e.target.value as typeof prefs.theme })
            }
          >
            <option value="light">Sáng</option>
            <option value="dark">Tối</option>
            <option value="system">Theo thiết bị</option>
          </select>
        </label>
        <p className="settings-sample ja" lang="ja">
          春休み <span>はるやすみ</span>
        </p>
      </section>
      <section className="panel settings-panel">
        <h2>Giọng đọc tiếng Nhật</h2>
        {!voices.length && (
          <Notice>
            Thiết bị này chưa có giọng đọc tiếng Nhật. Bạn vẫn có thể học bằng
            Hiragana.
          </Notice>
        )}
        <label className="setting-row">
          <span>Giọng đọc</span>
          <select
            disabled={!voices.length}
            value={prefs.voiceURI}
            onChange={(e) => change({ voiceURI: e.target.value })}
          >
            <option value="">Tự chọn giọng Nhật</option>
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name}
              </option>
            ))}
          </select>
        </label>
        <label className="setting-row">
          <span>Tốc độ đọc · {prefs.rate}×</span>
          <input
            type="range"
            aria-label="Tốc độ đọc"
            min="0.5"
            max="1.2"
            step="0.05"
            value={prefs.rate}
            onChange={(e) => change({ rate: Number(e.target.value) })}
          />
        </label>
        <div className="button-row">
          <AudioButton text="はるやすみ" label="Nghe thử giọng Nhật" />
          <span>Nghe thử: 春休み（はるやすみ）</span>
        </div>
        <p className="muted small">
          Khả năng phát âm ngoại tuyến phụ thuộc giọng và thiết bị.
        </p>
      </section>
      <section className="panel settings-panel">
        <div className="small-heading">
          <h2>Sao lưu tiến độ</h2>
          <ShieldCheck size={26} />
        </div>
        <p>
          Tiến độ lưu trên trình duyệt này. Xóa dữ liệu trình duyệt hoặc đổi
          thiết bị có thể làm mất tiến độ nếu chưa sao lưu.
        </p>
        <div className="button-row">
          <button className="btn primary" onClick={download}>
            <DownloadSimple />
            Xuất dữ liệu
          </button>
          <label className="btn secondary file-upload">
            <UploadSimple />
            Nhập dữ liệu
            <input
              type="file"
              accept="application/json,.json"
              aria-label="Chọn bản sao lưu JSON"
              onChange={(e) => {
                void fileChanged(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        {pending && (
          <div className="import-preview">
            <h3>
              <CheckCircle />
              File hợp lệ
            </h3>
            <p>
              {pending.progress.length} bản ghi tiến độ ·{" "}
              {pending.attempts.length} phiên học
            </p>
            <p>
              Thay thế toàn bộ tiến độ hiện tại bằng bản này. Ứng dụng sẽ xuất
              bản sao lưu dữ liệu cũ trước khi thực hiện.
            </p>
            <div className="button-row">
              <button className="btn primary" disabled={busy} onClick={restore}>
                Xác nhận thay thế
              </button>
              <button
                className="btn secondary"
                disabled={busy}
                onClick={() => setPending(null)}
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </section>
      <section className="panel settings-panel danger-zone">
        <h2>Xóa dữ liệu học</h2>
        <p>
          Chỉ xóa trên trình duyệt này. Hành động không thể hoàn tác nếu chưa
          sao lưu.
        </p>
        {!deleteStep ? (
          <button className="btn danger" onClick={() => setDeleteStep(true)}>
            <Trash />
            Xóa dữ liệu học
          </button>
        ) : (
          <>
            <label className="answer-label" htmlFor="confirm-delete">
              Nhập XÓA để xác nhận lần hai
            </label>
            <input
              id="confirm-delete"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              autoComplete="off"
            />
            <div className="button-row">
              <button
                className="btn danger"
                disabled={confirmation !== "XÓA" || busy}
                onClick={remove}
              >
                Xác nhận xóa
              </button>
              <button
                className="btn secondary"
                onClick={() => {
                  setDeleteStep(false);
                  setConfirmation("");
                }}
              >
                Hủy
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
