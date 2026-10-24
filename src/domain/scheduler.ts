export type Skill =
  "reading" | "meaning" | "orthography" | "context" | "listening" | "matching";
export type Progress = {
  key: string;
  itemId: string;
  skill: Skill;
  correct: number;
  wrong: number;
  streak: number;
  distinct: number;
  lastValidAt: number;
  lastAt: number;
  dueAt: number;
  interval: number;
  status: "learning" | "reviewing" | "mastered";
};
export const DAY = 86400000;
export function schedule(
  previous: Progress | undefined,
  itemId: string,
  skill: Skill,
  correct: boolean,
  now = Date.now(),
): Progress {
  const p: Progress = previous ?? {
    key: `${itemId}|${skill}`,
    itemId,
    skill,
    correct: 0,
    wrong: 0,
    streak: 0,
    distinct: 0,
    lastValidAt: 0,
    lastAt: 0,
    dueAt: now,
    interval: 0,
    status: "learning",
  };
  if (!correct)
    return {
      ...p,
      wrong: p.wrong + 1,
      streak: 0,
      distinct: 0,
      lastValidAt: 0,
      interval: 0,
      status: "learning",
      lastAt: now,
      dueAt: now + 5 * 60000,
    };
  const separated = p.lastValidAt === 0 || now - p.lastValidAt >= DAY;
  const distinct = p.distinct + (separated ? 1 : 0);
  const interval = separated
    ? [1, 3, 7, 14, 30][Math.min(distinct - 1, 4)]
    : p.interval;
  const streak = p.streak + 1;
  return {
    ...p,
    correct: p.correct + 1,
    streak,
    distinct,
    interval,
    lastValidAt: separated ? now : p.lastValidAt,
    lastAt: now,
    dueAt: separated ? now + interval * DAY : p.dueAt,
    status:
      streak >= 3 && distinct >= 2 && skill !== "matching"
        ? "mastered"
        : "reviewing",
  };
}
