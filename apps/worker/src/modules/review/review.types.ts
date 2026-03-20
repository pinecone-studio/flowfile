export type EnvWithBindings = {
  DB: D1Database;
  DOCS_BUCKET?: R2Bucket;
  APP_BASE_URL?: string;
  API_BASE_URL?: string;
  BREVO_API_KEY?: string;
  BREVO_FROM_EMAIL?: string;
  BREVO_FROM_NAME?: string;
  EMAIL_WEBHOOK_URL?: string;
  MAILCHANNELS_API_URL?: string;
  MAILCHANNELS_API_KEY?: string;
  MAIL_FROM_EMAIL?: string;
  MAIL_FROM_NAME?: string;
  MAIL_REPLY_TO?: string;
};

export type ReviewWorkflowRecipientSource = {
  reviewerEmail: string;
  reviewerName: string | null;
  signerRole: string;
  signOrder: number;
};
