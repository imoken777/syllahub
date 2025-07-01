import { getDb } from '@/lib/db';
import { updateSyllabusService } from '@/services/syllabus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore `.open-next/worker.ts` is generated at build time
import { default as handler } from '../../.open-next/worker';

const scheduled: ExportedHandlerScheduledHandler<CloudflareEnv> = async (controller, env, ctx) => {
  const db = await getDb(env.TURSO_DATABASE_URL, env.TURSO_AUTH_TOKEN);
  ctx.waitUntil(
    updateSyllabusService(db)
      // eslint-disable-next-line no-console
      .then((res) => console.log('Syllabus update completed:', res))
      .catch((err) => console.error('Error during syllabus update:', err)),
  );
};

export default {
  fetch: handler.fetch,
  scheduled,
} satisfies ExportedHandler<CloudflareEnv>;
