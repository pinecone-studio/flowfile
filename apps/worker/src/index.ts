import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { yoga } from './graphql/server';
import actionsRoutes from './http/routes/actions.routes';
import auditRoutes from './http/routes/audit.routes';
import documentsRoutes from './http/routes/documents.routes';
import healthRoutes from './http/routes/health.routes';
import jobsRoutes from './http/routes/jobs.routes';
import reviewRoutes from './http/routes/review.routes';
import triggerRoutes from './http/routes/trigger.routes';
import webhooksRoutes, {
  receiveEmployeeEvent,
} from './http/routes/webhooks.routes';
import type { AppEnv } from './http/types';
import employeeRoutes from './modules/employee/employee.routes';

const app = new Hono<AppEnv>();

app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  }),
);

app.route('', healthRoutes);
app.all('/graphql', async (c) => {
  return yoga.fetch(c.req.raw, {
    env: c.env,
  });
});
app.route('/api/v1', healthRoutes);
app.route('/api/v1', triggerRoutes);
app.route('/api/v1', actionsRoutes);
app.route('/api/v1', documentsRoutes);
app.route('/api/v1', jobsRoutes);
app.route('/api/v1', auditRoutes);
app.route('/api/v1', reviewRoutes);
app.route('/webhooks', webhooksRoutes);
app.route('/employees', employeeRoutes);

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

app.post('/epas/events', receiveEmployeeEvent);

export default app;
