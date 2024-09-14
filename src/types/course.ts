export type Course = {
  courseName: string;
  semester: string;
  groupName: string;
  instructors: string[];
  languageOptions: string;
  typeOfConduction: string;
  yearOfStudy: {
    startYear: number;
    endYear: number;
  } | null;
  //   syllabusLink: URL | null;
  syllabusLink: string | null;
  day: string | null;
  period: string | null;
};
