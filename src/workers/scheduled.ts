import { updateSyllabusService } from '@/services/syllabus';

const scheduled: ExportedHandlerScheduledHandler = async (event, env, ctx) => {
  ctx.waitUntil(
    updateSyllabusService()
      // eslint-disable-next-line no-console
      .then((res) => console.log('Syllabus update completed:', res))
      .catch((err) => console.error('Error during syllabus update:', err)),
  );
};

export default scheduled;
