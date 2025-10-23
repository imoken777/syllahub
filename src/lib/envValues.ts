import dotenv from 'dotenv';
import * as v from 'valibot';

dotenv.config({ path: '.dev.vars' });

const envSchema = v.object({
  TURSO_DATABASE_URL: v.pipe(v.string(), v.url()),
  TURSO_AUTH_TOKEN: v.pipe(v.string(), v.minLength(1)),
  NEXTJS_ENV: v.optional(v.picklist(['development', 'production'])),
  APP_ORIGIN_URL: v.pipe(v.string(), v.url()),
}) satisfies v.GenericSchema<CloudflareEnv>;

const envValues = v.parse(envSchema, process.env);

export const TURSO_DATABASE_URL = envValues.TURSO_DATABASE_URL;
export const TURSO_AUTH_TOKEN = envValues.TURSO_AUTH_TOKEN;
export const NEXTJS_ENV = envValues.NEXTJS_ENV ?? 'production';
export const APP_ORIGIN_URL = envValues.APP_ORIGIN_URL;
