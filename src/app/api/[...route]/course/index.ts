import { courses } from '@/drizzle/schema';
import { db } from '@/lib/db';
import { honoFactory } from '../factory';
import { getAllSyllabus } from './getAllSyllabus';

export const courseRouter = honoFactory.createApp().put('/cron', async (c) => {
  const data = await getAllSyllabus();
  try {
    await db.delete(courses);
    for (let i = 0; i < data.length; i += 10) {
      await db.insert(courses).values(data.slice(i, i + 10));
    }
  } catch (e) {
    return c.json({ error: e }, 500);
  }
  return c.json('OK', 200);
});
