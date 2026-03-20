import type { WorkflowRecipientInput } from '../workflow/workflow.service';

export type EnvWithBindings = {
  DB: D1Database;
  DOCS_BUCKET?: R2Bucket;
  APP_BASE_URL?: string;
  API_BASE_URL?: string;
  BREVO_API_KEY?: string;
  BREVO_FROM_EMAIL?: string;
  BREVO_FROM_NAME?: string;
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
