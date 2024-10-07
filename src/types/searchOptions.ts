import {
  dayOptions,
  languageOptions,
  periodOptions,
  semesterOptions,
  typeOfConductionOptions,
} from '@/constants/searchOptions';
import { z } from 'zod';

export const semesterSchema = z.enum(semesterOptions);
export const typeOfConductionSchema = z.enum(typeOfConductionOptions);
export const daySchema = z.enum(dayOptions);
export const periodSchema = z.enum(periodOptions);
export const languageOptionsSchema = z.enum(languageOptions);

export type Semester = z.infer<typeof semesterSchema>;
export type TypeOfConduction = z.infer<typeof typeOfConductionSchema>;
export type Day = z.infer<typeof daySchema>;
export type Period = z.infer<typeof periodSchema>;
export type LanguageOptions = z.infer<typeof languageOptionsSchema>;

export const searchOptionsSchema = z.object({
  semester: z.optional(semesterSchema),
  typeOfConduction: z.optional(typeOfConductionSchema),
  day: z.optional(daySchema),
  period: z.optional(periodSchema),
  languageOptions: z.optional(languageOptionsSchema),
  groupName: z.optional(z.string()),
});
export type SearchOptions = z.infer<typeof searchOptionsSchema>;
