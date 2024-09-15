import type { Course } from '@/types/course';
import { load } from 'cheerio';
import { assembleSyllabusLink, parseDayAndPeriod, parseSemester, parseYearOfStudy } from './parser';

export const fetchSyllabusHtml = async (url: URL) =>
  await fetch(url.toString())
    .then((response) =>
      response.ok
        ? response.text()
        : Promise.reject(`Failed to fetch: ${url.toString()} - ${response.statusText}`),
    )
    .catch((error: unknown) => {
      throw new Error(`Failed to fetch: ${url.toString()} - ${error}`);
    });

const scrapeSyllabus = async (html: string) => {
  const $ = load(html);

  const groupName = $('td.left b').text().trim();

  // テーブルの各行 (tr) をループしてすべての情報を取得
  const syllabusData = $('tbody tr')
    .toArray()
    .reduce<Course[]>((acc, row) => {
      const courseName = $(row)
        .find('td[data-th="授業科目名 / Course Name"] .data_content')
        .text()
        .trim();
      if (courseName === '') return acc;

      const semesterRaw = $(row)
        .find('td[data-th="開講学期 / Semester"] .data_content')
        .text()
        .trim();
      const instructors = $(row)
        .find('td[data-th="教員名 / Instructor"] .item_text')
        .map((_, elem) => $(elem).text().trim())
        .get();
      const dayAndPeriodRaw = $(row)
        .find('td[data-th="曜日・時限 / Day of the week, period"] .data_content')
        .text()
        .trim();
      const typeOfConduction = $(row)
        .find('td[data-th="実施形態 / Type of Conduction"] .data_content')
        .text()
        .trim();
      const yearOfStudyRaw = $(row)
        .find('td[data-th="対象年次 / Year of Study"] .data_content')
        .text()
        .trim();
      const languageOptions = $(row)
        .find('td[data-th="主たる使用言語 / Language options"] .data_content')
        .text()
        .trim();
      const syllabusLinkRaw = $(row)
        .find('td[data-th="シラバス表示 / Syllabus"] input[onclick]')
        .attr('onclick');

      const semester = parseSemester(semesterRaw);
      const [day, period] = parseDayAndPeriod(dayAndPeriodRaw);
      const yearOfStudy = parseYearOfStudy(yearOfStudyRaw);
      const syllabusLink = assembleSyllabusLink(syllabusLinkRaw);

      return [
        ...acc,
        {
          semester,
          courseName,
          groupName,
          instructors,
          day,
          period,
          typeOfConduction,
          yearOfStudy,
          languageOptions,
          syllabusLink,
        },
      ];
    }, []);

  return syllabusData;
};

export const getAllSyllabus = async () => {
  // https://g-sys.toyo.ac.jp/syllabus/category/18596 から 29 ページ分のシラバスを取得
  const startPageId = 18596;
  const pageIds = Array.from({ length: 29 }, (_, i) => startPageId + i);
  const urls = pageIds.map((id) => new URL(`https://g-sys.toyo.ac.jp/syllabus/category/${id}`));

  const syllabusHtmls = await Promise.all(urls.map(fetchSyllabusHtml));
  const syllabusData = await Promise.all(syllabusHtmls.map((html) => scrapeSyllabus(html)));

  return syllabusData.flat();
};
