import { getAllRecipients } from '../action/action.service';

export type EnvWithDb = {
  DB: D1Database;
  APP_BASE_URL?: string;
  EMAIL_WEBHOOK_URL?: string;
  MAILCHANNELS_API_URL?: string;
  MAIL_FROM_EMAIL?: string;
  MAIL_FROM_NAME?: string;
  MAIL_REPLY_TO?: string;
};

export type EmployeeLike = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  department: string | null;
  branch: string | null;
};

export type RecipientRecord = Awaited<ReturnType<typeof getAllRecipients>>[number];

export type WorkflowPayload = Record<string, unknown>;

export type WorkflowRecipientInput = {
  email: string;
  name?: string;
  role?: string;
  signOrder?: number;
};

export type WorkflowRecipient = {
  email: string;
  name: string | null;
  role: string;
  signOrder: number;
};

export type ReviewRequestLike = {
  id: string;
  reviewToken: string;
  reviewerEmail: string;
  reviewerName: string | null;
  signerRole: string;
  documentId: string;
  expiresAt?: string | null;
  usedAt?: string | null;
};

export type DocumentLike = {
  id: string;
  fileName: string;
  fileUrl?: string | null;
  documentType: string;
  actionName: string;
};

export type JobLike = {
  id: string;
  actionName: string;
};

export type WorkflowNotification = {
  type: 'review_request' | 'documents_generated' | 'workflow_completed';
  to: string;
  subject: string;
  text: string;
  html: string;
  metadata?: Record<string, unknown>;
};
