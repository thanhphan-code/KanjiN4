import contentSource from "../data/content.json?raw";
export type Lesson = {
  id: string;
  order: number;
  title: string;
  kanjiIds: string[];
  vocabularyIds: string[];
  exampleIds: string[];
  questionIds: string[];
  tips: string[];
};
export type Word = {
  id: string;
  surface: string;
  reading: string;
  meaning: string;
  mnemonic: string;
  priorities: Record<string, string>;
  meanings: Record<string, string>;
  mnemonics: Record<string, string>;
  lessonIds: string[];
  outside: string[];
  acceptedReadings: string[];
};
export type Kanji = {
  id: string;
  literal: string;
  hanViet: string;
  on: string;
  kun: string;
  meaning: string;
  lessonId: string;
};
export type Question = {
  id: string;
  lessonId: string;
  stem: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  skill: string;
  targetSurface: string;
  reviewStatus: string;
  wordId: string | null;
};
type Content = {
  version: string;
  sourceHash: string;
  examples: {
    id: string;
    lessonId: string;
    japanese: string;
    reading: string;
    meaning: string;
  }[];
  passages: {
    id: string;
    title: string;
    japanese: string;
    reading: string;
    meaning: string;
    questionIds: string[];
  }[];
  supplement: {
    revision: number;
    filename: string;
    sourceHash: string;
    entries: {
      sourceId: string;
      wordId: string;
      lessonId: string;
      isNew: boolean;
      extension: boolean;
      surface: string;
      hiragana: string;
      meaningVi: string;
      partOfSpeech: string;
      romaji: string;
      locale: string;
      reading: string;
      correction: string;
    }[];
  };
  lessons: Lesson[];
  vocabulary: Word[];
  kanji: Kanji[];
  questions: Question[];
  masteryWordIds: Record<string, string[]>;
};
// The importer and validator enforce this contract before every production build.
export const data = JSON.parse(contentSource) as Content;
export const lessonById = (id: string) => data.lessons.find((l) => l.id === id);
export const wordById = (id: string) =>
  data.vocabulary.find((w) => w.id === id);
export const kanjiById = (id: string) => data.kanji.find((k) => k.id === id);
export function learningWordsForKanji(kanji: Kanji) {
  const ids = (data.masteryWordIds as Record<string, string[]>)[kanji.id] ?? [];
  return ids.map((id) => wordById(id)!).filter(Boolean);
}
export const supplementForWord = (id: string) =>
  data.supplement.entries.find((e) => e.wordId === id);
export const questionById = (id: string) =>
  data.questions.find((q) => q.id === id);
export function priority(word: Word, lessonId: string) {
  return (
    (word.priorities as Record<string, string | undefined>)[lessonId] ?? "☆"
  );
}
export function meaning(word: Word, lessonId?: string) {
  return (
    (word.meanings as Record<string, string | undefined>)[lessonId ?? ""] ??
    word.meaning
  );
}
export function normalizeReading(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .replace(/\s/g, "")
    .replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}
export function normalizeSearch(value: string) {
  return normalizeReading(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d");
}
export const skillLabels: Record<string, string> = {
  reading: "Cách đọc",
  meaning: "Hiểu nghĩa",
  orthography: "Nhận diện chữ",
  context: "Dùng trong câu",
  listening: "Nghe hiểu",
  matching: "Ghép cặp",
};
