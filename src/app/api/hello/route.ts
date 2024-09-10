// import { Hono } from 'hono';
// import { handle } from 'hono/vercel';

// export const runtime = 'edge';

// declare global {
//   namespace NodeJS {
//     interface ProcessEnv {
//       DB: D1Database;
//     }
//   }
// }

// const app = new Hono().basePath('/api');

// app.get('/hello', async (c) => {
//   const { results } = await process.env.DB.prepare('SELECT * FROM users').all();
//   return c.json(results);
// });

// export const GET = handle(app);
