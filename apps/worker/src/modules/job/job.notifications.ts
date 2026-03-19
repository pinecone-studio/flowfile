import { logEvent } from '../audit/audit.service';
import {
  buildDocumentsGeneratedNotifications,
  buildReviewNotifications,
  emitWorkflowNotifications,
  resolveGeneratedDocumentRecipients,
} from '../workflow/workflow.service';
import type { EnvWithBindings } from './job.types';
import type {
  GeneratedDocumentRecord,
  JobRecord,
  ReviewRequestRecord,
  TriggerContext,
} from './job.workflow';

function getInitialReviewRequests(reviewRequests: ReviewRequestRecord[]) {
  const minOrderByDocument = new Map<string, number>();

  for (const reviewRequest of reviewRequests) {
    const current = minOrderByDocument.get(reviewRequest.documentId);
    if (current == null || reviewRequest.signOrder < current) {
      minOrderByDocument.set(reviewRequest.documentId, reviewRequest.signOrder);
    }
  }

  return reviewRequests.filter(
    (reviewRequest) =>
      minOrderByDocument.get(reviewRequest.documentId) === reviewRequest.signOrder,
  );
}

export async function emitWorkflowGenerationNotifications(
  env: EnvWithBindings,
  context: TriggerContext,
  job: JobRecord,
  activeJob: JobRecord | Awaited<ReturnType<typeof import('./job.repository').updateJob>>,
  createdDocuments: GeneratedDocumentRecord[],
  createdReviewRequests: ReviewRequestRecord[],
) {
  await logEvent(env, {
    jobId: job.id,
    employeeId: context.employee.id,
    actionName: context.action.actionName,
    eventType: 'documents_generated',
    documents: createdDocuments,
    recipients: context.workflowRecipients,
    status: 'success',
    message: `${createdDocuments.length} documents generated`,
  });

  await logEvent(env, {
    jobId: job.id,
    employeeId: context.employee.id,
    actionName: context.action.actionName,
    eventType: 'review_requests_created',
    eventPayload: createdReviewRequests.map((reviewRequest) => ({
      id: reviewRequest.id,
      documentId: reviewRequest.documentId,
      reviewerEmail: reviewRequest.reviewerEmail,
      signerRole: reviewRequest.signerRole,
      signOrder: reviewRequest.signOrder,
    })),
    status: 'success',
    message: `${createdReviewRequests.length} review requests created`,
  });

  const generatedRecipients = await resolveGeneratedDocumentRecipients(
    env,
    context.employee,
    context.actionPayload,
    context.input.requestedByEmail,
  );
  const initialReviewRequests = getInitialReviewRequests(createdReviewRequests);
  const notifications = [
    ...buildDocumentsGeneratedNotifications({
      job: activeJob ?? job,
      employee: context.employee,
      documents: createdDocuments,
      recipients: generatedRecipients,
      baseUrl: env.APP_BASE_URL,
    }),
    ...buildReviewNotifications({
      job: activeJob ?? job,
      documents: createdDocuments,
      reviewRequests: initialReviewRequests,
      baseUrl: env.APP_BASE_URL,
    }),
  ];
  await emitWorkflowNotifications(env, notifications);
}
