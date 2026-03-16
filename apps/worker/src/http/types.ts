export type AppEnv = {
  Bindings: {
    DB: D1Database;
    DOCS_BUCKET: R2Bucket;
    EPAS_WEBHOOK_URL?: string;
  };
};
