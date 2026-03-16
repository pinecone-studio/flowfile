import { getEmployeeById } from '../employee/employee.service';
import {
  getActiveAction,
  parseDocuments,
  parseRecipients,
} from '../action/action.service';
import { logEvent } from '../audit/audit.service';
import {
  addGeneratedDocument,
  getGeneratedDocuments,
  storeGeneratedDocumentHtml,
  updateGeneratedDocument,
} from '../document/document.service';
import { createReviewRequest, getReviewRequests } from '../review/review.service';
import { getTemplateByName } from '../templates/templates.service';
import {
  buildDocumentFileUrl,
  buildReviewNotifications,
  buildWorkflowDocumentHtml,
  emitWorkflowNotifications,
  parseWorkflowPayload,
  resolveWorkflowRecipients,
  type WorkflowRecipientInput,
} from '../workflow/workflow.service';
import {
  createJob,
  getJobById as repoGetJobById,
  listJobs as repoListJobs,
  updateJob,
} from './job.repository';

type EnvWithBindings = {
  DB: D1Database;
  DOCS_BUCKET?: R2Bucket;
  EPAS_WEBHOOK_URL?: string;
};

type TriggerActionInput = {
  employeeId: string;
  actionName: string;
  triggerSource: string;
  dryRun?: boolean;
  actionPayload?: Record<string, unknown>;
  requestedByEmail?: string;
  overrideRecipients?: WorkflowRecipientInput[];
};

function nowIso() {
  return new Date().toISOString();
}

function buildStoragePath(jobId: string, generationOrder: number, fileName: string) {
  return `jobs/${jobId}/${String(generationOrder).padStart(2, '0')}-${fileName}`;
}

export const getAllJobs = async (env: EnvWithBindings) => {
  return repoListJobs(env);
};

export const getJob = async (env: EnvWithBindings, id: string) => {
  return repoGetJobById(env, id);
};

export const triggerAction = async (
  env: EnvWithBindings,
  input: TriggerActionInput,
) => {
  const employee = await getEmployeeById(env, input.employeeId);

  if (!employee) {
    throw new Error(`Employee not found: ${input.employeeId}`);
  }

  const action = await getActiveAction(env, input.actionName);
  const documents = parseDocuments(action);
  const recipientRoleKeys = parseRecipients(action);
  const actionPayload = parseWorkflowPayload(input.actionPayload);
  const workflowRecipients = await resolveWorkflowRecipients(
    env,
    employee,
    recipientRoleKeys,
    actionPayload,
    input.requestedByEmail,
    input.overrideRecipients,
  );

  if (!input.dryRun && workflowRecipients.length === 0) {
    throw new Error('No signer recipients could be resolved for this workflow');
  }

  const job = await createJob(env, {
    id: crypto.randomUUID(),
    employeeId: input.employeeId,
    actionName: input.actionName,
    triggerSource: input.triggerSource,
    inputPayloadJson:
      Object.keys(actionPayload).length > 0 ? JSON.stringify(actionPayload) : null,
    requestedByEmail: input.requestedByEmail ?? null,
    dryRun: Boolean(input.dryRun),
    status: 'pending',
    documentsExpected: documents.length,
    documentsGenerated: 0,
    errorMessage: null,
    startedAt: null,
    completedAt: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });

  if (!job) {
    throw new Error('Failed to create job');
  }

  await logEvent(env, {
    jobId: job.id,
    employeeId: employee.id,
    actionName: action.actionName,
    eventType: 'job_created',
    eventPayload: {
      triggerSource: input.triggerSource,
      dryRun: Boolean(input.dryRun),
      payload: actionPayload,
    },
    documents,
    recipients: workflowRecipients,
    status: 'success',
    message: 'Job created successfully',
  });

  try {
    await updateJob(env, job.id, {
      status: 'running',
      startedAt: nowIso(),
      updatedAt: nowIso(),
    });

    if (input.dryRun) {
      const dryRunJob = await updateJob(env, job.id, {
        status: 'dry_run_completed',
        completedAt: nowIso(),
        updatedAt: nowIso(),
      });

      await logEvent(env, {
        jobId: job.id,
        employeeId: employee.id,
        actionName: action.actionName,
        eventType: 'job_completed',
        documents,
        recipients: workflowRecipients,
        status: 'success',
        message: 'Dry run completed successfully',
      });

      return dryRunJob;
    }

    const createdDocuments: Array<
      NonNullable<Awaited<ReturnType<typeof addGeneratedDocument>>>
    > = [];
    const createdReviewRequests: Array<
      NonNullable<Awaited<ReturnType<typeof createReviewRequest>>>
    > = [];

    for (const documentConfig of documents.sort(
      (left, right) => left.generationOrder - right.generationOrder,
    )) {
      const template = await getTemplateByName(env, documentConfig.templateName);
      const storagePath =
        documentConfig.storagePath ??
        buildStoragePath(job.id, documentConfig.generationOrder, documentConfig.fileName);
      const htmlContent = buildWorkflowDocumentHtml({
        documentType: documentConfig.documentType,
        actionName: action.actionName,
        employee,
        payload: actionPayload,
        recipients: workflowRecipients,
        status: 'awaiting_signatures',
        templateHtml: template?.htmlContent ?? null,
      });

      const document = await addGeneratedDocument(env, {
        jobId: job.id,
        employeeId: employee.id,
        actionName: action.actionName,
        documentType: documentConfig.documentType,
        templateName: documentConfig.templateName,
        fileName: documentConfig.fileName,
        storagePath,
        fileUrl: null,
        generationOrder: documentConfig.generationOrder,
        status: 'awaiting_signatures',
      });

      if (!document) {
        throw new Error(`Failed to create generated document for ${documentConfig.documentType}`);
      }

      await storeGeneratedDocumentHtml(env, storagePath, htmlContent);

      const updatedDocument = await updateGeneratedDocument(env, document.id, {
        fileUrl: buildDocumentFileUrl(document.id),
      });

      createdDocuments.push(updatedDocument ?? document);

      for (const recipient of workflowRecipients) {
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

    await logEvent(env, {
      jobId: job.id,
      employeeId: employee.id,
      actionName: action.actionName,
      eventType: 'documents_generated',
      documents: createdDocuments,
      recipients: workflowRecipients,
      status: 'success',
      message: `${createdDocuments.length} documents generated`,
    });

    await logEvent(env, {
      jobId: job.id,
      employeeId: employee.id,
      actionName: action.actionName,
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

    const notifications = buildReviewNotifications({
      job: activeJob ?? job,
      documents: createdDocuments,
      reviewRequests: createdReviewRequests,
    });
    emitWorkflowNotifications(notifications);

    return activeJob;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    await updateJob(env, job.id, {
      status: 'failed',
      errorMessage,
      completedAt: nowIso(),
      updatedAt: nowIso(),
    });

    await logEvent(env, {
      jobId: job.id,
      employeeId: employee.id,
      actionName: action.actionName,
      eventType: 'job_failed',
      status: 'error',
      message: errorMessage,
    });

    throw error;
  }
};

export const getWorkflowSnapshot = async (env: EnvWithBindings, jobId: string) => {
  const [job, documents, reviewRequests] = await Promise.all([
    repoGetJobById(env, jobId),
    getGeneratedDocuments(env, { jobId }),
    getReviewRequests(env, { jobId }),
  ]);

  return {
    job,
    documents,
    reviewRequests,
  };
};
