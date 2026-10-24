import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import {
  createAttempt,
  db,
  submitAnswer,
  advanceAttempt,
  defaults,
  reviewPlan,
} from "../storage/db";
import { data } from "../domain/content";
import { backupSchema, replaceBackup } from "../storage/backup";
beforeEach(async () => {
  await db.progress.clear();
  await db.attempts.clear();
  await db.meta.clear();
});
describe("Lưu phiên và chấm bài", () => {
  it("quiz bổ sung cập nhật cùng tiến độ từ cũ và có thể sao lưu", async () => {
    const entry = data.supplement.entries.find((e) => !e.isNew)!;
    const q = data.questions.find(
      (q) => q.id === `q-sup-${entry.sourceId}-reading`,
    )!;
    const a = await createAttempt(q.lessonId, "vocabulary", [q.id]);
    await submitAnswer(a.id, q.correctOptionId);
    const progress = await db.progress.toArray();
    expect(progress).toHaveLength(1);
    expect(progress[0].itemId).toBe(entry.wordId);
    const backup = backupSchema.safeParse({
      schemaVersion: 1,
      contentVersion: "1.0.0",
      exportedAt: Date.now(),
      progress,
      attempts: await db.attempts.toArray(),
      preferences: defaults,
    });
    expect(backup.success).toBe(true);
    expect(
      data.kanji.every((k) =>
        data.masteryWordIds[k.id].every(
          (id) =>
            !data.supplement.entries.some((e) => e.isNew && e.wordId === id),
        ),
      ),
    ).toBe(true);
  });
  it("chấp nhận cả hai cách đọc được nguồn cung cấp cho 開く", async () => {
    const word = data.vocabulary.find((w) => w.surface === "開く")!;
    for (const reading of ["あく", "ひらく"]) {
      const a = await createAttempt(word.lessonIds[0], "recall", [word.id]);
      await submitAnswer(a.id, reading);
      expect((await db.attempts.get(a.id))?.answers[word.id].correct).toBe(
        true,
      );
    }
  });
  it("ôn đúng kỹ năng nghĩa bị sai, không để hàng đợi mắc kẹt", async () => {
    const q = data.questions.find((q) => q.wordId && q.skill === "meaning")!;
    const a = await createAttempt(q.lessonId, "meaning", [q.id]);
    await submitAnswer(a.id, "wrong");
    const plan = reviewPlan(await db.progress.toArray());
    const b = await createAttempt("review", "review", plan.ids, plan.overrides);
    await submitAnswer(b.id, q.correctOptionId);
    expect((await db.progress.toArray())[0].status).toBe("reviewing");
    expect((await db.progress.toArray())[0].skill).toBe("meaning");
  });
  it("ghi kết quả và scheduler nguyên tử, không chấm trùng khi bấm hai lần", async () => {
    const q = data.questions[0];
    const a = await createAttempt(q.lessonId, "quiz", [q.id]);
    await Promise.all([
      submitAnswer(a.id, q.correctOptionId),
      submitAnswer(a.id, q.correctOptionId),
    ]);
    expect((await db.progress.toArray())[0].correct).toBe(1);
    expect((await db.attempts.get(a.id))?.answers[q.id].correct).toBe(true);
    await advanceAttempt(a.id);
    expect((await db.attempts.get(a.id))?.completedAt).not.toBeNull();
    await submitAnswer(
      a.id,
      q.options.find((o) => o.id !== q.correctOptionId)!.id,
    );
    expect((await db.progress.toArray())[0].wrong).toBe(0);
  });
  it("bỏ qua không tạo bằng chứng nhớ", async () => {
    const q = data.questions[0];
    const a = await createAttempt(q.lessonId, "quiz", [q.id]);
    await submitAnswer(a.id, "", true);
    expect(await db.progress.count()).toBe(0);
    expect((await db.attempts.get(a.id))?.answers[q.id].correct).toBeNull();
  });
  it("sai đưa vào learning, dùng chung tiến độ từ giữa các bài", async () => {
    const q = data.questions[0];
    const a = await createAttempt(q.lessonId, "reading", [q.id]);
    await submitAnswer(
      a.id,
      q.options.find((o) => o.id !== q.correctOptionId)!.id,
    );
    const rows = await db.progress.toArray();
    expect(rows[0].status).toBe("learning");
    expect(rows[0].itemId).toBe(q.wordId);
  });
  it("giữ nguyên câu, thứ tự đáp án và bản nháp khi đọc lại DB", async () => {
    const a = await createAttempt(
      "lesson-01",
      "quiz",
      data.lessons[0].questionIds,
    );
    await db.attempts.update(a.id, { draft: "q-01.01-A" });
    const restored = await db.attempts.get(a.id);
    expect(restored?.items).toEqual(a.items);
    expect(restored?.optionOrders).toEqual(a.optionOrders);
    expect(restored?.draft).toBe("q-01.01-A");
  });
});
describe("Backup schema", () => {
  const empty = {
    schemaVersion: 1,
    contentVersion: data.version,
    exportedAt: Date.now(),
    progress: [],
    attempts: [],
    preferences: defaults,
  };
  it("chặn phiên bản lạ và ID giả", async () => {
    expect(
      backupSchema.safeParse({ ...empty, schemaVersion: 99 }).success,
    ).toBe(false);
    const a = await createAttempt("lesson-01", "quiz", ["q-01.01"]);
    expect(
      backupSchema.safeParse({
        ...empty,
        attempts: [{ ...a, items: ["unknown"] }],
      }).success,
    ).toBe(false);
  });
  it("vòng kín backup và restore không làm mất câu trả lời", async () => {
    const q = data.questions[0],
      a = await createAttempt("lesson-01", "quiz", [q.id]);
    await submitAnswer(a.id, q.correctOptionId);
    const backup = backupSchema.parse({
      ...empty,
      attempts: await db.attempts.toArray(),
      progress: await db.progress.toArray(),
    });
    await db.attempts.clear();
    await db.progress.clear();
    await replaceBackup(backup);
    expect((await db.attempts.get(a.id))?.answers[q.id].correct).toBe(true);
    expect(await db.progress.count()).toBe(1);
  });
});
