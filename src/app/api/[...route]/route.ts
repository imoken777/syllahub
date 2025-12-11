import { handle } from 'hono/vercel';
import { publicFactory } from './public/factory';
import { revalidateRootPageRouter } from './public/revalidateRootPageRouter';

const basePath = '/api';

const publicApp = publicFactory.createApp().basePath(basePath);
const publicRoutes = publicApp.route('/revalidateRootPage', revalidateRootPageRouter);

export const PUT = handle(publicRoutes);
export type ApiType = typeof publicRoutes;
