import fs from "node:fs";
import crypto from "node:crypto";
import { supplementContent } from "./supplement-content.mjs";
const source = fs
  .readFileSync("Kanji_N4_181_15_Bai_Giao_Trinh_Hoan_Chinh.md", "utf8")
  .replace(/\r/g, "");
const clean = (s) => s.replace(/\*\*/g, "").trim();
const rows = (s) =>
  s
    .split("\n")
    .filter((l) => l.startsWith("|"))
    .map((l) => l.split("|").slice(1, -1).map(clean));
const titles = [
  "Thời gian & Mùa",
  "Thiên nhiên",
  "Địa danh & Nơi chốn",
  "Màu sắc, Động vật & Ăn uống",
  "Cơ thể & Sức khỏe",
  "Gia đình & Con người",
  "Nhà & Công trình",
  "Di chuyển",
  "Học tập",
  "Ngôn ngữ & Tư duy",
  "Công việc & Kinh doanh",
  "Hành động hằng ngày",
  "Trạng thái & Tính từ",
  "Âm nhạc, Nghệ thuật & Đời sống",
  "Từ trừu tượng hay gặp",
];
const lessons = [],
  kanji = [],
  vocabulary = [],
  examples = [],
  questions = [],
  passages = [],
  conflicts = [];
function parseQuestions(block, regex, answers, prefix, lessonId) {
  return [...block.matchAll(regex)].map((m) => {
    const sourceId = m[1];
    const id = prefix + sourceId;
    const opts = [...m[3].matchAll(/\*\*([ABCD])\.\*\* ([^\n]+)/g)].map(
      (o) => ({ id: id + "-" + o[1], text: clean(o[2]) }),
    );
    const answer = answers.find(
      (a) => a[1] === sourceId || a[1] === sourceId.split(".").at(-1),
    );
    if (!answer) throw Error("Missing answer " + id);
    const raw = m[2];
    const stem = clean(raw);
    const skill = stem.includes("表記")
      ? "orthography"
      : stem.includes("意味")
        ? "meaning"
        : stem.includes("漢字の読み")
          ? "reading"
          : "context";
    const target = raw.match(/\*\*(.*?)\*\*/)?.[1]?.split("（")[0];
    return {
      id,
      lessonId,
      stem,
      options: opts,
      correctOptionId: id + "-" + answer[2],
      explanation: clean(answer[3]),
      skill,
      targetSurface: target ?? "",
      reviewStatus: "source-key-validated",
    };
  });
}
const blocks = [
  ...source.matchAll(
    /^# BÀI (\d+) .+?\n([\s\S]*?)(?=^# BÀI |^## KIỂM TRA|^# 5 BÀI|$(?![\s\S]))/gm,
  ),
];
for (const match of blocks) {
  const order = Number(match[1]),
    id = "lesson-" + String(order).padStart(2, "0"),
    body = match[2];
  const sections = body.split(/^### \d+\. .*\n/gm);
  const ks = rows(sections[1])
    .filter((r) => /^\d+$/.test(r[0]))
    .map((r) => ({
      id: "k-" + r[1],
      literal: r[1],
      hanViet: r[2],
      on: r[3],
      kun: r[4],
      meaning: r[5],
      lessonId: id,
    }));
  kanji.push(...ks);
  const vs = rows(sections[2])
    .filter((r) => ["★", "☆"].includes(r[0]))
    .map((r) => {
      const vid = "w-" + r[1] + "-" + r[2];
      const old = vocabulary.find((v) => v.id === vid);
      if (old) {
        old.lessonIds.push(id);
        old.priorities[id] = r[0];
        if (old.meaning !== r[3])
          conflicts.push({
            id: vid,
            kept: old.meaning,
            variant: r[3],
            lessonId: id,
          });
        old.meanings[id] = r[3];
        old.mnemonics[id] = r[4];
        return vid;
      }
      vocabulary.push({
        id: vid,
        surface: r[1],
        reading: r[2],
        meaning: r[3],
        mnemonic: r[4],
        priorities: { [id]: r[0] },
        meanings: { [id]: r[3] },
        mnemonics: { [id]: r[4] },
        lessonIds: [id],
        outside: [],
      });
      return vid;
    });
  const es = [
    ...sections[4].matchAll(
      /\d+\. \*\*(.*?)\*\*\s*\n\s*Đọc: (.*?)\s*\n\s*Nghĩa: (.*)/g,
    ),
  ].map((m, i) => ({
    id: `ex-${order}-${i + 1}`,
    lessonId: id,
    japanese: m[1],
    reading: m[2].trim(),
    meaning: m[3].trim(),
  }));
  examples.push(...es);
  const answers = [
    ...sections[5].matchAll(/- \*\*([\d.]+): ([ABCD])\*\* — (.*)/g),
  ];
  const qs = parseQuestions(
    sections[5],
    /\*\*Câu ([\d.]+)\.\*\* (.*?)\n([\s\S]*?)(?=\n\n)/g,
    answers,
    "q-",
    id,
  );
  questions.push(...qs);
  const tips = sections[3]
    .split("\n")
    .map(clean)
    .filter((l) => l.startsWith("- ") || l.startsWith("Nhóm đối chiếu"))
    .map((l) => l.replace(/^- /, ""));
  lessons.push({
    id,
    order,
    title: titles[order - 1],
    kanjiIds: ks.map((k) => k.id),
    vocabularyIds: vs,
    exampleIds: es.map((e) => e.id),
    questionIds: qs.map((q) => q.id),
    tips,
  });
}
for (const m of source.matchAll(
  /^## Đoạn (\d+) – (.*)\n([\s\S]*?)(?=^## Đoạn |^# BỔ SUNG)/gm,
)) {
  const body = m[3],
    id = "passage-" + m[1];
  const answers = [...body.matchAll(/- \*\*(\d+): ([ABCD])\*\* — (.*)/g)];
  const qs = parseQuestions(
    body,
    /\*\*Đọc ([\d.]+)\.\*\* (.*?)\n([\s\S]*?)(?=\n\n)/g,
    answers,
    "read-",
    id,
  );
  questions.push(...qs);
  passages.push({
    id,
    title: m[2],
    japanese: body.trim().split("\n")[0],
    reading: body.match(/\*\*Cách đọc \(Kana\):\*\* (.*)/)?.[1] ?? "",
    meaning: body.match(/\*\*Dịch nghĩa:\*\* (.*)/)?.[1] ?? "",
    questionIds: qs.map((q) => q.id),
  });
}
const extra = source.slice(
  source.indexOf("# BỔ SUNG"),
  source.indexOf("# LUYỆN THEO DẠNG"),
);
questions.push(
  ...parseQuestions(
    extra,
    /\*\*(M\.\d+)\.\*\* (.*?)\n([\s\S]*?)(?=\n\n)/g,
    [...extra.matchAll(/- \*\*(M\.\d+): ([ABCD])\*\* — (.*)/g)],
    "extra-",
    "extra",
  ),
);
const targets = new Set(kanji.map((k) => k.literal));
for (const v of vocabulary) {
  v.outside = [
    ...new Set(
      [...v.surface].filter(
        (c) => /\p{Script=Han}/u.test(c) && !targets.has(c),
      ),
    ),
  ];
  v.acceptedReadings = v.reading.split(/\s*[/／]\s*/);
}
for (const q of questions) {
  const surface =
    q.skill === "orthography"
      ? q.options.find((o) => o.id === q.correctOptionId)?.text
      : q.targetSurface;
  const word =
    vocabulary.find(
      (v) => v.surface === surface && v.lessonIds.includes(q.lessonId),
    ) ?? vocabulary.find((v) => v.surface === surface);
  q.wordId = word?.id ?? null;
  if (
    word &&
    q.skill === "reading" &&
    q.options.find((o) => o.id === q.correctOptionId)?.text !== word.reading
  )
    throw Error("Source reading mismatch: " + q.id);
}
fs.mkdirSync("src/data", { recursive: true });
fs.mkdirSync("docs", { recursive: true });
const content = {
  version: "1.0.0",
  sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
  lessons,
  kanji,
  vocabulary,
  examples,
  questions,
  passages,
};
supplementContent(content);
fs.writeFileSync(
  "src/data/content.json",
  JSON.stringify(content, null, 2) + "\n",
);
fs.writeFileSync(
  "docs/content-review.json",
  JSON.stringify(
    {
      source: "Kanji_N4_181_15_Bai_Giao_Trinh_Hoan_Chinh.md",
      policy:
        "Preserve original meanings per lesson; source answer keys, not official JLPT. Structural checks are not independent linguistic review.",
      meaningVariants: conflicts,
      excluded: [
        "Lịch học theo tuần",
        "Hướng dẫn StudyFlow",
        "Ba bài kiểm tra chặng (ngoài quiz 15 bài)",
      ],
    },
    null,
    2,
  ) + "\n",
);
console.log({
  lessons: lessons.length,
  kanji: kanji.length,
  vocabulary: vocabulary.length,
  examples: examples.length,
  questions: questions.length,
  passages: passages.length,
});
