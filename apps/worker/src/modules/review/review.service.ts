import {
  listReviewRequests as repoListReviewRequests,
  getReviewRequestByToken as repoGetReviewRequestByToken,
  createReviewRequest as repoCreateReviewRequest,
  updateReviewRequest as repoUpdateReviewRequest,
} from './review.repository';

type EnvWithDb = { DB: D1Database };

export const getReviewRequests = async (
  env: EnvWithDb,
  filters?: { jobId?: string },
) => {
  return repoListReviewRequests(env, filters);
};

export const getReviewRequestByToken = async (
  env: EnvWithDb,
  token: string,
) => {
  return repoGetReviewRequestByToken(env, token);
};

export const createReviewRequest = async (
  env: EnvWithDb,
  input: {
    jobId: string;
    reviewerEmail: string;
  },
) => {
  const now = new Date().toISOString();

  return repoCreateReviewRequest(env, {
    id: crypto.randomUUID(),
    jobId: input.jobId,
    reviewerEmail: input.reviewerEmail,
    reviewToken: crypto.randomUUID(),
    status: 'awaiting_review',
    openedAt: null,
    approvedAt: null,
    rejectedAt: null,
    createdAt: now,
  });
};

export const openReviewRequest = async (
  env: EnvWithDb,
  token: string,
) => {
  const review = await repoGetReviewRequestByToken(env, token);

  if (!review) {
    throw new Error('Review request not found');
  }

  if (!review.openedAt) {
    return repoUpdateReviewRequest(env, review.id, {
      openedAt: new Date().toISOString(),
      status: review.status === 'awaiting_review' ? 'opened' : review.status,
    });
  }

  return review;
};

export const approveReviewRequest = async (
  env: EnvWithDb,
  token: string,
) => {
  const review = await repoGetReviewRequestByToken(env, token);

  if (!review) {
    throw new Error('Review request not found');
  }

  if (review.status === 'approved') {
    return review;
  }

  if (review.status === 'rejected') {
    throw new Error('Rejected review request cannot be approved');
  }

  return repoUpdateReviewRequest(env, review.id, {
    status: 'approved',
    approvedAt: new Date().toISOString(),
  });
};

export const rejectReviewRequest = async (
  env: EnvWithDb,
  token: string,
) => {
  const review = await repoGetReviewRequestByToken(env, token);

  if (!review) {
    throw new Error('Review request not found');
  }

  if (review.status === 'approved') {
    throw new Error('Approved review request cannot be rejected');
  }

  if (review.status === 'rejected') {
    return review;
  }

  return repoUpdateReviewRequest(env, review.id, {
    status: 'rejected',
    rejectedAt: new Date().toISOString(),
  });
};