import { logEvent } from '../audit/audit.service';
import {
  getGeneratedDocumentById,
  getGeneratedDocuments,
  storeGeneratedDocumentPdf,
  updateGeneratedDocument,
} from '../document/document.service';
import { getEmployeeById } from '../employee/employee.service';
import { getJobById as repoGetJobById, updateJob } from '../job/job.repository';
import { getTemplateByName } from '../templates/templates.service';
import {
  buildCompletionNotifications,
  buildDocumentFileUrl,
  buildWorkflowDocumentPdf,
  emitWorkflowNotifications,
  parseWorkflowPayload,
  resolveGeneratedDocumentRecipients,
} from '../workflow/workflow.service';
import { listReviewRequests as repoListReviewRequests } from './review.repository';
import type { EnvWithBindings } from './review.types';
import { nowIso, reviewsToWorkflowRecipients } from './review.utils';

function dedupeRecipients<T extends { email: string; role: string }>(recipients: T[]) {
  return recipients.filter(
    (recipient, index, current) =>
      current.findIndex(
        (candidate) =>
          candidate.email === recipient.email && candidate.role === recipient.role,
      ) === index,
  );
}

export async function syncDocumentAndJobStatus(
  env: EnvWithBindings,
  jobId: string,
  documentId: string,
) {
  const job = await repoGetJobById(env, jobId);
  const document = await getGeneratedDocumentById(env, documentId);

  if (!job || !document) {
    return;
  }

  const employee = await getEmployeeById(env, job.employeeId);

  if (!employee) {
    throw new Error(`Employee not found: ${job.employeeId}`);
  }

  const payload = parseWorkflowPayload(
    job.inputPayloadJson ? JSON.parse(job.inputPayloadJson) : {},
  );
  const documentReviews = await repoListReviewRequests(env, { documentId });
  const allDocumentApproved =
    documentReviews.length > 0 &&
    documentReviews.every((review) => review.status === 'approved');
  const anyDocumentRejected = documentReviews.some(
    (review) => review.status === 'rejected',
  );
  const documentStatus = anyDocumentRejected
    ? 'rejected'
    : allDocumentApproved
      ? 'completed'
      : documentReviews.some((review) => review.status === 'approved')
        ? 'partially_signed'
        : 'awaiting_signatures';
  const workflowRecipients = reviewsToWorkflowRecipients(documentReviews);
  const template = await getTemplateByName(env, document.templateName);
  const approvalSummary = documentReviews.map((review) => ({
    reviewerEmail: review.reviewerEmail,
    reviewerName: review.reviewerName,
    approvedAt: review.approvedAt,
    signMethod: review.signMethod,
  }));
  const pdfBytes = buildWorkflowDocumentPdf({
    documentType: document.documentType,
    actionName: job.actionName,
    employee,
    payload,
    recipients: workflowRecipients,
    status: documentStatus,
    templateHtml: template?.htmlContent ?? null,
    approvalSummary,
  });
  const approvedReviews = documentReviews.filter(
    (review) => review.status === 'approved',
  );
  const lastSignedReview = [...approvedReviews]
    .reverse()
    .find((review) => Boolean(review.signatureImageUrl));

  await storeGeneratedDocumentPdf(env, document.storagePath, pdfBytes);
  await updateGeneratedDocument(env, document.id, {
    status: documentStatus,
    fileUrl: buildDocumentFileUrl(document.id),
    signedBy: approvedReviews.map((review) => review.reviewerEmail).join(', ') || null,
    signedAt: allDocumentApproved ? nowIso() : null,
    signMethod:
      approvedReviews.map((review) => review.signMethod).filter(Boolean).join(', ') ||
      null,
    signatureImageUrl: lastSignedReview?.signatureImageUrl ?? null,
    finalizedAt: allDocumentApproved ? nowIso() : null,
  });

  if (allDocumentApproved && document.status !== 'completed') {
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
  }

  const jobReviews = await repoListReviewRequests(env, { jobId });
  const allJobApproved =
    jobReviews.length > 0 &&
    jobReviews.every((review) => review.status === 'approved');
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
    const signerRecipients = dedupeRecipients(
      reviewsToWorkflowRecipients(
        jobReviews.map((review) => ({
          reviewerEmail: review.reviewerEmail,
          reviewerName: review.reviewerName,
          signerRole: review.signerRole,
          signOrder: review.signOrder,
        })),
      ),
    );
    const generatedRecipients = await resolveGeneratedDocumentRecipients(
      env,
      employee,
      payload,
      job.requestedByEmail ?? undefined,
    );
    const completionRecipients = dedupeRecipients([
      ...signerRecipients,
      ...generatedRecipients,
    ]);

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
      recipients: completionRecipients,
      status: 'success',
      message: 'All signatures completed',
    });

    const notifications = buildCompletionNotifications({
      job,
      documents,
      recipients: completionRecipients,
      baseUrl: env.APP_BASE_URL,
    });
    await emitWorkflowNotifications(env, notifications);
  } else if (
    !allJobApproved &&
    !anyJobRejected &&
    job.status !== 'awaiting_signatures'
  ) {
    await updateJob(env, job.id, {
      status: 'awaiting_signatures',
      updatedAt: nowIso(),
    });
  }
}
