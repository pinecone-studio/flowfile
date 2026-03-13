CREATE TABLE IF NOT EXISTS action_registry (
  action_name TEXT PRIMARY KEY,
  phase TEXT NOT NULL,
  trigger_fields_json TEXT NOT NULL,
  trigger_condition TEXT,
  documents_json TEXT NOT NULL,
  recipients_json TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS recipients (
  id TEXT PRIMARY KEY,
  role_key TEXT NOT NULL,
  recipient_name TEXT,
  recipient_email TEXT NOT NULL,
  department TEXT,
  branch TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  action_name TEXT NOT NULL,
  trigger_source TEXT NOT NULL,
  dry_run INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  documents_expected INTEGER NOT NULL DEFAULT 0,
  documents_generated INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  started_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS generated_documents (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  action_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  template_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_url TEXT,
  generation_order INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  job_id TEXT,
  employee_id TEXT NOT NULL,
  action_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_payload_json TEXT,
  changed_fields_json TEXT,
  documents_json TEXT,
  recipients_json TEXT,
  status TEXT NOT NULL,
  message TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_recipients_role_key
ON recipients(role_key);

CREATE INDEX IF NOT EXISTS idx_jobs_employee_id
ON jobs(employee_id);

CREATE INDEX IF NOT EXISTS idx_jobs_action_name
ON jobs(action_name);

CREATE INDEX IF NOT EXISTS idx_generated_documents_job_id
ON generated_documents(job_id);

CREATE INDEX IF NOT EXISTS idx_generated_documents_employee_id
ON generated_documents(employee_id);

CREATE INDEX IF NOT EXISTS idx_audit_log_job_id
ON audit_log(job_id);

CREATE INDEX IF NOT EXISTS idx_audit_log_employee_id
ON audit_log(employee_id);

CREATE INDEX IF NOT EXISTS idx_audit_log_action_name
ON audit_log(action_name);