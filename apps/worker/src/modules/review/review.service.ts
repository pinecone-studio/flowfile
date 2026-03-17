import { logEvent } from '../audit/audit.service';
import { getGeneratedDocumentById, getGeneratedDocuments, storeGeneratedDocumentHtml, updateGeneratedDocument } from '../document/document.service';
import { getEmployeeById } from '../employee/employee.service';
import { getJobById as repoGetJobById, updateJob } from '../job/job.repository';
import { getTemplateByName } from '../templates/templates.service';
import {
  buildCompletionNotifications,
  buildDocumentFileUrl,
  buildWorkflowDocumentHtml,
  emitWorkflowNotifications,
  parseWorkflowPayload,
  type WorkflowRecipient,
} from '../workflow/workflow.service';
import {
  createReviewRequest as repoCreateReviewRequest,
  getReviewRequestByToken as repoGetReviewRequestByToken,
  listReviewRequests as repoListReviewRequests,
  updateReviewRequest as repoUpdateReviewRequest,
} from './review.repository';

type EnvWithBindings = {
  DB: D1Database;
  DOCS_BUCKET?: R2Bucket;
  APP_BASE_URL?: string;
  EMAIL_WEBHOOK_URL?: string;
  MAILCHANNELS_API_URL?: string;
  MAIL_FROM_EMAIL?: string;
  MAIL_FROM_NAME?: string;
  MAIL_REPLY_TO?: string;
};

function nowIso() {
  return new Date().toISOString();
}

function reviewsToWorkflowRecipients(
  reviews: Array<{
    reviewerEmail: string;
    reviewerName: string | null;
    signerRole: string;
    signOrder: number;
  }>,
): WorkflowRecipient[] {
  return reviews.map((review) => ({
    email: review.reviewerEmail,
    name: review.reviewerName,
    role: review.signerRole,
    signOrder: review.signOrder,
  }));
}

async function syncDocumentAndJobStatus(
  env: EnvWithBindings,
  jobId: string,
  documentId: string,
) {
  const job = await repoGetJobById(env, jobId);
  const document = await getGeneratedDocumentById(env, documentId);

  if (!job || !document) {
    return;
  }

  const documentReviews = await repoListReviewRequests(env, { documentId });
  const allDocumentApproved =
    documentReviews.length > 0 &&
    documentReviews.every((review) => review.status === 'approved');
  const anyDocumentRejected = documentReviews.some(
    (review) => review.status === 'rejected',
  );

  if (anyDocumentRejected && document.status !== 'rejected') {
    await updateGeneratedDocument(env, document.id, {
      status: 'rejected',
    });
  }

  if (allDocumentApproved && document.status !== 'completed') {
    const employee = await getEmployeeById(env, job.employeeId);

    if (!employee) {
      throw new Error(`Employee not found: ${job.employeeId}`);
    }

    const template = await getTemplateByName(env, document.templateName);
    const workflowRecipients = reviewsToWorkflowRecipients(documentReviews);
    const payload = parseWorkflowPayload(
      job.inputPayloadJson ? JSON.parse(job.inputPayloadJson) : {},
    );
    const finalizedAt = nowIso();
    const htmlContent = buildWorkflowDocumentHtml({
      documentType: document.documentType,
      actionName: job.actionName,
      employee,
      payload,
      recipients: workflowRecipients,
      status: 'completed',
      templateHtml: template?.htmlContent ?? null,
      approvalSummary: documentReviews.map((review) => ({
        reviewerEmail: review.reviewerEmail,
        reviewerName: review.reviewerName,
        approvedAt: review.approvedAt,
        signMethod: review.signMethod,
      })),
    });

    await storeGeneratedDocumentHtml(env, document.storagePath, htmlContent);
    const lastSignedReview = [...documentReviews]
      .reverse()
      .find((review) => Boolean(review.signatureImageUrl));

    await updateGeneratedDocument(env, document.id, {
      status: 'completed',
      fileUrl: buildDocumentFileUrl(document.id),
      signedBy: documentReviews.map((review) => review.reviewerEmail).join(', '),
      signedAt: finalizedAt,
      signMethod: documentReviews
        .map((review) => review.signMethod)
        .filter(Boolean)
        .join(', '),
      signatureImageUrl: lastSignedReview?.signatureImageUrl ?? null,
      finalizedAt,
    });

    await logEvent(env, {
      jobId: job.id,
      employeeId: job.employeeId,
      actionName: job.actionName,
      eventType: 'document_completed',
      eventPayload: {
        documentId: document.id,
        documentType: document.documentType,
      },
      status: 'success',
      message: `${document.documentType} completed`,
    });
  } else if (!allDocumentApproved && !anyDocumentRejected) {
    const nextStatus = documentReviews.some((review) => review.status === 'approved')
      ? 'partially_signed'
      : 'awaiting_signatures';

    if (document.status !== nextStatus) {
      await updateGeneratedDocument(env, document.id, {
        status: nextStatus,
      });
    }
  }

  const jobReviews = await repoListReviewRequests(env, { jobId });
  const allJobApproved =
    jobReviews.length > 0 && jobReviews.every((review) => review.status === 'approved');
  const anyJobRejected = jobReviews.some((review) => review.status === 'rejected');

  if (anyJobRejected && job.status !== 'rejected') {
    await updateJob(env, job.id, {
      status: 'rejected',
      completedAt: nowIso(),
      updatedAt: nowIso(),
    });

    await logEvent(env, {
      jobId: job.id,
      employeeId: job.employeeId,
      actionName: job.actionName,
      eventType: 'job_rejected',
      status: 'error',
      message: 'A signer rejected the workflow',
    });
    return;
  }

  if (allJobApproved && job.status !== 'completed') {
    const finalizedAt = nowIso();
    const documents = await getGeneratedDocuments(env, { jobId });
    const recipients = reviewsToWorkflowRecipients(
      jobReviews.filter(
        (review, index, current) =>
          current.findIndex(
            (candidate) =>
              candidate.reviewerEmail === review.reviewerEmail &&
              candidate.signerRole === review.signerRole,
          ) === index,
      ),
    );

    await updateJob(env, job.id, {
      status: 'completed',
      documentsGenerated: documents.length,
      completedAt: finalizedAt,
      updatedAt: finalizedAt,
    });

    await logEvent(env, {
      jobId: job.id,
      employeeId: job.employeeId,
      actionName: job.actionName,
      eventType: 'job_completed',
      documents,
      recipients,
      status: 'success',
      message: 'All signatures completed',
    });

    const notifications = buildCompletionNotifications({
      job,
      documents,
      recipients,
      baseUrl: env.APP_BASE_URL,
    });
    await emitWorkflowNotifications(env, notifications);
  } else if (!allJobApproved && !anyJobRejected && job.status !== 'awaiting_signatures') {
    await updateJob(env, job.id, {
      status: 'awaiting_signatures',
      updatedAt: nowIso(),
    });
  }
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
