import { honoFactory } from '../factory';

export const courseRouter = honoFactory
  .createApp()
  .get('/', (c) => c.json({ course: 'Hello World!' }));
