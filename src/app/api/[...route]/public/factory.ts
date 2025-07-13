import { APP_ORIGIN_URL } from '@/lib/envValues';
import { cors } from 'hono/cors';
import { createFactory } from 'hono/factory';

export const publicFactory = createFactory({
  initApp: (app) => {
    app.use(
      cors({
        origin: APP_ORIGIN_URL,
        allowMethods: ['PUT'],
      }),
    );
  },
});
