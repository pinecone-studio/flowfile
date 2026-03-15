import { getEmployeeById } from '../employee/employee.service';
import {
  getActiveAction,
  parseDocuments,
  parseRecipients,
  type ActionDocumentConfig,
} from '../action/action.service';
import { logEvent } from '../audit/audit.service';
import { addGeneratedDocument } from '../document/document.service';
import {
  createJob,
  getJobById as repoGetJobById,
  listJobs as repoListJobs,
  updateJob,
} from './job.repository';

type EnvWithBindings = {
  DB: D1Database;
  EPAS_WEBHOOK_URL?: string;
};

type TriggerActionInput = {
  employeeId: string;
  actionName: string;
  triggerSource: string;
  dryRun?: boolean;
};

function nowIso() {
  return new Date().toISOString();
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
  const documents = parseDocuments(action) as ActionDocumentConfig[];
  const recipients = parseRecipients(action);

  const job = await createJob(env, {
    id: crypto.randomUUID(),
    employeeId: input.employeeId,
    actionName: input.actionName,
    triggerSource: input.triggerSource,
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
    },
    documents,
    recipients,
    status: 'success',
    message: 'Job created successfully',
  });

  try {
    await updateJob(env, job.id, {
      status: 'running',
      startedAt: nowIso(),
      updatedAt: nowIso(),
    });

    let generatedCount = 0;

    if (!input.dryRun) {
      for (let i = 0; i < documents.length; i += 1) {
        const doc = documents[i];

        await addGeneratedDocument(env, {
          jobId: job.id,
          employeeId: employee.id,
          actionName: action.actionName,
          documentType: doc.documentType ?? 'unknown',
          templateName: doc.templateName ?? 'unknown',
          fileName: doc.fileName ?? `${employee.id}-${i + 1}.pdf`,
          storagePath: doc.storagePath ?? `/generated/${job.id}/${i + 1}`,
          fileUrl: null,
          generationOrder: i + 1,
          status: 'generated',
        });

        generatedCount += 1;
      }
    }

    const completedJob = await updateJob(env, job.id, {
      status: input.dryRun ? 'dry_run_completed' : 'completed',
      documentsGenerated: generatedCount,
      completedAt: nowIso(),
      updatedAt: nowIso(),
    });

    await logEvent(env, {
      jobId: job.id,
      employeeId: employee.id,
      actionName: action.actionName,
      eventType: 'job_completed',
      documents,
      recipients,
      status: 'success',
      message: input.dryRun
        ? 'Dry run completed successfully'
        : 'Job completed successfully',
    });

    return completedJob;
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