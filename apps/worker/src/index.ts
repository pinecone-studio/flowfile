import { Hono } from 'hono';
import employeeRoutes from './modules/employee/employee.routes';

type Env = {
  Bindings: {
    DB: D1Database;
    DOCS_BUCKET: R2Bucket;
    EPAS_WEBHOOK_URL?: string;
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

app.get('/db-tables', async (c) => {
  const result = await c.env.DB.prepare(
    `
      SELECT name
      FROM sqlite_master
      WHERE type='table'
      ORDER BY name
    `,
  ).all();

  return c.json(result);
});

//------------------Employee service zoriulsan, endees ehelj bga----------

app.post('/epas/events', async (c) => {
  const body = await c.req.json();

  console.log('EPAS EVENT:', JSON.stringify(body, null, 2));

  return c.json({
    received: true,
    body,
  });
});

app.route('/employees', employeeRoutes);

export default app;
