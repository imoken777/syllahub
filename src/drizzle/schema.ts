import {
  dayOptions,
  languageOptions,
  periodOptions,
  semesterOptions,
  typeOfConductionOptions,
} from '@/constants/searchOptions';
import type { TargetYearOptions } from '@/types/searchOptions';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';

export const courses = sqliteTable('courses', {
  courseId: integer('courseId').primaryKey(),
  courseName: text('courseName').notNull(),
  semester: text('semester', { enum: semesterOptions }).notNull(),
  groupName: text('groupName').notNull(),
  instructors: text('instructors', { mode: 'json' }).$type<string[]>().notNull(),
  languageOptions: text('languageOptions', { enum: languageOptions }).notNull(),
  typeOfConduction: text('typeOfConduction', { enum: typeOfConductionOptions }),
  targetYear: text('targetYear', { mode: 'json' }).$type<TargetYearOptions>(),
  syllabusLink: text('syllabusLink').default(sql`null`),
  day: text('day', { enum: dayOptions }),
  period: text('period', { enum: periodOptions }),
});

export const insertCourseSchema = createInsertSchema(courses);

export const selectCourseSchema = createSelectSchema(courses);
