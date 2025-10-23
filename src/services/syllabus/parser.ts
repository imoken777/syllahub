import type {
  Day,
  LanguageOptions,
  Period,
  Semester,
  TargetYearOptions,
  TypeOfConduction,
} from '@/types/searchOptions';
import {
  daySchema,
  languageOptionsSchema,
  periodSchema,
  semesterSchema,
  targetYearOptionsSchema,
  typeOfConductionSchema,
} from '@/types/searchOptions';
import * as v from 'valibot';

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
  const semester = v.parse(semesterSchema, japanese);
  return semester;
};

/**
 * 指定されたテキストから日本語部分を抽出して返します。
 *
 * @param text - 解析するテキスト。
 * @returns 日本語の文字列。見つからない場合は空の文字列を返します。
 */
export const parseInstructors = (text: string): string => {
  const japaneseRegex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\s]+/g;
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
export const parseDayAndPeriod = (text: string): [Day | null, Period | null] => {
  const dayPattern = /[月火水木金土日]/;
  const periodPattern = /(\d+)/;

  const dayMatch = dayPattern.exec(text);
  const periodMatch = periodPattern.exec(text);

  const day = v.safeParse(daySchema, dayMatch?.[0]);
  const period = v.safeParse(periodSchema, `${periodMatch?.[1]}限`);

  return [day.success ? day.output : null, period.success ? period.output : null];
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
export const parseTypeOfConduction = (text: string): TypeOfConduction | null => {
  const typeOfConductionPattern = /^[\u3000-\u9FFF\u3040-\u30FF（）ー]+/;

  const match = typeOfConductionPattern.exec(text);
  const japanese = match ? match[0] : null;
  const typeOfConduction = v.safeParse(typeOfConductionSchema, japanese);
  return typeOfConduction.success ? typeOfConduction.output : null;
};

/**
 * 対象年次の範囲を解析する関数
 *
 * 入力例: '1〜4'
 * 出力例: [1, 2, 3, 4]
 *
 * @param {string} text - 範囲を表す年次のテキスト
 * @returns {TargetYearOptions | null} - 対象年次の範囲, もしくは解析できなかった場合は null
 */
export const parseTargetYear = (text: string): TargetYearOptions | null => {
  const yearOfStudyPattern = /(\d+)(?:〜(\d+))?/;

  const match = yearOfStudyPattern.exec(text);

  if (match) {
    const startYear = parseInt(match[1], 10);
    const endYear = match[2] ? parseInt(match[2], 10) : startYear; // 範囲がない場合はstartYearと同じにする

    const yearsArray = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

    const targetYear = v.safeParse(targetYearOptionsSchema, yearsArray);
    return targetYear.success ? targetYear.output : null;
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
  const languageOptions = v.parse(languageOptionsSchema, japanese);
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
export const assembleSyllabusLink = (rawData: string | undefined): string | null => {
  const syllabusLinkPattern = /showSbs\('(\d+)',\s*'(\d+)',\s*'(\w+)',\s*'(\w+)'\)/;

  if (!rawData) return null;
  const match = syllabusLinkPattern.exec(rawData);
  if (match) {
    const [, year, code1, code2] = match;
    return `https://g-sys.toyo.ac.jp/syllabus/html/gakugai/${year}/${year}_${code1}.html?numbering=${code2}`;
  }
  return null;
};
