import { Hono } from 'hono';
import { logEvent } from '../../modules/audit/audit.service';
import {
  getGeneratedDocuments,
  updateGeneratedDocument,
} from '../../modules/document/document.service';
import { getJob, getWorkflowSnapshot } from '../../modules/job/job.service';
import { updateJob } from '../../modules/job/job.repository';
import { getReviewRequests } from '../../modules/review/review.service';
import { updateReviewRequest } from '../../modules/review/review.repository';
import type { AppEnv } from '../types';

const jobsRoutes = new Hono<AppEnv>();

jobsRoutes.post('/jobs/:jobId/cancel', async (c) => {
  const jobId = c.req.param('jobId');
  const snapshot = await getWorkflowSnapshot(c.env, jobId);

  if (!snapshot.job) {
    return c.json({ message: 'Job not found' }, 404);
  }

  if (['completed', 'rejected', 'canceled'].includes(snapshot.job.status)) {
    return c.json(
      { message: `Cannot cancel a ${snapshot.job.status} workflow` },
      400,
    );
  }

  const now = new Date().toISOString();
  const documents = await getGeneratedDocuments(c.env, { jobId });
  const reviews = await getReviewRequests(c.env, { jobId });

  await Promise.all([
    updateJob(c.env, jobId, {
      status: 'canceled',
      completedAt: now,
      updatedAt: now,
    }),
    ...documents
      .filter((document) => !['completed', 'rejected', 'canceled'].includes(document.status))
      .map((document) =>
        updateGeneratedDocument(c.env, document.id, {
          status: 'canceled',
        }),
      ),
    ...reviews
      .filter((review) => !['approved', 'rejected', 'canceled'].includes(review.status))
      .map((review) =>
        updateReviewRequest(c.env, review.id, {
          status: 'canceled',
          updatedAt: now,
        }),
      ),
  ]);

  const job = await getJob(c.env, jobId);

  if (job) {
    await logEvent(c.env, {
      jobId: job.id,
      employeeId: job.employeeId,
      actionName: job.actionName,
      eventType: 'job_canceled',
      status: 'warning',
      message: 'Workflow canceled manually',
    });
  }

  return c.json({
    jobId,
    status: 'canceled',
  });
});

export default jobsRoutes;
