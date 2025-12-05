import type { CreateCourseDto } from '@/types/course';
import { runWithConcurrencyLimit } from '@/utils/runWithConcurrencyLimit';
import { load } from 'cheerio';
import type { Result } from 'neverthrow';
import { err, ok } from 'neverthrow';
import {
  assembleSyllabusLink,
  parseDayAndPeriod,
  parseInstructors,
  parseLanguageOptions,
  parseSemester,
  parseTargetYear,
  parseTypeOfConduction,
} from './parser';

const fetchSyllabusHtml = async (url: URL): Promise<Result<string, string>> => {
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
    Connection: 'keep-alive',
  };

  try {
    const response = await fetch(url.toString(), { headers });
    if (!response.ok) {
      return err(`Failed to fetch: ${url.toString()} - ${response.statusText}`);
    }
    const text = await response.text();
    return ok(text);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return err(`Failed to fetch: ${url.toString()} - ${message}`);
  }
};

const scrapeSyllabus = (html: string): CreateCourseDto[] => {
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
      const targetYearRaw = cells.eq(6).text().trim();
      const languageOptionsRaw = cells.eq(7).text().trim();
      const syllabusLinkRaw = cells.eq(9).find('input[onclick]').attr('onclick');

      const semester = parseSemester(semesterRaw);
      const [day, period] = parseDayAndPeriod(dayAndPeriodRaw);
      const typeOfConduction = parseTypeOfConduction(typeOfConductionRaw);
      const targetYear = parseTargetYear(targetYearRaw);
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
          targetYear,
          languageOptions,
          syllabusLink,
        },
      ];
    }, []);

  return syllabusData;
};

export const getAllSyllabus = async (): Promise<Result<CreateCourseDto[], string>> => {
  // https://g-sys.toyo.ac.jp/syllabus/category/20740 から 最終ページまでのシラバスを取得
  const startPageId = 20740;
  const endPageId = 20764;
  const pageRange = endPageId - startPageId + 1;
  const pageIds = Array.from({ length: pageRange }, (_, i) => startPageId + i);
  const urls = pageIds.map((id) => new URL(`https://g-sys.toyo.ac.jp/syllabus/category/${id}`));

  const fetchTasks = urls.map((url) => () => fetchSyllabusHtml(url));
  const fetchResults = await runWithConcurrencyLimit(fetchTasks, 6);

  const successfulHtmls = fetchResults
    .map((result, i) =>
      result.match(
        (html) => html,
        (error) => {
          console.error(`Fetch failed for ${urls[i]}:`, error);
          return null;
        },
      ),
    )
    .filter((html): html is string => html !== null);

  try {
    const syllabusData = successfulHtmls.map((html) => scrapeSyllabus(html));
    return ok(syllabusData.flat());
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return err(`Failed to process syllabus data: ${message}`);
  }
};
