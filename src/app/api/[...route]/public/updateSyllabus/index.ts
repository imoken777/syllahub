import { updateSyllabusService } from '@/services/syllabus';
import { publicFactory } from '../factory';

export const updateSyllabusRouter = publicFactory.createApp().put('/', async (c) => {
  try {
    const result = await updateSyllabusService();
    return c.json({ status: 'success', message: 'Syllabus updated', count: result.count }, 200);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : `Unexpected error: ${String(e)}`;
    return c.json({ status: 'error', message: errorMessage }, 500);
  }
});
