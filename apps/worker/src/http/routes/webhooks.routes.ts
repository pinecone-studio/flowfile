import { Hono, type Context } from 'hono';
import type { AppEnv } from '../types';

const webhooksRoutes = new Hono<AppEnv>();

export const receiveEmployeeEvent = async (c: Context<AppEnv>) => {
  const body = await c.req.json();

  console.log('EPAS EVENT:', JSON.stringify(body, null, 2));

  return c.json({
    received: true,
    body,
  });
};

webhooksRoutes.post('/employee.changed', receiveEmployeeEvent);

export default webhooksRoutes;
