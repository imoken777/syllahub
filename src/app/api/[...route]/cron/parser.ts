/**
 * 学期のテキストから日本語部分を抽出する関数
 *
 * 入力例: '春学期spring'
 * 出力例: '春学期'
 *
 * @param {string} text - 日本語と英語が含まれた学期のテキスト
 * @returns {string} - 学期の日本語部分
 */
export const parseSemester = (text: string): string => {
  const [japanese] = text.split(/(?=[A-Za-z])/);
  return japanese.trim();
};

/**
 * 曜日と時限のテキストからそれぞれの値を抽出する関数
 *
 * 入力例: '金,３限Fri,3rd'
 * 出力例: ['金', '3']
 *
 * @param {string} text - 日本語と英語で書かれた曜日と時限の情報
 * @returns {[string | null, string | null]} - 曜日と時限を配列で返す [day, period]
 */
export const parseDayAndPeriod = (text: string): [string | null, string | null] => {
  const match = text.match(/(.+),.+限.+,(\d+)/);
  return [match?.[1] ?? null, match?.[2] ?? null];
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
export const parseYearOfStudy = (text: string): { startYear: number; endYear: number } | null => {
  const match = text.match(/(\d+)(?:〜(\d+))?/);

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
 * シラバスのリンクを組み立てる関数
 *
 * 入力例: showSbs('2024','156008','SUS101', 'ja')
 * 出力例: URL('https://g-sys.toyo.ac.jp/syllabus/html/gakugai/2024/2024_156008.html?numbering=SUS101')
 *
 * @param {string | undefined} rawData - 正規表現で解析する元データ
 * @returns {string | null} - シラバスのリンクをstringで、もしくは解析できなかった場合は null
 */
export const assembleSyllabusLink = (rawData: string | undefined): string | null => {
  if (!rawData) return null;
  const match = rawData.match(/showSbs\('(\d+)',\s*'(\d+)',\s*'(\w+)',\s*'(\w+)'\)/);
  if (match) {
    const [, year, code1, code2] = match;
    // return new URL(
    //   `https://g-sys.toyo.ac.jp/syllabus/html/gakugai/${year}/${year}_${code1}.html?numbering=${code2}`,
    // );
    return `https://g-sys.toyo.ac.jp/syllabus/html/gakugai/${year}/${year}_${code1}.html?numbering=${code2}`;
  }
  return null;
};
