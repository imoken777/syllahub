import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: '.dev.vars' });

const envSchema = z.object({
  TURSO_DATABASE_URL: z.string().url(),
  TURSO_AUTH_TOKEN: z.string().min(1),
  NEXTJS_ENV: z.enum(['development', 'production']).optional(),
  APP_ORIGIN_URL: z.string().url(),
}) satisfies z.ZodType<CloudflareEnv>;

const envValues = envSchema.parse(process.env);

export const TURSO_DATABASE_URL = envValues.TURSO_DATABASE_URL;
export const TURSO_AUTH_TOKEN = envValues.TURSO_AUTH_TOKEN;
export const NEXTJS_ENV = envValues.NEXTJS_ENV ?? 'production';
export const APP_ORIGIN_URL = envValues.APP_ORIGIN_URL;
