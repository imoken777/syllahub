// import { publicFactory } from './public/factory';
// import { updateSyllabusRouter } from './public/updateSyllabus';

// const basePath = '/api';

// const publicApp = publicFactory.createApp().basePath(basePath);
// const publicRoutes = publicApp.route('/updateSyllabus', updateSyllabusRouter);
// export const PUT = handle(publicRoutes);

// 仮
export async function PUT() {
  return new Response('This API is disabled', { status: 404 });
}
