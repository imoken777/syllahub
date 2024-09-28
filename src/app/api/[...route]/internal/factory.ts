import { cors } from 'hono/cors';
import { createFactory } from 'hono/factory';

const internalFactory = createFactory({
  initApp: (app) => {
    app.use(
      cors({
        origin: (origin) => origin,
        allowMethods: ['GET', 'PUT'],
      }),
    );
  },
});

export { internalFactory };
