ALTER TABLE jobs ADD COLUMN input_payload_json TEXT;
ALTER TABLE jobs ADD COLUMN requested_by_email TEXT;

ALTER TABLE generated_documents ADD COLUMN signature_image_url TEXT;
ALTER TABLE generated_documents ADD COLUMN sign_method TEXT;
ALTER TABLE generated_documents ADD COLUMN signed_by TEXT;
ALTER TABLE generated_documents ADD COLUMN signed_at TEXT;
ALTER TABLE generated_documents ADD COLUMN finalized_at TEXT;

CREATE TABLE IF NOT EXISTS templates (
  name TEXT PRIMARY KEY,
  html_content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS review_requests (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  document_id TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  reviewer_name TEXT,
  signer_role TEXT NOT NULL,
  sign_order INTEGER NOT NULL DEFAULT 1,
  review_token TEXT NOT NULL,
  status TEXT NOT NULL,
  opened_at TEXT,
  approved_at TEXT,
  rejected_at TEXT,
  signature_image_url TEXT,
  sign_method TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_review_requests_job_id
ON review_requests(job_id);

CREATE INDEX IF NOT EXISTS idx_review_requests_document_id
ON review_requests(document_id);

CREATE INDEX IF NOT EXISTS idx_review_requests_review_token
ON review_requests(review_token);
