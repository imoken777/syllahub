import { courses, selectCourseSchema } from '@/drizzle/schema';
import { db } from '@/lib/db';
import type { CourseModel } from '@/types/course';
import { internalFactory } from '../factory';

export const courseRouter = internalFactory.createApp().get('/', async (c) => {
  try {
    const data = await db.select().from(courses).all();
    const validData: CourseModel[] = data.filter(
      (course) => selectCourseSchema.safeParse(course).success,
    );
    return c.json(validData, 200);
  } catch (e) {
    return c.json({ error: e }, 500);
  }
});
