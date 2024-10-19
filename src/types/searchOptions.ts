import {
  dayOptions,
  languageOptions,
  periodOptions,
  semesterOptions,
  targetYearOptions,
  typeOfConductionOptions,
} from '@/constants/searchOptions';
import { numberEnum } from '@/utils/numberEnum';
import { z } from 'zod';

export const semesterSchema = z.enum(semesterOptions);
export const targetYearOptionsSchema = z
  .array(z.number().superRefine(numberEnum(targetYearOptions)))
  .min(1)
  .max(4);
export const typeOfConductionSchema = z.enum(typeOfConductionOptions);
export const daySchema = z.enum(dayOptions);
export const periodSchema = z.enum(periodOptions);
export const languageOptionsSchema = z.enum(languageOptions);

export type Semester = z.infer<typeof semesterSchema>;
export type TargetYearOptions = z.infer<typeof targetYearOptionsSchema>;
export type TypeOfConduction = z.infer<typeof typeOfConductionSchema>;
export type Day = z.infer<typeof daySchema>;
export type Period = z.infer<typeof periodSchema>;
export type LanguageOptions = z.infer<typeof languageOptionsSchema>;

export const searchOptionsSchema = z.object({
  semester: z.optional(semesterSchema),
  targetYear: z.optional(targetYearOptionsSchema),
  typeOfConduction: z.optional(typeOfConductionSchema),
  day: z.optional(daySchema),
  period: z.optional(periodSchema),
  languageOptions: z.optional(languageOptionsSchema),
  groupName: z.optional(z.string()),
  yearOfStudy: z.optional(z.number()),
});
export type SearchOptions = z.infer<typeof searchOptionsSchema>;
