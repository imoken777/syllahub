import { handle } from 'hono/vercel';
import { publicFactory } from './public/factory';
import { updateSyllabusRouter } from './public/updateSyllabus';

export const runtime = 'edge';
const basePath = '/api';

const publicApp = publicFactory.createApp().basePath(basePath);
const publicRoutes = publicApp.route('/updateSyllabus', updateSyllabusRouter);
export const PUT = handle(publicRoutes);
