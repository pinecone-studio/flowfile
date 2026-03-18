import {
  getActiveAction,
  parseDocuments,
  parseRecipients,
} from '../action/action.service';
import { logEvent } from '../audit/audit.service';
import { getEmployeeById } from '../employee/employee.service';
import {
  parseWorkflowPayload,
  resolveWorkflowRecipients,
} from '../workflow/workflow.service';
import { updateJob } from './job.repository';
import type { EnvWithBindings, TriggerActionInput } from './job.types';
import { nowIso } from './job.utils';
import { emitWorkflowGenerationNotifications } from './job.notifications';
import {
  completeDryRun,
  createPendingJob,
  generateWorkflowArtifacts,
  type TriggerContext,
} from './job.workflow';

async function resolveTriggerContext(
  env: EnvWithBindings,
  input: TriggerActionInput,
): Promise<TriggerContext> {
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

  return {
    employee,
    action,
    documents,
    actionPayload,
    workflowRecipients,
    input,
  };
}

async function logJobCreated(
  env: EnvWithBindings,
  context: TriggerContext,
  jobId: string,
) {
  await logEvent(env, {
    jobId,
    employeeId: context.employee.id,
    actionName: context.action.actionName,
    eventType: 'job_created',
    eventPayload: {
      triggerSource: context.input.triggerSource,
      dryRun: Boolean(context.input.dryRun),
      payload: context.actionPayload,
    },
    documents: context.documents,
    recipients: context.workflowRecipients,
    status: 'success',
    message: 'Job created successfully',
  });
}

export const triggerAction = async (
  env: EnvWithBindings,
  input: TriggerActionInput,
) => {
  const context = await resolveTriggerContext(env, input);
  const job = await createPendingJob(env, context);

  if (!job) {
    throw new Error('Failed to create job');
  }

  await logJobCreated(env, context, job.id);

  try {
    await updateJob(env, job.id, {
      status: 'running',
      startedAt: nowIso(),
      updatedAt: nowIso(),
    });

    if (input.dryRun) {
      return completeDryRun(env, context, job);
    }

    const { activeJob, createdDocuments, createdReviewRequests } =
      await generateWorkflowArtifacts(env, context, job);

    await emitWorkflowGenerationNotifications(
      env,
      context,
      job,
      activeJob,
      createdDocuments,
      createdReviewRequests,
    );

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
      employeeId: context.employee.id,
      actionName: context.action.actionName,
      eventType: 'job_failed',
      status: 'error',
      message: errorMessage,
    });

    throw error;
  }
};
