import { revalidateTag } from 'next/cache';
import { publicFactory } from '../factory';

export const revalidateCoursesRouter = publicFactory.createApp().put('/', async (c) => {
  revalidateTag('courses');
  return c.json(
    {
      status: 'success',
      message: 'Courses cache revalidated successfully',
      revalidatedAt: new Date().toISOString(),
    },
    200,
  );
});
