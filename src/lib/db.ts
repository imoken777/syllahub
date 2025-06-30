import { createClient } from '@libsql/client/web';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';

dotenv.config({
  path: '.dev.vars',
});

const isCloudflareWorkerEnvironment = () =>
  typeof globalThis.navigator !== 'undefined' &&
  globalThis.navigator.userAgent === 'Cloudflare-Workers';

const getEnvVariables = async (): Promise<{
  TURSO_DATABASE_URL: string | undefined;
  TURSO_AUTH_TOKEN: string | undefined;
}> => {
  try {
    if (isCloudflareWorkerEnvironment()) {
      const context = await getCloudflareContext({ async: true });
      return {
        TURSO_DATABASE_URL: context.env.TURSO_DATABASE_URL,
        TURSO_AUTH_TOKEN: context.env.TURSO_AUTH_TOKEN,
      };
    }
  } catch {
    // getCloudflareContextが失敗した場合はprocess.envにフォールバック
  }

  return {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
  };
};

let cachedDb: ReturnType<typeof drizzle> | null = null;

export const getDb = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  const env = await getEnvVariables();

  if (!env.TURSO_DATABASE_URL || !env.TURSO_AUTH_TOKEN) {
    throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in environment variables');
  }

  const turso = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });

  cachedDb = drizzle(turso);
  return cachedDb;
};
