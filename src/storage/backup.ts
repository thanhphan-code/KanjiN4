import { z } from "zod";
import { db, defaults, type Attempt, type Meta } from "./db";
import { data, normalizeReading } from "../domain/content";
const knownItems = new Set(
  [...data.vocabulary, ...data.questions].map((x) => x.id),
);
const knownScopes = new Set(
  [...data.lessons, ...data.passages]
    .map((x) => x.id)
    .concat(["review", "extra"]),
);
const id = z
  .string()
  .refine((s) => knownItems.has(s), "ID nội dung không tồn tại");
const time = z.number().finite().nonnegative();
const count = z.number().int().nonnegative();
const skill = z.enum([
  "reading",
  "meaning",
  "orthography",
  "context",
  "listening",
  "matching",
]);
const learningMeta = z
  .object({
    id: z.string(),
    value: z.union([z.string(), z.number().int().nonnegative(), z.boolean()]),
  })
  .refine((m) => {
    if (m.id === "lastLesson")
      return data.lessons.some((l) => l.id === m.value);
    const lesson = data.lessons.find(
      (l) => m.id === "seen-" + l.id || m.id === "cursor-" + l.id,
    );
    return (
      !!lesson &&
      (m.id.startsWith("seen-")
        ? typeof m.value === "boolean"
        : typeof m.value === "number" && m.value < lesson.kanjiIds.length)
    );
  });
const preferences = z.object({
  furigana: z.boolean(),
  fontScale: z.number().min(0.9).max(1.5),
  rate: z.number().min(0.5).max(1.2),
  theme: z.enum(["light", "dark", "system"]),
  voiceURI: z.string().max(1000),
});
const progress = z
  .object({
    key: z.string(),
    itemId: id,
    skill: z.enum([
      "reading",
      "meaning",
      "orthography",
      "context",
      "listening",
      "matching",
    ]),
    correct: count,
    wrong: count,
    streak: count,
    distinct: count,
    lastValidAt: time,
    lastAt: time,
    dueAt: time,
    interval: z.number().min(0).max(30),
    status: z.enum(["learning", "reviewing", "mastered"]),
  })
  .refine((p) => p.key === `${p.itemId}|${p.skill}`);
const attempt = z
  .object({
    id: z.string().uuid(),
    scope: z.string().refine((s) => knownScopes.has(s)),
    mode: z.enum([
      "vocabulary",
      "quiz",
      "reading",
      "meaning",
      "orthography",
      "context",
      "flash",
      "recall",
      "listening",
      "review",
    ]),
    items: z.array(id).min(1).max(2000),
    skillOverrides: z.record(z.string(), skill).default({}),
    optionOrders: z.record(z.string(), z.array(z.string())),
    answers: z.record(
      z.string(),
      z.object({
        response: z.string().max(2000),
        correct: z.boolean().nullable(),
        at: time,
      }),
    ),
    draft: z.string().max(2000),
    index: count,
    startedAt: time,
    completedAt: time.nullable(),
    contentVersion: z.literal(data.version),
  })
  .superRefine((a, ctx) => {
    const fail = () =>
      ctx.addIssue({
        code: "custom",
        message: "Phiên học hoặc đáp án không hợp lệ",
      });
    if (a.index >= a.items.length || new Set(a.items).size !== a.items.length)
      fail();
    for (const item of a.items) {
      const q = data.questions.find((q) => q.id === item);
      if (
        q &&
        (a.optionOrders[item]?.length !== 4 ||
          new Set(a.optionOrders[item]).size !== 4 ||
          a.optionOrders[item].some((o) => !q.options.some((x) => x.id === o)))
      )
        fail();
    }
    if (Object.keys(a.answers).some((k) => !a.items.includes(k))) fail();
    if (Object.keys(a.skillOverrides).some((k) => !a.items.includes(k))) fail();
    if (a.completedAt && a.items.some((item) => !a.answers[item])) fail();
    if (a.items.slice(0, a.index).some((item) => !a.answers[item])) fail();
    if (a.items.slice(a.index + 1).some((item) => a.answers[item])) fail();
    for (const [item, answer] of Object.entries(a.answers)) {
      const q = data.questions.find((q) => q.id === item);
      const word = data.vocabulary.find((w) => w.id === item);
      if (answer.correct !== null) {
        if (q && !q.options.some((o) => o.id === answer.response)) fail();
        const correct = q
          ? q.correctOptionId === answer.response
          : word?.acceptedReadings.some(
              (r) => normalizeReading(r) === normalizeReading(answer.response),
            );
        if (answer.correct !== correct) fail();
      }
    }
  });
export const backupSchema = z
  .object({
    schemaVersion: z.literal(1),
    contentVersion: z.literal(data.version),
    exportedAt: time,
    progress: z.array(progress).max(10000),
    attempts: z.array(attempt).max(10000),
    preferences,
    learningMeta: z.array(learningMeta).max(31).default([]),
  })
  .superRefine((b, ctx) => {
    if (
      new Set(b.progress.map((p) => p.key)).size !== b.progress.length ||
      new Set(b.attempts.map((a) => a.id)).size !== b.attempts.length ||
      new Set(b.learningMeta.map((m) => m.id)).size !== b.learningMeta.length
    )
      ctx.addIssue({ code: "custom", message: "Bản sao lưu chứa ID trùng" });
  });
export type Backup = z.infer<typeof backupSchema>;
export async function exportBackup() {
  const result = await db.transaction(
    "r",
    db.progress,
    db.attempts,
    db.meta,
    async () => ({
      schemaVersion: 1,
      contentVersion: data.version,
      exportedAt: Date.now(),
      progress: await db.progress.toArray(),
      attempts: await db.attempts.toArray(),
      preferences: (await db.meta.get("preferences"))?.value ?? defaults,
      learningMeta: (await db.meta.toArray()).filter(
        (m) => m.id !== "preferences",
      ),
    }),
  );
  const blob = new Blob([JSON.stringify(result, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kanji-garden-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function replaceBackup(backup: Backup) {
  const b = backupSchema.parse(backup);
  await db.transaction("rw", db.progress, db.attempts, db.meta, async () => {
    await db.progress.clear();
    await db.attempts.clear();
    await db.meta.clear();
    await db.progress.bulkPut(b.progress);
    await db.attempts.bulkPut(b.attempts as Attempt[]);
    await db.meta.put({ id: "preferences", value: b.preferences } as Meta);
    await db.meta.bulkPut(b.learningMeta);
  });
}
