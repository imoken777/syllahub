import { getDb } from '@/lib/db';
import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from '@/lib/envValues';
import { updateSyllabusService } from '@/services/syllabus';
import { publicFactory } from '../factory';

export const updateSyllabusRouter = publicFactory.createApp().put('/', async (c) => {
  const db = await getDb(TURSO_DATABASE_URL, TURSO_AUTH_TOKEN);
  const result = await updateSyllabusService(db);

  return result.match(
    (success) =>
      c.json({ status: 'success', message: 'Syllabus updated', count: success.count }, 200),
    (error) => c.json({ status: 'error', message: error }, 500),
  );
});
