import {
  dayOptions,
  languageOptions,
  periodOptions,
  semesterOptions,
  targetYearOptions,
  typeOfConductionOptions,
} from '@/constants/searchOptions';
import * as v from 'valibot';

export const semesterSchema = v.picklist(semesterOptions);
export const targetYearOptionsSchema = v.pipe(
  v.array(v.picklist(targetYearOptions)),
  v.minLength(1),
  v.maxLength(4),
);
export const typeOfConductionSchema = v.picklist(typeOfConductionOptions);
export const daySchema = v.picklist(dayOptions);
export const periodSchema = v.picklist(periodOptions);
export const languageOptionsSchema = v.picklist(languageOptions);

export type Semester = v.InferOutput<typeof semesterSchema>;
export type TargetYearOptions = v.InferOutput<typeof targetYearOptionsSchema>;
export type TypeOfConduction = v.InferOutput<typeof typeOfConductionSchema>;
export type Day = v.InferOutput<typeof daySchema>;
export type Period = v.InferOutput<typeof periodSchema>;
export type LanguageOptions = v.InferOutput<typeof languageOptionsSchema>;

export const searchOptionsSchema = v.object({
  semester: v.optional(semesterSchema),
  targetYear: v.optional(targetYearOptionsSchema),
  typeOfConduction: v.optional(typeOfConductionSchema),
  day: v.optional(daySchema),
  period: v.optional(periodSchema),
  languageOptions: v.optional(languageOptionsSchema),
  groupName: v.optional(v.array(v.string())),
  yearOfStudy: v.optional(v.number()),
});
export type SearchOptions = v.InferOutput<typeof searchOptionsSchema>;
