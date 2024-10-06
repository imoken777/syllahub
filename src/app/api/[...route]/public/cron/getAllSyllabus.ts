import type { CreateCourseDto } from '@/types/course';
import { load } from 'cheerio';
import {
  assembleSyllabusLink,
  parseDayAndPeriod,
  parseInstructors,
  parseLanguageOptions,
  parseSemester,
  parseTypeOfConduction,
  parseYearOfStudy,
} from './parser';

const fetchSyllabusHtml = async (url: URL) =>
  await fetch(url.toString())
    .then((response) =>
      response.ok
        ? response.text()
        : Promise.reject(`Failed to fetch: ${url.toString()} - ${response.statusText}`),
    )
    .catch((error: unknown) => {
      throw new Error(`Failed to fetch: ${url.toString()} - ${error}`);
    });

const scrapeSyllabus = async (html: string): Promise<CreateCourseDto[]> => {
  const $ = load(html);

  const groupName = $('td.left b').text().trim();

  // テーブルの各行 (tr) をループしてすべての情報を取得
  const syllabusData = $('tbody tr')
    .toArray()
    .reduce<CreateCourseDto[]>((acc, row) => {
      const cells = $(row).children('td');

      const courseName = cells.eq(2).text().trim();
      if (courseName === '') return acc;

      const semesterRaw = cells.eq(1).text().trim();
      const instructors = cells
        .eq(3)
        .find('.item_text')
        .map((_, elem) => parseInstructors($(elem).text().trim()))
        .get();
      const dayAndPeriodRaw = cells.eq(4).text().trim();
      const typeOfConductionRaw = cells.eq(5).text().trim();
      const yearOfStudyRaw = cells.eq(6).text().trim();
      const languageOptionsRaw = cells.eq(7).text().trim();
      const syllabusLinkRaw = cells.eq(9).find('input[onclick]').attr('onclick');

      const semester = parseSemester(semesterRaw);
      const [day, period] = parseDayAndPeriod(dayAndPeriodRaw);
      const typeOfConduction = parseTypeOfConduction(typeOfConductionRaw);
      const yearOfStudy = parseYearOfStudy(yearOfStudyRaw);
      const languageOptions = parseLanguageOptions(languageOptionsRaw);
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

export const getAllSyllabus = async (): Promise<CreateCourseDto[]> => {
  // https://g-sys.toyo.ac.jp/syllabus/category/18596 から 29 ページ分のシラバスを取得
  const startPageId = 18596;
  const pageIds = Array.from({ length: 29 }, (_, i) => startPageId + i);
  const urls = pageIds.map((id) => new URL(`https://g-sys.toyo.ac.jp/syllabus/category/${id}`));

  const syllabusHtmls = await Promise.all(urls.map(fetchSyllabusHtml));
  const syllabusData = await Promise.all(syllabusHtmls.map((html) => scrapeSyllabus(html)));

  return syllabusData.flat();
};
