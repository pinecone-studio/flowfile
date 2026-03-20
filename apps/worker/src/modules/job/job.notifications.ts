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
      minOrderByDocument.get(reviewRequest.documentId) ===
      reviewRequest.signOrder,
  );
}

export async function emitWorkflowGenerationNotifications(
  env: EnvWithBindings,
  context: TriggerContext,
  job: JobRecord,
  activeJob:
    | JobRecord
    | Awaited<ReturnType<typeof import('./job.repository').updateJob>>,
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
      apiBaseUrl: env.API_BASE_URL ?? env.APP_BASE_URL,
    }),
    ...buildReviewNotifications({
      job: activeJob ?? job,
      documents: createdDocuments,
      reviewRequests: initialReviewRequests,
      appBaseUrl: env.APP_BASE_URL,
      apiBaseUrl: env.API_BASE_URL ?? env.APP_BASE_URL,
    }),
  ];
  const deliveries = await emitWorkflowNotifications(env, notifications);
  const employeeGeneratedRecipient = generatedRecipients.find(
    (recipient) => recipient.role === 'employee',
  );
  const failedEmployeeGeneratedDelivery =
    employeeGeneratedRecipient == null
      ? null
      : (deliveries.find(
          (delivery) =>
            delivery.type === 'documents_generated' &&
            delivery.status !== 'sent' &&
            delivery.to.toLowerCase() ===
              employeeGeneratedRecipient.email.toLowerCase(),
        ) ?? null);
  const failedReviewDeliveries = deliveries.filter(
    (delivery) =>
      delivery.type === 'review_request' && delivery.status !== 'sent',
  );

  if (failedEmployeeGeneratedDelivery) {
    throw new Error(
      `Failed to send generated document email to ${failedEmployeeGeneratedDelivery.to}. ${failedEmployeeGeneratedDelivery.errorMessage ?? 'Email delivery failed.'}`,
    );
  }

  if (failedReviewDeliveries.length > 0) {
    const firstFailure = failedReviewDeliveries[0];

    throw new Error(
      `Failed to send sign request email to ${firstFailure.to}. ${firstFailure.errorMessage ?? 'Email delivery failed.'}`,
    );
  }
}
