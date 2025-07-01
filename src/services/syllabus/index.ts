import { courses } from '@/drizzle/schema';
import type { DB } from '@/lib/db';
import { getAllSyllabus } from './getAllSyllabus';

export const updateSyllabusService = async (db: DB) => {
  const data = await getAllSyllabus();
  if (data.length === 0) {
    throw new Error('No syllabus data found to update');
  }

  await db.transaction(async (tx) => {
    await tx.delete(courses);
    await tx.insert(courses).values(data);
  });

  return { count: data.length };
};
