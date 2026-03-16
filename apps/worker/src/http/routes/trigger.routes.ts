import { Hono } from 'hono';
import { getWorkflowSnapshot, triggerAction } from '../../modules/job/job.service';
import type { AppEnv } from '../types';

type TriggerRecipientBody = {
  email: string;
  name?: string;
  role?: string;
  signOrder?: number;
};

type TriggerRequestBody = {
  employeeId?: string;
  action?: string;
  actionName?: string;
  dryRun?: boolean;
  payload?: Record<string, unknown>;
  requestedByEmail?: string;
  overrideRecipients?: TriggerRecipientBody[];
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
    actionPayload: body.payload,
    requestedByEmail:
      typeof body.requestedByEmail === 'string'
        ? body.requestedByEmail.trim()
        : undefined,
    overrideRecipients: Array.isArray(body.overrideRecipients)
      ? body.overrideRecipients
          .filter(
            (recipient) =>
              recipient &&
              typeof recipient.email === 'string' &&
              recipient.email.trim(),
          )
          .map((recipient) => ({
            email: recipient.email.trim(),
            name: recipient.name?.trim(),
            role: recipient.role?.trim(),
            signOrder: recipient.signOrder,
          }))
      : undefined,
  });
  const snapshot = job?.id ? await getWorkflowSnapshot(c.env, job.id) : null;

  return c.json(
    {
      jobId: job?.id,
      action: actionName,
      status: job?.status ?? 'accepted',
      documentsQueued: job?.documentsExpected ?? 0,
      estimatedCompletionMs: 8000,
      documents: snapshot?.documents ?? [],
      reviewRequests:
        snapshot?.reviewRequests.map((reviewRequest) => ({
          ...reviewRequest,
          reviewUrl: `/api/v1/reviews/${reviewRequest.reviewToken}`,
        })) ?? [],
    },
    202,
  );
});

export default triggerRoutes;
