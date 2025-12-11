import { revalidatePath } from 'next/cache';
import { publicFactory } from '../factory';

export const revalidateRootPageRouter = publicFactory.createApp().put('/', (c) => {
  revalidatePath('/');
  return c.json(
    {
      status: 'success',
      message: 'Root page revalidated successfully',
      revalidatedAt: new Date().toISOString(),
    },
    200,
  );
});
