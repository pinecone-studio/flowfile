import {
  createAuditLog,
  listAuditLogs as repoListAuditLogs,
} from './audit.repository';

type EnvWithDb = { DB: D1Database };

type LogEventInput = {
  jobId?: string | null;
  employeeId: string;
  actionName: string;
  eventType: string;
  eventPayload?: unknown;
  changedFields?: unknown;
  documents?: unknown;
  recipients?: unknown;
  status: string;
  message?: string | null;
};

export const getAuditLogs = async (
  env: EnvWithDb,
  filters?: {
    employeeId?: string;
    actionName?: string;
    jobId?: string;
  },
) => {
  return repoListAuditLogs(env, filters);
};

export const logEvent = async (env: EnvWithDb, input: LogEventInput) => {
  return createAuditLog(env, {
    id: crypto.randomUUID(),
    jobId: input.jobId ?? null,
    employeeId: input.employeeId,
    actionName: input.actionName,
    eventType: input.eventType,
    eventPayloadJson: input.eventPayload
      ? JSON.stringify(input.eventPayload)
      : null,
    changedFieldsJson: input.changedFields
      ? JSON.stringify(input.changedFields)
      : null,
    documentsJson: input.documents ? JSON.stringify(input.documents) : null,
    recipientsJson: input.recipients ? JSON.stringify(input.recipients) : null,
    status: input.status,
    message: input.message ?? null,
    createdAt: new Date().toISOString(),
  });
};