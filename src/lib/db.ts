import { createClient } from '@libsql/client/web';
import { drizzle } from 'drizzle-orm/libsql';

export type DB = ReturnType<typeof drizzle>;

let cachedDb: DB | null = null;

export const getDb = (url: string, authToken: string): DB => {
  if (cachedDb) {
    return cachedDb;
  }

  const turso = createClient({
    url,
    authToken,
  });

  cachedDb = drizzle(turso);
  return cachedDb;
};
