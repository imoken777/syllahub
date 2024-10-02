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
export const groupNameSchema = z.string();

export type Semester = z.infer<typeof semesterSchema>;
export type TypeOfConduction = z.infer<typeof typeOfConductionSchema>;
export type Day = z.infer<typeof daySchema>;
export type Period = z.infer<typeof periodSchema>;
export type LanguageOptions = z.infer<typeof languageOptionsSchema>;
export type GroupName = z.infer<typeof groupNameSchema>;

export const searchOptionsSchema = z.object({
  semester: z.optional(semesterSchema),
  typeOfConduction: z.optional(typeOfConductionSchema),
  day: z.optional(daySchema),
  period: z.optional(periodSchema),
  languageOptions: z.optional(languageOptionsSchema),
  groupName: z.optional(groupNameSchema),
});
export type SearchOptions = z.infer<typeof searchOptionsSchema>;
