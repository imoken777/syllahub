import type {
  Day,
  LanguageOptions,
  Period,
  Semester,
  TargetYearOptions,
  TypeOfConduction,
} from './searchOptions';

export type CreateCourseDto = {
  courseName: string;
  semester: Semester;
  groupName: string;
  instructors: string[];
  languageOptions: LanguageOptions;
  typeOfConduction: TypeOfConduction | null;
  targetYear: TargetYearOptions | null;
  //   syllabusLink: URL | null;
  syllabusLink: string | null;
  day: Day | null;
  period: Period | null;
};

export type CourseModel = CreateCourseDto & { courseId: number };
