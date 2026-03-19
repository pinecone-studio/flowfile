import { logEvent } from '../audit/audit.service';
import { getGeneratedDocumentById } from '../document/document.service';
import { getJobById as repoGetJobById } from '../job/job.repository';
import {
  buildReviewNotifications,
  emitWorkflowNotifications,
} from '../workflow/workflow.service';
import {
  createReviewRequest as repoCreateReviewRequest,
  getReviewRequestByToken as repoGetReviewRequestByToken,
  listReviewRequests as repoListReviewRequests,
  updateReviewRequest as repoUpdateReviewRequest,
} from './review.repository';
import { syncDocumentAndJobStatus } from './review.status';
import type { EnvWithBindings } from './review.types';
import { nowIso } from './review.utils';

const isPendingReviewStatus = (status: string) =>
  status === 'awaiting_review' || status === 'opened';

async function assertReviewOrderReady(
  env: EnvWithBindings,
  review: { documentId: string; signOrder: number },
) {
  const documentReviews = await repoListReviewRequests(env, {
    documentId: review.documentId,
  });
  const blockedByPriorSigner = documentReviews.some(
    (candidate) =>
      candidate.signOrder < review.signOrder && candidate.status !== 'approved',
  );

  if (blockedByPriorSigner) {
    throw new Error('This review is waiting for an earlier signer');
  }
}

async function notifyNextReviewers(
  env: EnvWithBindings,
  input: {
    jobId: string;
    documentId: string;
    releasedBySignOrder: number;
  },
) {
  const [job, document, documentReviews] = await Promise.all([
    repoGetJobById(env, input.jobId),
    getGeneratedDocumentById(env, input.documentId),
    repoListReviewRequests(env, { documentId: input.documentId }),
  ]);

  if (!job || !document) {
    return;
  }

  const waitingOnCurrentOrder = documentReviews.some(
    (review) =>
      review.signOrder === input.releasedBySignOrder &&
      isPendingReviewStatus(review.status),
  );

  if (waitingOnCurrentOrder) {
    return;
  }

  const nextSignOrder = documentReviews
    .filter(
      (review) =>
        review.signOrder > input.releasedBySignOrder &&
        isPendingReviewStatus(review.status),
    )
    .reduce<number | null>(
      (current, review) =>
        current == null || review.signOrder < current ? review.signOrder : current,
      null,
    );

  if (nextSignOrder == null) {
    return;
  }

  const nextReviewRequests = documentReviews.filter(
    (review) =>
      review.signOrder === nextSignOrder && isPendingReviewStatus(review.status),
  );

  if (nextReviewRequests.length === 0) {
    return;
  }

  const notifications = buildReviewNotifications({
    job,
    documents: [document],
    reviewRequests: nextReviewRequests,
    baseUrl: env.APP_BASE_URL,
  });

  await emitWorkflowNotifications(env, notifications);

  await logEvent(env, {
    jobId: job.id,
    employeeId: job.employeeId,
    actionName: job.actionName,
    eventType: 'review_requests_released',
    eventPayload: nextReviewRequests.map((review) => ({
      id: review.id,
      reviewerEmail: review.reviewerEmail,
      signOrder: review.signOrder,
      documentId: review.documentId,
    })),
    status: 'success',
    message: `Released sign order ${nextSignOrder} for ${document.documentType}`,
  });
}

export const getReviewRequests = async (
  env: EnvWithBindings,
  filters?: { jobId?: string; documentId?: string },
) => {
  return repoListReviewRequests(env, filters);
};

export const getReviewRequestByToken = async (
  env: EnvWithBindings,
  token: string,
) => {
  return repoGetReviewRequestByToken(env, token);
};

export const createReviewRequest = async (
  env: EnvWithBindings,
  input: {
    jobId: string;
    documentId: string;
    reviewerEmail: string;
    reviewerName?: string | null;
    signerRole: string;
    signOrder: number;
  },
) => {
  const now = nowIso();

  return repoCreateReviewRequest(env, {
    id: crypto.randomUUID(),
    jobId: input.jobId,
    documentId: input.documentId,
    reviewerEmail: input.reviewerEmail,
    reviewerName: input.reviewerName ?? null,
    signerRole: input.signerRole,
    signOrder: input.signOrder,
    reviewToken: crypto.randomUUID(),
    status: 'awaiting_review',
    openedAt: null,
    approvedAt: null,
    rejectedAt: null,
    signatureImageUrl: null,
    signMethod: null,
    createdAt: now,
    updatedAt: now,
  });
};

export const openReviewRequest = async (
  env: EnvWithBindings,
  token: string,
) => {
  const review = await repoGetReviewRequestByToken(env, token);

  if (!review) {
    throw new Error('Review request not found');
  }

  if (!review.openedAt) {
    const openedReview = await repoUpdateReviewRequest(env, review.id, {
      openedAt: nowIso(),
      status: review.status === 'awaiting_review' ? 'opened' : review.status,
      updatedAt: nowIso(),
    });

    const job = await repoGetJobById(env, review.jobId);

    if (job) {
      await logEvent(env, {
        jobId: job.id,
        employeeId: job.employeeId,
        actionName: job.actionName,
        eventType: 'review_opened',
        eventPayload: {
          documentId: review.documentId,
          reviewerEmail: review.reviewerEmail,
        },
        status: 'success',
        message: `${review.reviewerEmail} opened the review link`,
      });
    }

    return openedReview;
  }

  return review;
};

export const approveReviewRequest = async (
  env: EnvWithBindings,
  token: string,
  input?: {
    reviewerName?: string | null;
    signatureImageUrl?: string | null;
    signMethod?: string | null;
  },
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

  await assertReviewOrderReady(env, review);

  const approvedReview = await repoUpdateReviewRequest(env, review.id, {
    status: 'approved',
    reviewerName: input?.reviewerName ?? review.reviewerName,
    signatureImageUrl: input?.signatureImageUrl ?? null,
    signMethod: input?.signMethod ?? 'typed_name',
    approvedAt: nowIso(),
    updatedAt: nowIso(),
  });

  const job = await repoGetJobById(env, review.jobId);

  if (job) {
    await logEvent(env, {
      jobId: job.id,
      employeeId: job.employeeId,
      actionName: job.actionName,
      eventType: 'review_approved',
      eventPayload: {
        documentId: review.documentId,
        reviewerEmail: review.reviewerEmail,
      },
      status: 'success',
      message: `${review.reviewerEmail} approved ${review.documentId}`,
    });
  }

  await syncDocumentAndJobStatus(env, review.jobId, review.documentId);
  await notifyNextReviewers(env, {
    jobId: review.jobId,
    documentId: review.documentId,
    releasedBySignOrder: review.signOrder,
  });

  return approvedReview;
};

export const rejectReviewRequest = async (
  env: EnvWithBindings,
  token: string,
  input?: {
    reviewerName?: string | null;
  },
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

  await assertReviewOrderReady(env, review);

  const rejectedReview = await repoUpdateReviewRequest(env, review.id, {
    status: 'rejected',
    reviewerName: input?.reviewerName ?? review.reviewerName,
    rejectedAt: nowIso(),
    updatedAt: nowIso(),
  });

  const job = await repoGetJobById(env, review.jobId);

  if (job) {
    await logEvent(env, {
      jobId: job.id,
      employeeId: job.employeeId,
      actionName: job.actionName,
      eventType: 'review_rejected',
      eventPayload: {
        documentId: review.documentId,
        reviewerEmail: review.reviewerEmail,
      },
      status: 'error',
      message: `${review.reviewerEmail} rejected ${review.documentId}`,
    });
  }

  await syncDocumentAndJobStatus(env, review.jobId, review.documentId);

  return rejectedReview;
};
