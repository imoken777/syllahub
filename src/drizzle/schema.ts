import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const courses = sqliteTable('courses', {
  courseId: integer('courseId').primaryKey(),
  courseName: text('courseName').notNull(),
  semester: text('semester').notNull(),
  groupName: text('groupName').notNull(),
  instructors: text('instructors', { mode: 'json' }).$type<string[]>().notNull(),
  languageOptions: text('languageOptions').notNull(),
  typeOfConduction: text('typeOfConduction').notNull(),
  yearOfStudy: text('yearOfStudy', { mode: 'json' })
    .$type<{ startYear: number; endYear: number }>()
    .default(sql`null`),
  syllabusLink: text('syllabusLink').default(sql`null`),
  day: text('day'),
  period: text('period'),
});
