import { Hono } from 'hono';
import { getAllActions } from '../../modules/action/action.service';
import type { AppEnv } from '../types';

const actionsRoutes = new Hono<AppEnv>();

actionsRoutes.get('/actions', async (c) => {
  const actions = await getAllActions(c.env);
  return c.json(actions);
});

export default actionsRoutes;
