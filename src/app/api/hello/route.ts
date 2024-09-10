import { users } from '@/drizzle/schema';
import { db } from '@/lib/db';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

export const runtime = 'edge';

const app = new Hono().basePath('/api');

app.get('/hello', async (c) => {
  const results = db.select().from(users).all();
  return c.json(results);
});

export const GET = handle(app);
