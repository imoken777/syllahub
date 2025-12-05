import { courses, insertCourseSchema } from '@/drizzle/schema';
import type { DB } from '@/lib/db';
import type { Result } from 'neverthrow';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';
import { getAllSyllabus } from './getAllSyllabus';

export const updateSyllabusService = async (db: DB): Promise<Result<{ count: number }, string>> => {
  const result = await getAllSyllabus();

  if (result.isErr()) {
    return err(result.error);
  }

  const data = result.value;
  if (data.length === 0) {
    return err('No syllabus data found to update');
  }

  const parse = v.safeParse(v.array(insertCourseSchema), data);
  if (!parse.success) {
    const issueMessages = parse.issues.map((issue) => issue.message).join(', ');
    return err(`Data validation failed: ${issueMessages}`);
  }

  try {
    await db.transaction(async (tx) => {
      await tx.delete(courses);
      await tx.insert(courses).values(parse.output);
    });

    return ok({ count: parse.output.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return err(`Database transaction failed: ${message}`);
  }
};
