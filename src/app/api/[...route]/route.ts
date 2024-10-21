import { handle } from 'hono/vercel';
import { cronRouter } from './public/cron';
import { publicFactory } from './public/factory';

export const runtime = 'edge';
const basePath = '/api';

const publicApp = publicFactory.createApp().basePath(basePath);
const publicRoutes = publicApp.route('/cron', cronRouter);
export const PUT = handle(publicRoutes);
