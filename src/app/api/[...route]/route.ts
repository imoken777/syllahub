import { handle } from 'hono/vercel';
import { courseRouter } from './internal/course';
import { internalFactory } from './internal/factory';
import { cronRouter } from './public/cron';
import { publicFactory } from './public/factory';

export const runtime = 'edge';
const basePath = '/api';

const internalApp = internalFactory.createApp().basePath(basePath);
const internalRoutes = internalApp.route('/course', courseRouter);
export const GET = handle(internalRoutes);
export type APIType = typeof internalRoutes;

const publicApp = publicFactory.createApp().basePath(basePath);
const publicRoutes = publicApp.route('/cron', cronRouter);
export const PUT = handle(publicRoutes);
