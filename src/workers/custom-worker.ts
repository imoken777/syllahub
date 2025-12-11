import type { ApiType } from '@/app/api/[...route]/route';
import { getDb } from '@/lib/db';
import { updateSyllabusService } from '@/services/syllabus';
import { hc } from 'hono/client';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore `.open-next/worker.ts` is generated at build time
import { default as handler } from '../../.open-next/worker';

const scheduled: ExportedHandlerScheduledHandler<CloudflareEnv> = (_, env, ctx) => {
  const db = getDb(env.TURSO_DATABASE_URL, env.TURSO_AUTH_TOKEN);
  const apiClient = hc<ApiType>(env.APP_ORIGIN_URL);

  ctx.waitUntil(
    updateSyllabusService(db).then((result) =>
      result.match(
        async (res) => {
          await apiClient.api.revalidateRootPage.$put().catch(console.error);
          // eslint-disable-next-line no-console
          console.log('Syllabus update completed:', res.count);
        },
        (error) => console.error('Error during syllabus update:', error),
      ),
    ),
  );
};

export default {
  // eslint-disable-next-line
  fetch: handler.fetch,
  scheduled,
} satisfies ExportedHandler<CloudflareEnv>;
