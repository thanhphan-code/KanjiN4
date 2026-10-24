import Dexie, { type EntityTable } from "dexie";
import { schedule, type Progress, type Skill } from "../domain/scheduler";
import {
  data,
  normalizeReading,
  questionById,
  wordById,
  learningWordsForKanji,
} from "../domain/content";
export type Mode =
  | "vocabulary"
  | "quiz"
  | "reading"
  | "meaning"
  | "orthography"
  | "context"
  | "flash"
  | "recall"
  | "listening"
  | "review";
export type Answer = { response: string; correct: boolean | null; at: number };
export type Attempt = {
  id: string;
  scope: string;
  mode: Mode;
  items: string[];
  optionOrders: Record<string, string[]>;
  skillOverrides: Record<string, Skill>;
  answers: Record<string, Answer>;
  draft: string;
  index: number;
  startedAt: number;
  completedAt: number | null;
  contentVersion: string;
};
export type Preferences = {
  furigana: boolean;
  fontScale: number;
  rate: number;
  theme: "light" | "dark" | "system";
  voiceURI: string;
};
export const defaults: Preferences = {
  furigana: true,
  fontScale: 1,
  rate: 0.85,
  theme: "light",
  voiceURI: "",
};
export type Meta = { id: string; value: unknown };
export const db = new Dexie("kanji-garden") as Dexie & {
  progress: EntityTable<Progress, "key">;
  attempts: EntityTable<Attempt, "id">;
  meta: EntityTable<Meta, "id">;
};
db.version(1).stores({
  progress: "key,itemId,skill,dueAt",
  attempts: "id,scope,completedAt",
  meta: "id",
});
export async function setMeta(id: string, value: unknown) {
  await db.meta.put({ id, value });
}
export function shuffled<T>(input: T[]): T[] {
  const out = [...input];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
export async function createAttempt(
  scope: string,
  mode: Mode,
  ids: string[],
  skillOverrides: Record<string, Skill> = {},
) {
  const itemIds = shuffled(ids);
  const attempt: Attempt = {
    id: crypto.randomUUID(),
    scope,
    mode,
    items: itemIds,
    optionOrders: Object.fromEntries(
      itemIds.map((id) => [
        id,
        shuffled(questionById(id)?.options.map((o) => o.id) ?? []),
      ]),
    ),
    skillOverrides: Object.fromEntries(
      Object.entries(skillOverrides).filter(([id]) => itemIds.includes(id)),
    ),
    answers: {},
    draft: "",
    index: 0,
    startedAt: Date.now(),
    completedAt: null,
    contentVersion: data.version,
  };
  await db.attempts.add(attempt);
  return attempt;
}
export async function submitAnswer(
  attemptId: string,
  response: string,
  skip = false,
  expectedItem?: string,
) {
  // One transaction: duplicate clicks/tabs cannot grade the same question twice.
  await db.transaction("rw", db.attempts, db.progress, async () => {
    const a = await db.attempts.get(attemptId);
    if (!a || a.completedAt) return;
    const id = a.items[a.index];
    if (a.answers[id] || (expectedItem && expectedItem !== id)) return;
    const q = questionById(id),
      word = wordById(id);
    const correct = skip
      ? null
      : word
        ? word.acceptedReadings.some(
            (reading) =>
              normalizeReading(response) === normalizeReading(reading),
          )
        : q
          ? response === q.correctOptionId
          : false;
    const answer = { response, correct, at: Date.now() };
    await db.attempts.update(a.id, {
      answers: { ...a.answers, [id]: answer },
      draft: "",
    });
    if (correct !== null) {
      const skill =
        a.skillOverrides?.[id] ??
        ((a.mode === "listening"
          ? "listening"
          : word
            ? "reading"
            : (q?.skill ?? "context")) as Skill);
      const itemId = word?.id ?? q?.wordId ?? id;
      const prev = await db.progress.get(`${itemId}|${skill}`);
      await db.progress.put(schedule(prev, itemId, skill, correct, answer.at));
    }
  });
}
export async function advanceAttempt(id: string, expectedIndex?: number) {
  await db.transaction("rw", db.attempts, async () => {
    const a = await db.attempts.get(id);
    if (
      !a ||
      a.completedAt ||
      !a.answers[a.items[a.index]] ||
      (expectedIndex !== undefined && expectedIndex !== a.index)
    )
      return;
    if (a.index === a.items.length - 1)
      await db.attempts.update(id, { completedAt: Date.now() });
    else await db.attempts.update(id, { index: a.index + 1, draft: "" });
  });
}
export function reviewPlan(progress: Progress[]) {
  const overrides: Record<string, Skill> = {};
  const ids = progress
    .filter((p) => p.status === "learning" || p.dueAt <= Date.now())
    .sort((a, b) => b.wrong - a.wrong || a.dueAt - b.dueAt)
    .map((p) => {
      const question = questionById(p.itemId);
      const id = question
        ? question.id
        : p.skill === "reading"
          ? p.itemId
          : data.questions.find(
              (q) =>
                q.wordId === p.itemId &&
                q.skill === (p.skill === "listening" ? "orthography" : p.skill),
            )?.id;
      if (id) overrides[id] = p.skill;
      return id;
    })
    .filter((id): id is string => !!id);
  return { ids: [...new Set(ids)], overrides };
}
export function masteredKanji(progress: Progress[]) {
  // A conservative policy: every core vocabulary item containing the target must
  // have spaced reading evidence; browsing or one correct answer never counts.
  return data.kanji.filter((k) => {
    const words = learningWordsForKanji(k);
    return (
      words.length > 0 &&
      words.every((w) =>
        progress.some(
          (p) =>
            p.itemId === w.id &&
            p.skill === "reading" &&
            p.status === "mastered",
        ),
      )
    );
  });
}
