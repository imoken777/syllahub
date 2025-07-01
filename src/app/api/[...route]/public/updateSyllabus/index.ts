import { getDb } from '@/lib/db';
import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from '@/lib/envValues';
import { updateSyllabusService } from '@/services/syllabus';
import { publicFactory } from '../factory';

export const updateSyllabusRouter = publicFactory.createApp().put('/', async (c) => {
  try {
    const db = await getDb(TURSO_DATABASE_URL, TURSO_AUTH_TOKEN);
    const result = await updateSyllabusService(db);
    return c.json({ status: 'success', message: 'Syllabus updated', count: result.count }, 200);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : `Unexpected error: ${String(e)}`;
    return c.json({ status: 'error', message: errorMessage }, 500);
  }
});
