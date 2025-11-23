import { handle } from 'hono/vercel';
import { publicFactory } from './public/factory';
import { revalidateCoursesRouter } from './public/revalidateCourses';

const basePath = '/api';

const publicApp = publicFactory.createApp().basePath(basePath);
const publicRoutes = publicApp.route('/revalidateCourses', revalidateCoursesRouter);

export const PUT = handle(publicRoutes);
export type ApiType = typeof publicRoutes;
