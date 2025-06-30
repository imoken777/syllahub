import { cors } from 'hono/cors';
import { createFactory } from 'hono/factory';

export const publicFactory = createFactory({
  initApp: (app) => {
    app.use(
      cors({
        origin: (origin) => origin,
        allowMethods: ['PUT'],
      }),
    );
  },
});
