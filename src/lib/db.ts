import { getRequestContext } from '@cloudflare/next-on-pages';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const { env } = getRequestContext();

const turso = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(turso);
