import { logEvent } from '../audit/audit.service';
import {
  addGeneratedDocument,
  storeGeneratedDocumentPdf,
  updateGeneratedDocument,
} from '../document/document.service';
import { createReviewRequest } from '../review/review.service';
import { getTemplateByName } from '../templates/templates.service';
import {
  buildDocumentFileUrl,
  buildWorkflowDocumentPdf,
  parseWorkflowPayload,
  resolveWorkflowRecipients,
} from '../workflow/workflow.service';
import { createJob, updateJob } from './job.repository';
import type { EnvWithBindings, TriggerActionInput } from './job.types';
import { buildStoragePath, nowIso } from './job.utils';

type EmployeeRecord = NonNullable<
  Awaited<ReturnType<typeof import('../employee/employee.service').getEmployeeById>>
>;
type ActionRecord = Awaited<
  ReturnType<typeof import('../action/action.service').getActiveAction>
>;
type DocumentConfig = ReturnType<
  typeof import('../action/action.service').parseDocuments
>[number];
type WorkflowPayload = ReturnType<typeof parseWorkflowPayload>;
type WorkflowRecipients = Awaited<ReturnType<typeof resolveWorkflowRecipients>>;
export type JobRecord = NonNullable<Awaited<ReturnType<typeof createJob>>>;
export type GeneratedDocumentRecord = NonNullable<
  Awaited<ReturnType<typeof addGeneratedDocument>>
>;
export type ReviewRequestRecord = NonNullable<
  Awaited<ReturnType<typeof createReviewRequest>>
>;

export type TriggerContext = {
  employee: EmployeeRecord;
  action: ActionRecord;
  documents: DocumentConfig[];
  actionPayload: WorkflowPayload;
  workflowRecipients: WorkflowRecipients;
  input: TriggerActionInput;
};

export async function createPendingJob(
  env: EnvWithBindings,
  context: TriggerContext,
) {
  return createJob(env, {
    id: crypto.randomUUID(),
    employeeId: context.input.employeeId,
    actionName: context.input.actionName,
    triggerSource: context.input.triggerSource,
    inputPayloadJson:
      Object.keys(context.actionPayload).length > 0
        ? JSON.stringify(context.actionPayload)
        : null,
    requestedByEmail: context.input.requestedByEmail ?? null,
    dryRun: Boolean(context.input.dryRun),
    status: 'pending',
    documentsExpected: context.documents.length,
    documentsGenerated: 0,
    errorMessage: null,
    startedAt: null,
    completedAt: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });
}

export async function completeDryRun(
  env: EnvWithBindings,
  context: TriggerContext,
  job: JobRecord,
) {
  const dryRunJob = await updateJob(env, job.id, {
    status: 'dry_run_completed',
    completedAt: nowIso(),
    updatedAt: nowIso(),
  });

  await logEvent(env, {
    jobId: job.id,
    employeeId: context.employee.id,
    actionName: context.action.actionName,
    eventType: 'job_completed',
    documents: context.documents,
    recipients: context.workflowRecipients,
    status: 'success',
    message: 'Dry run completed successfully',
  });

  return dryRunJob;
}

export async function generateWorkflowArtifacts(
  env: EnvWithBindings,
  context: TriggerContext,
  job: JobRecord,
) {
  const createdDocuments: GeneratedDocumentRecord[] = [];
  const createdReviewRequests: ReviewRequestRecord[] = [];

  for (const documentConfig of context.documents.sort(
    (left, right) => left.generationOrder - right.generationOrder,
  )) {
    const template = await getTemplateByName(env, documentConfig.templateName);
    const storagePath =
      documentConfig.storagePath ??
      buildStoragePath(
        job.id,
        documentConfig.generationOrder,
        documentConfig.fileName,
      );
    const pdfBytes = buildWorkflowDocumentPdf({
      documentType: documentConfig.documentType,
      actionName: context.action.actionName,
      employee: context.employee,
      payload: context.actionPayload,
      recipients: context.workflowRecipients,
      status: 'awaiting_signatures',
      templateHtml: template?.htmlContent ?? null,
    });

    const document = await addGeneratedDocument(env, {
      jobId: job.id,
      employeeId: context.employee.id,
      actionName: context.action.actionName,
      documentType: documentConfig.documentType,
      templateName: documentConfig.templateName,
      fileName: documentConfig.fileName,
      storagePath,
      fileUrl: null,
      generationOrder: documentConfig.generationOrder,
      status: 'awaiting_signatures',
    });

    if (!document) {
      throw new Error(
        `Failed to create generated document for ${documentConfig.documentType}`,
      );
    }

    await storeGeneratedDocumentPdf(env, storagePath, pdfBytes);

    const updatedDocument = await updateGeneratedDocument(env, document.id, {
      fileUrl: buildDocumentFileUrl(document.id),
    });

    createdDocuments.push(updatedDocument ?? document);

    for (const recipient of context.workflowRecipients) {
      const reviewRequest = await createReviewRequest(env, {
        jobId: job.id,
        documentId: document.id,
        reviewerEmail: recipient.email,
        reviewerName: recipient.name,
        signerRole: recipient.role,
        signOrder: recipient.signOrder,
      });

      if (reviewRequest) {
        createdReviewRequests.push(reviewRequest);
      }
    }
  }

  const activeJob = await updateJob(env, job.id, {
    status: 'awaiting_signatures',
    documentsGenerated: createdDocuments.length,
    updatedAt: nowIso(),
  });

  return {
    activeJob,
    createdDocuments,
    createdReviewRequests,
  };
}
