import { basicAuth } from 'hono/basic-auth';
import { cors } from 'hono/cors';
import { createFactory } from 'hono/factory';

type Env = {
  Bindings: {
    CRON_USERNAME: string | undefined;
    CRON_PASSWORD: string | undefined;
  };
};

export const publicFactory = createFactory<Env>({
  initApp: (app) => {
    app.use(async (c, next) => {
      const USERNAME = process.env.CRON_USERNAME;
      const PASSWORD = process.env.CRON_PASSWORD;
      if (!USERNAME || !PASSWORD) {
        throw new Error('CRON_USERNAME or CRON_PASSWORD is not set');
      }
      try {
        await basicAuth({
          username: USERNAME,
          password: PASSWORD,
        })(c, next);
        await next();
      } catch (e) {
        return c.json({ error: e }, 401);
      }
    });
    app.use(
      cors({
        origin: (origin) => origin,
        allowMethods: ['PUT'],
      }),
    );
  },
});
