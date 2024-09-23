import { courses, insertCourseSchema } from '@/drizzle/schema';
import { db } from '@/lib/db';
import { Hono } from 'hono';
import { basicAuth } from 'hono/basic-auth';
import { cors } from 'hono/cors';
import { getAllSyllabus } from './getAllSyllabus';

type Bindings = {
  CRON_USERNAME: string | undefined;
  CRON_PASSWORD: string | undefined;
};

export const runtime = 'edge';

export const cronApp = new Hono<{ Bindings: Bindings }>();

cronApp.use(async (c, next) => {
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

cronApp.use(
  cors({
    origin: (origin) => origin,
    allowMethods: ['PUT'],
  }),
);

cronApp.put('/api/cron', async (c) => {
  const data = await getAllSyllabus();
  const validData = data.filter((course) => insertCourseSchema.safeParse(course).success);
  try {
    await db.delete(courses);
    for (let i = 0; i < validData.length; i += 10) {
      await db.insert(courses).values(validData.slice(i, i + 10));
    }
    return c.json('OK', 200);
  } catch (e) {
    return c.json({ error: e }, 500);
  }
});
