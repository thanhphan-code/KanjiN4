import fs from "node:fs";
import crypto from "node:crypto";

export function supplementContent(content) {
  const filename = "BO_SUNG_HOC_TU_VUNG_N4_262_TU_15_BAI_FE.md";
  const source = fs.readFileSync(filename, "utf8").replace(/\r/g, "");
  // Freeze the original achievement requirements before attaching extra words.
  content.masteryWordIds = Object.fromEntries(
    content.kanji.map((k) => {
      const related = content.vocabulary.filter(
        (w) =>
          w.lessonIds.includes(k.lessonId) && w.surface.includes(k.literal),
      );
      const core = related.filter((w) => w.priorities[k.lessonId] === "★");
      return [k.id, (core.length ? core : related).map((w) => w.id)];
    }),
  );
  const entries = [];
  let lessonId;
  for (const line of source.split("\n")) {
    const heading = line.match(/^### BÀI (\d+)/);
    if (heading) lessonId = "lesson-" + heading[1].padStart(2, "0");
    if (!/^\| V\d{3} \|/.test(line)) continue;
    const [
      sourceId,
      level,
      surface,
      hiragana,
      meaningVi,
      partOfSpeech,
      romaji,
    ] = line
      .split("|")
      .slice(1, -1)
      .map((s) => s.trim());
    if (entries.some((e) => e.sourceId === sourceId))
      throw Error("Duplicate source " + sourceId);
    const reading = surface === "お正月" ? "おしょうがつ" : hiragana;
    let word = content.vocabulary.find(
      (w) => w.surface === surface && w.acceptedReadings.includes(reading),
    );
    const isNew = !word;
    const extension =
      level.includes("☆") || ["時計", "電池", "火事"].includes(surface);
    const priority = extension ? "☆" : "★";
    if (!word) {
      word = {
        id: `w-${surface}-${reading}`,
        surface,
        reading,
        meaning: meaningVi,
        mnemonic: "",
        priorities: {},
        meanings: {},
        mnemonics: {},
        lessonIds: [],
        outside: [
          ...new Set(
            [...surface].filter(
              (c) =>
                /\p{Script=Han}/u.test(c) &&
                !content.kanji.some((k) => k.literal === c),
            ),
          ),
        ],
        acceptedReadings: [reading],
      };
      content.vocabulary.push(word);
    }
    if (!word.lessonIds.includes(lessonId)) {
      word.lessonIds.push(lessonId);
      word.priorities[lessonId] = priority;
      word.meanings[lessonId] = meaningVi;
      word.mnemonics[lessonId] = "";
    }
    const lesson = content.lessons.find((l) => l.id === lessonId);
    if (!lesson) throw Error("Missing lesson for " + sourceId);
    if (!lesson.vocabularyIds.includes(word.id))
      lesson.vocabularyIds.push(word.id);
    entries.push({
      sourceId,
      wordId: word.id,
      lessonId,
      isNew,
      extension,
      surface,
      hiragana,
      meaningVi,
      partOfSpeech,
      romaji,
      locale: "ja-JP",
      reading,
      correction:
        surface === "お正月"
          ? "Nguồn ghi しょうがつ; cách đọc có tiền tố お là おしょうがつ."
          : "",
    });
  }
  if (entries.length !== 262) throw Error("Expected 262 supplement entries");
  for (const entry of entries) {
    const word = content.vocabulary.find((w) => w.id === entry.wordId);
    for (const skill of ["reading", "orthography"]) {
      const answer = skill === "reading" ? entry.reading : entry.surface;
      const pool = [
        ...entries.filter((e) => e.lessonId === entry.lessonId),
        ...entries,
      ];
      const options = [answer];
      for (const other of pool) {
        if (
          other.wordId === entry.wordId ||
          word.acceptedReadings.includes(other.reading)
        )
          continue;
        const text = skill === "reading" ? other.reading : other.surface;
        if (!options.includes(text)) options.push(text);
        if (options.length === 4) break;
      }
      content.questions.push({
        id: `q-sup-${entry.sourceId}-${skill}`,
        lessonId: entry.lessonId,
        stem:
          skill === "reading"
            ? `Chọn cách đọc của「${entry.surface}」.`
            : `Chọn cách viết: ${entry.reading} — ${entry.meaningVi}`,
        options: options.map((text, i) => ({
          id: String.fromCharCode(65 + i),
          text,
        })),
        correctOptionId: "A",
        explanation: `${entry.surface}（${entry.reading}）: ${entry.meaningVi}.`,
        skill,
        targetSurface: entry.surface,
        reviewStatus: "source-key-validated",
        wordId: entry.wordId,
      });
    }
  }
  content.supplement = {
    revision: 1,
    filename,
    sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    entries,
  };
  fs.writeFileSync(
    "docs/supplement-review.json",
    JSON.stringify(
      {
        source: filename,
        total: entries.length,
        reused: entries.filter((e) => !e.isNew).length,
        added: entries.filter((e) => e.isNew).length,
        questions: entries.length * 2,
        policy:
          "Original IDs, glosses and achievement requirements preserved. Additive content retains compatible schema version 1.0.0. Generated quizzes use source vocabulary; draft example/context questions are not published.",
        corrections: entries.filter((e) => e.correction),
        correctionReference: "https://kotobank.jp/word/御正月-2016317",
        placements: entries.map(
          ({ sourceId, wordId, lessonId, isNew, extension }) => ({
            sourceId,
            wordId,
            lessonId,
            isNew,
            extension,
          }),
        ),
      },
      null,
      2,
    ) + "\n",
  );
}
