import fs from "node:fs";
import assert from "node:assert/strict";
import crypto from "node:crypto";
const d = JSON.parse(fs.readFileSync("src/data/content.json", "utf8"));
assert.equal(
  d.sourceHash,
  crypto
    .createHash("sha256")
    .update(
      fs
        .readFileSync("Kanji_N4_181_15_Bai_Giao_Trinh_Hoan_Chinh.md", "utf8")
        .replace(/\r/g, ""),
    )
    .digest("hex"),
  "Nguồn đã đổi: chạy npm run import:content",
);
assert.equal(d.lessons.length, 15);
assert.equal(d.kanji.length, 181);
assert.equal(new Set(d.kanji.map((k) => k.literal)).size, 181);
assert.equal(d.examples.length, 60);
assert.equal(d.passages.length, 5);
const expected = [13, 11, 12, 13, 13, 11, 11, 13, 12, 11, 13, 13, 14, 10, 11];
assert.equal(
  d.supplement.sourceHash,
  crypto
    .createHash("sha256")
    .update(fs.readFileSync(d.supplement.filename, "utf8").replace(/\r/g, ""))
    .digest("hex"),
  "Supplement changed: run npm run import:content",
);
assert.equal(d.supplement.entries.length, 262);
assert.equal(d.supplement.entries.filter((e) => e.isNew).length, 101);
assert.equal(d.vocabulary.length, 573);
assert.equal(new Set(d.supplement.entries.map((e) => e.wordId)).size, 262);
for (const e of d.supplement.entries) {
  const word = d.vocabulary.find((w) => w.id === e.wordId);
  assert(word && word.acceptedReadings.includes(e.reading), e.sourceId);
  assert(
    d.lessons.find((l) => l.id === e.lessonId).vocabularyIds.includes(word.id),
  );
  const qs = d.questions.filter((q) => q.id.startsWith(`q-sup-${e.sourceId}-`));
  assert.equal(qs.length, 2);
  for (const q of qs) {
    const correct = q.options.find((o) => o.id === q.correctOptionId);
    assert.equal(correct.text, q.skill === "reading" ? e.reading : e.surface);
    if (q.skill === "reading")
      assert.equal(
        q.options.filter((o) => word.acceptedReadings.includes(o.text)).length,
        1,
      );
  }
}
for (const group of [
  "lessons",
  "kanji",
  "vocabulary",
  "examples",
  "questions",
  "passages",
])
  assert.equal(
    new Set(d[group].map((x) => x.id)).size,
    d[group].length,
    group + " duplicate IDs",
  );
for (const [i, l] of d.lessons.entries()) {
  assert.equal(l.kanjiIds.length, expected[i]);
  assert.equal(l.questionIds.length, 8);
  assert.equal(l.exampleIds.length, 4);
  assert(l.vocabularyIds.length > 0);
  for (const [field, table] of [
    ["kanjiIds", "kanji"],
    ["vocabularyIds", "vocabulary"],
    ["exampleIds", "examples"],
    ["questionIds", "questions"],
  ])
    for (const id of l[field])
      assert(
        d[table].some((x) => x.id === id),
        id,
      );
}
for (const q of d.questions) {
  assert.equal(q.reviewStatus, "source-key-validated");
  assert.equal(q.options.length, 4, q.id);
  assert.equal(new Set(q.options.map((o) => o.text)).size, 4, q.id);
  assert.equal(q.options.filter((o) => o.id === q.correctOptionId).length, 1);
  assert(q.explanation.length > 0);
  if (q.wordId) assert(d.vocabulary.some((v) => v.id === q.wordId));
}
for (const p of d.passages) {
  assert.equal(p.questionIds.length, 3);
  assert(p.reading && p.meaning && p.japanese);
}
for (const v of d.vocabulary) {
  assert(v.surface && v.reading && v.meaning);
  for (const l of v.lessonIds) assert(d.lessons.some((x) => x.id === l));
}
console.log(
  `PASS: 15 bài · 181 Kanji · ${d.vocabulary.length} từ · ${d.questions.length} câu hỏi; liên kết, dữ liệu bổ sung và đáp án hợp lệ.`,
);
