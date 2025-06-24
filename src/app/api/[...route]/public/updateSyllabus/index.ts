import { courses } from '@/drizzle/schema';
import { getDb } from '@/lib/db';
import { publicFactory } from '../factory';
import { getAllSyllabus } from './getAllSyllabus';

export const updateSyllabusRouter = publicFactory.createApp().put('/', async (c) => {
  try {
    const data = await getAllSyllabus();
    if (data.length === 0) {
      throw new Error('No syllabus data found to update');
    }

    const db = await getDb();
    await db.transaction(async (tx) => {
      await tx.delete(courses);
      await tx.insert(courses).values(data);
    });

    return c.json({ status: 'success', message: 'Syllabus updated', count: data.length }, 200);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : `Unexpected error: ${String(e)}`;
    return c.json({ status: 'error', message: errorMessage }, 500);
  }
});
