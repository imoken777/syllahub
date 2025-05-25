import { getRequestContext } from '@cloudflare/next-on-pages';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

export const getDb = () => {
  const { env } = getRequestContext();

  const turso = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });

  return drizzle(turso);
};
