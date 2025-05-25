import { courses } from '@/drizzle/schema';
import { db } from '@/lib/db';
import { publicFactory } from '../factory';
import { getAllSyllabus } from './getAllSyllabus';

export const updateSyllabusRouter = publicFactory.createApp().put('/', async (c) => {
  const data = await getAllSyllabus();
  try {
    await db.transaction(async (tx) => {
      await tx.delete(courses);
      await tx.insert(courses).values(data);
    });
    return c.json('OK', 200);
  } catch (e) {
    return c.json({ error: e }, 500);
  }
});
