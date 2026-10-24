import { describe, it, expect } from "vitest";
import { schedule, DAY } from "../domain/scheduler";
import {
  data,
  normalizeReading,
  normalizeSearch,
  learningWordsForKanji,
} from "../domain/content";
import { masteredKanji } from "../storage/db";
describe("Đánh giá cách đọc", () => {
  it("chuẩn hóa Unicode/kana, giữ trường âm và âm đục", () => {
    expect(normalizeReading(" ビョウイン ")).toBe("びょういん");
    expect(normalizeReading("ﾋﾞｮｳｲﾝ")).toBe("びょういん");
    expect(normalizeReading("びょういん")).not.toBe(
      normalizeReading("びょいん"),
    );
    expect(normalizeReading("か")).not.toBe(normalizeReading("が"));
  });
  it("tìm tiếng Việt không dấu và Katakana", () => {
    expect(normalizeSearch("BỆNH VIỆN")).toBe("benhvien");
    expect(normalizeSearch("ビョウイン")).toBe(normalizeSearch("びょういん"));
  });
});
describe("Ôn cách quãng", () => {
  const now = 1700000000000;
  it("cả 181 chữ đều có từ nguồn để luyện và có thể đạt mastery", () => {
    for (const k of data.kanji)
      expect(learningWordsForKanji(k).length, k.literal).toBeGreaterThan(0);
    const progress = data.vocabulary.map((word) => {
      let p = schedule(undefined, word.id, "reading", true, now);
      p = schedule(p, word.id, "reading", true, now + DAY);
      return schedule(p, word.id, "reading", true, now + DAY * 2);
    });
    expect(masteredKanji(progress)).toHaveLength(181);
  });
  it("một lần đúng chưa được mastered", () => {
    expect(schedule(undefined, "w", "reading", true, now).status).toBe(
      "reviewing",
    );
  });
  it("luyện lặp cùng buổi không tăng interval hay mastery", () => {
    let p = schedule(undefined, "w", "reading", true, now);
    for (let i = 1; i <= 10; i++)
      p = schedule(p, "w", "reading", true, now + i * 1000);
    expect(p.interval).toBe(1);
    expect(p.distinct).toBe(1);
    expect(p.status).toBe("reviewing");
    expect(p.dueAt).toBe(now + DAY);
  });
  it("mastery cần ít nhất ba lần đúng ở hai thời điểm tách biệt", () => {
    let p = schedule(undefined, "w", "reading", true, now);
    p = schedule(p, "w", "reading", true, now + 1000);
    p = schedule(p, "w", "reading", true, now + DAY);
    expect(p.status).toBe("mastered");
    expect(p.interval).toBe(3);
    p = schedule(p, "w", "reading", false, now + DAY + 1000);
    expect(p.status).toBe("learning");
    expect(p.streak).toBe(0);
    expect(p.distinct).toBe(0);
    expect(p.wrong).toBe(1);
  });
  it("ghép cặp không tính mastery, thống kê mới bằng 0", () => {
    let p = schedule(undefined, "w", "matching", true, now);
    p = schedule(p, "w", "matching", true, now + DAY);
    p = schedule(p, "w", "matching", true, now + DAY * 2);
    expect(p.status).not.toBe("mastered");
    expect(masteredKanji([])).toHaveLength(0);
  });
  it("không tính Kanji mở rộng hoặc học một từ thành cả chữ", () => {
    const word = data.vocabulary.find((w) => w.surface === "春休み")!;
    let p = schedule(undefined, word.id, "reading", true, now);
    p = schedule(p, word.id, "reading", true, now + DAY);
    p = schedule(p, word.id, "reading", true, now + DAY * 2);
    const mastered = masteredKanji([p]);
    expect(mastered.map((k) => k.literal)).toContain("春");
    expect(mastered.map((k) => k.literal)).not.toContain("休");
  });
});
