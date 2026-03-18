export type EnvWithBindings = {
  DB: D1Database;
  DOCS_BUCKET?: R2Bucket;
  APP_BASE_URL?: string;
  EMAIL_WEBHOOK_URL?: string;
  MAILCHANNELS_API_URL?: string;
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
