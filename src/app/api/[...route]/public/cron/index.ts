import { courses, insertCourseSchema } from '@/drizzle/schema';
import { db } from '@/lib/db';
import { publicFactory } from '../factory';
import { getAllSyllabus } from './getAllSyllabus';

export const cronRouter = publicFactory.createApp().put('/', async (c) => {
  const data = await getAllSyllabus();
  const validData = data.filter((course) => insertCourseSchema.safeParse(course).success);
  try {
    await db.delete(courses);
    for (let i = 0; i < validData.length; i += 10) {
      await db.insert(courses).values(validData.slice(i, i + 10));
    }
    return c.json('OK', 200);
  } catch (e) {
    return c.json({ error: e }, 500);
  }
});
