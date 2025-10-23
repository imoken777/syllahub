import * as v from 'valibot';
import {
  daySchema,
  languageOptionsSchema,
  periodSchema,
  semesterSchema,
  targetYearOptionsSchema,
  typeOfConductionSchema,
} from './searchOptions';

export const createCourseDtoSchema = v.object({
  courseName: v.string(),
  semester: semesterSchema,
  groupName: v.string(),
  instructors: v.array(v.string()),
  languageOptions: languageOptionsSchema,
  typeOfConduction: v.nullable(typeOfConductionSchema),
  targetYear: v.nullable(targetYearOptionsSchema),
  syllabusLink: v.nullable(v.string()),
  day: v.nullable(daySchema),
  period: v.nullable(periodSchema),
});

export const courseModelSchema = v.object({
  ...createCourseDtoSchema.entries,

  courseId: v.number(),
});

export type CreateCourseDto = v.InferOutput<typeof createCourseDtoSchema>;
export type CourseModel = v.InferOutput<typeof courseModelSchema>;
