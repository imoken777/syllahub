import { updateSyllabusService } from '@/services/syllabus';
import type { Env } from 'hono/types';

const scheduledWorker = {
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(
      updateSyllabusService()
        // eslint-disable-next-line no-console
        .then((res) => console.log('Syllabus update completed:', res))
        .catch((err) => console.error('Error during syllabus update:', err)),
    );
  },
};

export default scheduledWorker;
