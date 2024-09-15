import { handle } from 'hono/vercel';
import { courseRouter } from './course';
import { cronApp } from './cron';
import { honoFactory } from './factory';

export const runtime = 'edge';

const app = honoFactory.createApp().basePath('/api');

const routes = app.route('/course', courseRouter);

export const GET = handle(routes);
export type APIType = typeof routes;

export const PUT = handle(cronApp);
