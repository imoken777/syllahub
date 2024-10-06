import type {
  Day,
  LanguageOptions,
  Period,
  Semester,
  TypeOfConduction,
} from '@/types/searchOptions';
import {
  daySchema,
  languageOptionsSchema,
  periodSchema,
  semesterSchema,
  typeOfConductionSchema,
} from '@/types/searchOptions';

/**
 * 学期のテキストから日本語部分を抽出する関数
 *
 * 入力例: '春学期spring'
 * 出力例: '春学期'
 *
 * @param {string} text - 日本語と英語が含まれた学期のテキスト
 * @returns {Semester}  - 学期の日本語部分
 */
export const parseSemester = (text: string): Semester => {
  const japanese = text.replace(/[A-Za-z]/g, '');
  const semester = semesterSchema.parse(japanese);
  return semester;
};

/**
 * 指定されたテキストから日本語部分を抽出して返します。
 *
 * @param text - 解析するテキスト。
 * @returns 日本語の文字列。見つからない場合は空の文字列を返します。
 */
const japaneseRegex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\s]+/g;
export const parseInstructors = (text: string): string => {
  const matches = text.match(japaneseRegex);

  return matches ? matches[0].trim() : '';
};

/**
 * 曜日と時限のテキストからそれぞれの値を抽出する関数
 *
 * 入力例: '金,３限Fri,3rd'
 * 出力例: ['金', '3限']
 *
 * @param {string} text - 日本語と英語で書かれた曜日と時限の情報
 * @returns {[Day | null, Period | null]} - 曜日と時限を配列で返す [day, period]
 */
const dayPattern = /[月火水木金土日]/;
const periodPattern = /(\d+)/;
export const parseDayAndPeriod = (text: string): [Day | null, Period | null] => {
  const dayMatch = dayPattern.exec(text);
  const periodMatch = periodPattern.exec(text);

  const day = daySchema.safeParse(dayMatch?.[0]);
  const period = periodSchema.safeParse(`${periodMatch?.[1]}限`);

  return [day.data ?? null, period.data ?? null];
};

/**
 * 実施形態のテキストから日本語部分を抽出する関数
 *
 * 入力例: '非対面（オンデマンド）On-demand'
 * 出力例: '非対面（オンデマンド）'
 *
 * @param {string} text - 実施形態のテキスト
 * @returns {TypeOfConduction} - 実施形態の日本語部分
 */
const typeOfConductionPattern = /^[\u3000-\u9FFF\u3040-\u30FF（）ー]+/;
export const parseTypeOfConduction = (text: string): TypeOfConduction | null => {
  const match = typeOfConductionPattern.exec(text);
  const japanese = match ? match[0] : null;
  const typeOfConduction = typeOfConductionSchema.safeParse(japanese);
  return typeOfConduction.success ? typeOfConduction.data : null;
};

/**
 * 対象年次の範囲を解析する関数
 *
 * 入力例: '1〜4'
 * 出力例: { startYear: 1, endYear: 4 }
 *
 * @param {string} text - 範囲を表す年次のテキスト
 * @returns {{ startYear: number; endYear: number } | null} - 開始年次と終了年次のオブジェクト、もしくは範囲が不正な場合は null
 */
const yearOfStudyPattern = /(\d+)(?:〜(\d+))?/;
export const parseYearOfStudy = (text: string): { startYear: number; endYear: number } | null => {
  const match = yearOfStudyPattern.exec(text);

  if (match) {
    const startYear = parseInt(match[1], 10);
    const endYear = match[2] ? parseInt(match[2], 10) : startYear; // 範囲がない場合はstartYearと同じにする

    return {
      startYear,
      endYear,
    };
  }
  return null;
};

/**
 * 使用言語のテキストから日本語部分を抽出する関数
 *
 * 入力例: '日本語 / Japanese'
 * 出力例: '日本語'
 *
 * @param {string} text - 解析する元データ
 * @returns {LanguageOptions} - 使用言語の日本語部分 (日本語 | 英語 | 語学系科目)
 */
export const parseLanguageOptions = (text: string): LanguageOptions => {
  const japanese = text.split(/ /)[0].split('/')[0].trim();
  const languageOptions = languageOptionsSchema.parse(japanese);
  return languageOptions;
};

/**
 * シラバスのリンクを組み立てる関数
 *
 * 入力例: showSbs('2024','156008','SUS101', 'ja')
 * 出力例: URL('https://g-sys.toyo.ac.jp/syllabus/html/gakugai/2024/2024_156008.html?numbering=SUS101')
 *
 * @param {string | undefined} rawData - 正規表現で解析する元データ
 * @returns {string | null} - シラバスのリンクをstringで、もしくは解析できなかった場合は null
 */
const syllabusLinkPattern = /showSbs\('(\d+)',\s*'(\d+)',\s*'(\w+)',\s*'(\w+)'\)/;
export const assembleSyllabusLink = (rawData: string | undefined): string | null => {
  if (!rawData) return null;
  const match = syllabusLinkPattern.exec(rawData);
  if (match) {
    const [, year, code1, code2] = match;
    return `https://g-sys.toyo.ac.jp/syllabus/html/gakugai/${year}/${year}_${code1}.html?numbering=${code2}`;
  }
  return null;
};
