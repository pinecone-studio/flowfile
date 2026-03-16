import { Hono } from 'hono';
import type { AppEnv } from '../types';

const healthRoutes = new Hono<AppEnv>();

healthRoutes.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

export default healthRoutes;
