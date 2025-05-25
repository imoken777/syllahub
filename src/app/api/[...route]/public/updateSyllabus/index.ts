import { courses } from '@/drizzle/schema';
import { db } from '@/lib/db';
import { publicFactory } from '../factory';
import { getAllSyllabus } from './getAllSyllabus';

export const updateSyllabusRouter = publicFactory.createApp().put('/', async (c) => {
  const data = await getAllSyllabus();
  try {
    await db.delete(courses);
    for (let i = 0; i < data.length; i += 10) {
      await db.insert(courses).values(data.slice(i, i + 10));
    }
    return c.json('OK', 200);
  } catch (e) {
    return c.json({ error: e }, 500);
  }
});
