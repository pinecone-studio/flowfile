import { Hono } from 'hono';
import { getAuditLogs } from '../../modules/audit/audit.service';
import type { AppEnv } from '../types';

const auditRoutes = new Hono<AppEnv>();

auditRoutes.get('/audit', async (c) => {
  const employeeId = c.req.query('employeeId') || undefined;
  const actionName = c.req.query('actionName') || undefined;
  const jobId = c.req.query('jobId') || undefined;

  const auditLogs = await getAuditLogs(c.env, {
    employeeId,
    actionName,
    jobId,
  });

  return c.json(auditLogs);
});

export default auditRoutes;
