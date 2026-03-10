import { Hono } from 'hono';

type Env = {
  Bindings: {
    DB: D1Database;
  };
};

const app = new Hono<Env>();

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

app.get('/db-test', async (c) => {
  const result = await c.env.DB.prepare('SELECT 1 as ok').first();
  return c.json(result);
});

export default app;
