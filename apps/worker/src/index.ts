import { Hono } from 'hono';

type Env = {
  Bindings: {
    DB: D1Database;
    DOCS_BUCKET: R2Bucket;
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

app.get('/r2-test', async (c) => {
  const result = await c.env.DOCS_BUCKET.list({ limit: 10 });
  return c.json({
    bucket: 'epas-docs',
    objects: result.objects.map((object) => ({
      key: object.key,
      size: object.size,
      uploaded: object.uploaded,
    })),
  });
});

export default app;
