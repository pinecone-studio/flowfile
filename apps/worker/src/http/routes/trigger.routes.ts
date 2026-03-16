import { Hono } from 'hono';
import { triggerAction } from '../../modules/job/job.service';
import type { AppEnv } from '../types';

type TriggerRequestBody = {
  employeeId?: string;
  action?: string;
  actionName?: string;
  dryRun?: boolean;
};

const triggerRoutes = new Hono<AppEnv>();

triggerRoutes.post('/trigger', async (c) => {
  const body = await c.req.json<TriggerRequestBody>();
  const employeeId = body.employeeId?.trim();
  const actionName = body.action?.trim() || body.actionName?.trim();

  if (!employeeId || !actionName) {
    return c.json(
      { message: 'employeeId and action are required' },
      400,
    );
  }

  const job = await triggerAction(c.env, {
    employeeId,
    actionName,
    triggerSource: 'manual_api',
    dryRun: Boolean(body.dryRun),
  });

  return c.json(
    {
      jobId: job?.id,
      action: actionName,
      status: job?.status ?? 'accepted',
      documentsQueued: job?.documentsExpected ?? 0,
      estimatedCompletionMs: 8000,
    },
    202,
  );
});

export default triggerRoutes;
