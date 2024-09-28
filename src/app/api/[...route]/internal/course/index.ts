import { courses } from '@/drizzle/schema';
import { db } from '@/lib/db';
import type { CourseModel } from '@/types/course';
import { internalFactory } from '../factory';

export const courseRouter = internalFactory.createApp().get('/', async (c) => {
  try {
    const data: CourseModel[] = await db.select().from(courses).all();
    return c.json(data);
  } catch (e) {
    return c.json({ error: e }, 500);
  }
});
