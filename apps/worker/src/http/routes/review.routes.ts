import { Hono } from 'hono';
import { getGeneratedDocumentById } from '../../modules/document/document.service';
import { getJob } from '../../modules/job/job.service';
import {
  approveReviewRequest,
  getReviewRequestByToken,
  openReviewRequest,
  rejectReviewRequest,
} from '../../modules/review/review.service';
import type { AppEnv } from '../types';

type ApproveReviewBody = {
  reviewerName?: string;
  signatureImageUrl?: string;
  signMethod?: string;
};

type RejectReviewBody = {
  reviewerName?: string;
};

const reviewRoutes = new Hono<AppEnv>();

async function buildReviewResponse(
  env: AppEnv['Bindings'],
  token: string,
) {
  const reviewRequest = await getReviewRequestByToken(env, token);

  if (!reviewRequest) {
    return null;
  }

  const [job, document] = await Promise.all([
    getJob(env, reviewRequest.jobId),
    getGeneratedDocumentById(env, reviewRequest.documentId),
  ]);

  return {
    reviewRequest,
    job,
    document,
  };
}

reviewRoutes.get('/reviews/:token', async (c) => {
  const token = c.req.param('token');
  try {
    await openReviewRequest(c.env, token);
  } catch (error) {
    return c.json(
      {
        message: error instanceof Error ? error.message : 'Failed to open review request',
      },
      404,
    );
  }
  const response = await buildReviewResponse(c.env, token);

  if (!response) {
    return c.json({ message: 'Review request not found' }, 404);
  }

  return c.json(response);
});

reviewRoutes.post('/reviews/:token/approve', async (c) => {
  const token = c.req.param('token');
  const body: ApproveReviewBody = await c.req
    .json<ApproveReviewBody>()
    .catch(() => ({} as ApproveReviewBody));

  try {
    await approveReviewRequest(c.env, token, {
      reviewerName:
        typeof body.reviewerName === 'string' ? body.reviewerName.trim() : null,
      signatureImageUrl:
        typeof body.signatureImageUrl === 'string'
          ? body.signatureImageUrl.trim()
          : null,
      signMethod:
        typeof body.signMethod === 'string' ? body.signMethod.trim() : null,
    });
  } catch (error) {
    return c.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to approve review request',
      },
      400,
    );
  }

  const response = await buildReviewResponse(c.env, token);

  if (!response) {
    return c.json({ message: 'Review request not found' }, 404);
  }

  return c.json(response);
});

reviewRoutes.post('/reviews/:token/reject', async (c) => {
  const token = c.req.param('token');
  const body: RejectReviewBody = await c.req
    .json<RejectReviewBody>()
    .catch(() => ({} as RejectReviewBody));

  try {
    await rejectReviewRequest(c.env, token, {
      reviewerName:
        typeof body.reviewerName === 'string' ? body.reviewerName.trim() : null,
    });
  } catch (error) {
    return c.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to reject review request',
      },
      400,
    );
  }

  const response = await buildReviewResponse(c.env, token);

  if (!response) {
    return c.json({ message: 'Review request not found' }, 404);
  }

  return c.json(response);
});

export default reviewRoutes;
