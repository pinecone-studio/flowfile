export type AppEnv = {
  Bindings: {
    DB: D1Database;
    DOCS_BUCKET: R2Bucket;
    APP_BASE_URL?: string;
    API_BASE_URL?: string;
    BREVO_API_KEY?: string;
    BREVO_FROM_EMAIL?: string;
    BREVO_FROM_NAME?: string;
    EMAIL_WEBHOOK_URL?: string;
    EPAS_WEBHOOK_URL?: string;
    MAILCHANNELS_API_URL?: string;
    MAILCHANNELS_API_KEY?: string;
    MAIL_FROM_EMAIL?: string;
    MAIL_FROM_NAME?: string;
    MAIL_REPLY_TO?: string;

    CLERK_SECRET_KEY?: string;
    CLERK_JWT_KEY?: string;
    CLERK_AUTHORIZED_PARTIES?: string;
  };
};
