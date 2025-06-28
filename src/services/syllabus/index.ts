import { courses } from '@/drizzle/schema';
import { getDb } from '@/lib/db';
import { getAllSyllabus } from './getAllSyllabus';

export const updateSyllabusService = async () => {
  const data = await getAllSyllabus();
  if (data.length === 0) {
    throw new Error('No syllabus data found to update');
  }

  const db = await getDb();
  await db.transaction(async (tx) => {
    await tx.delete(courses);
    await tx.insert(courses).values(data);
  });

  return { count: data.length };
};
