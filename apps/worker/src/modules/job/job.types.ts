import type { WorkflowRecipientInput } from '../workflow/workflow.service';

export type EnvWithBindings = {
  DB: D1Database;
  DOCS_BUCKET?: R2Bucket;
  APP_BASE_URL?: string;
  EMAIL_WEBHOOK_URL?: string;
  MAILCHANNELS_API_URL?: string;
  MAIL_FROM_EMAIL?: string;
  MAIL_FROM_NAME?: string;
  MAIL_REPLY_TO?: string;
  EPAS_WEBHOOK_URL?: string;
};

export type TriggerActionInput = {
  employeeId: string;
  actionName: string;
  triggerSource: string;
  dryRun?: boolean;
  actionPayload?: Record<string, unknown>;
  requestedByEmail?: string;
  overrideRecipients?: WorkflowRecipientInput[];
};
