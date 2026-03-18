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

export async function emitWorkflowGenerationNotifications(
  env: EnvWithBindings,
  context: TriggerContext,
  job: JobRecord,
  activeJob: JobRecord | Awaited<ReturnType<typeof import('./job.repository').updateJob>>,
  createdDocuments: GeneratedDocumentRecord[],
  createdReviewRequests: ReviewRequestRecord[],
) {
  const generatedDocumentRecipients = await resolveGeneratedDocumentRecipients(
    env,
    context.employee,
    context.actionPayload,
    context.input.requestedByEmail,
  );

  await logEvent(env, {
    jobId: job.id,
    employeeId: context.employee.id,
    actionName: context.action.actionName,
    eventType: 'documents_generated',
    documents: createdDocuments,
    recipients: generatedDocumentRecipients,
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
    })),
    status: 'success',
    message: `${createdReviewRequests.length} review requests created`,
  });

  const documentNotifications = buildDocumentsGeneratedNotifications({
    job: activeJob ?? job,
    employee: context.employee,
    documents: createdDocuments,
    recipients: generatedDocumentRecipients,
    baseUrl: env.APP_BASE_URL,
  });
  await emitWorkflowNotifications(env, documentNotifications);

  const notifications = buildReviewNotifications({
    job: activeJob ?? job,
    documents: createdDocuments,
    reviewRequests: createdReviewRequests,
    baseUrl: env.APP_BASE_URL,
  });
  await emitWorkflowNotifications(env, notifications);
}
