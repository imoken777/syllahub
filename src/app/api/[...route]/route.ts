import { handle } from 'hono/vercel';
import { publicFactory } from './public/factory';
import { updateSyllabus, updateSyllabusRouter } from './public/updateSyllabus';

const basePath = '/api';

const publicApp = publicFactory.createApp().basePath(basePath);
const publicRoutes = publicApp.route('/updateSyllabus', updateSyllabusRouter);
export const PUT = handle(publicRoutes);

const scheduled: ExportedHandlerScheduledHandler = async (event, env, ctx) => {
  ctx.waitUntil(
    updateSyllabus()
      // eslint-disable-next-line no-console
      .then((res) => console.log('Syllabus update completed:', res))
      .catch((err) => console.error('Error during syllabus update:', err)),
  );
};

const exportedObject = {
  fetch: publicRoutes.fetch,
  scheduled,
};

export default exportedObject;
