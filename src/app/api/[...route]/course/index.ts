import { courses } from '@/drizzle/schema';
import { db } from '@/lib/db';
import type { Course } from '@/types/course';
import { honoFactory } from '../factory';

export const courseRouter = honoFactory.createApp().get('/', async (c) => {
  try {
    const data: Course[] = await db.select().from(courses).all();
    return c.json(data);
  } catch (e) {
    return c.json({ error: e }, 500);
  }
});
