import { drizzle } from 'drizzle-orm/d1';

export const db = drizzle(process.env.DB as unknown as D1Database);
