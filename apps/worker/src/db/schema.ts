import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const actionRegistry = sqliteTable('action_registry', {
  actionName: text('action_name').primaryKey(),
  phase: text('phase').notNull(),
  triggerFieldsJson: text('trigger_fields_json').notNull(),
  triggerCondition: text('trigger_condition'),
  documentsJson: text('documents_json').notNull(),
  recipientsJson: text('recipients_json').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const recipients = sqliteTable('recipients', {
  id: text('id').primaryKey(),
  roleKey: text('role_key').notNull(),
  recipientName: text('recipient_name'),
  recipientEmail: text('recipient_email').notNull(),
  department: text('department'),
  branch: text('branch'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const jobs = sqliteTable('jobs', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  actionName: text('action_name').notNull(),
  triggerSource: text('trigger_source').notNull(),
  dryRun: integer('dry_run', { mode: 'boolean' }).notNull().default(false),
  status: text('status').notNull(),
  documentsExpected: integer('documents_expected').notNull().default(0),
  documentsGenerated: integer('documents_generated').notNull().default(0),
  errorMessage: text('error_message'),
  startedAt: text('started_at'),
  completedAt: text('completed_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const generatedDocuments = sqliteTable('generated_documents', {
  id: text('id').primaryKey(),
  jobId: text('job_id').notNull(),
  employeeId: text('employee_id').notNull(),
  actionName: text('action_name').notNull(),
  documentType: text('document_type').notNull(),
  templateName: text('template_name').notNull(),
  fileName: text('file_name').notNull(),
  storagePath: text('storage_path').notNull(),
  fileUrl: text('file_url'),
  generationOrder: integer('generation_order').notNull(),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
});

export const auditLog = sqliteTable('audit_log', {
  id: text('id').primaryKey(),
  jobId: text('job_id'),
  employeeId: text('employee_id').notNull(),
  actionName: text('action_name').notNull(),
  eventType: text('event_type').notNull(),
  eventPayloadJson: text('event_payload_json'),
  changedFieldsJson: text('changed_fields_json'),
  documentsJson: text('documents_json'),
  recipientsJson: text('recipients_json'),
  status: text('status').notNull(),
  message: text('message'),
  createdAt: text('created_at').notNull(),
});
