import { createClient } from '@libsql/client/web';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/libsql';

export const getDb = async () => {
  const { env } = await getCloudflareContext({ async: true });

  const turso = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });

  return drizzle(turso);
};
