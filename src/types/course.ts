import { z } from 'zod';
import {
  daySchema,
  languageOptionsSchema,
  periodSchema,
  semesterSchema,
  targetYearOptionsSchema,
  typeOfConductionSchema,
} from './searchOptions';

export const createCourseDtoSchema = z.object({
  courseName: z.string(),
  semester: semesterSchema,
  groupName: z.string(),
  instructors: z.array(z.string()),
  languageOptions: languageOptionsSchema,
  typeOfConduction: typeOfConductionSchema.nullable(),
  targetYear: targetYearOptionsSchema.nullable(),
  syllabusLink: z.string().nullable(),
  day: daySchema.nullable(),
  period: periodSchema.nullable(),
});

export const courseModelSchema = createCourseDtoSchema.extend({
  courseId: z.number(),
});

export type CreateCourseDto = z.infer<typeof createCourseDtoSchema>;
export type CourseModel = z.infer<typeof courseModelSchema>;
