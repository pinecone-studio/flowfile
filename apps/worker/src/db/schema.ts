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
  signatureImageUrl: text('signature_image_url'),
  signMethod: text('sign_method'),
  signedBy: text('signed_by'),
  signedAt: text('signed_at'),
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

export const employees = sqliteTable('employees', {
  id: text('id').primaryKey(),
  entraId: text('entra_id'),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  firstNameEng: text('first_name_eng'),
  lastNameEng: text('last_name_eng'),
  email: text('email'),
  imageUrl: text('image_url'),
  hireDate: text('hire_date'),
  numberOfVacationDays: integer('number_of_vacation_days'),
  terminationDate: text('termination_date'),
  status: text('status').notNull(),
  github: text('github'),
  department: text('department'),
  branch: text('branch'),
  employeeCode: text('employee_code').notNull(),
  level: text('level'),
  isKpi: integer('is_kpi', { mode: 'boolean' }).notNull().default(false),
  isSalaryCompany: integer('is_salary_company', { mode: 'boolean' })
    .notNull()
    .default(false),
  birthDayAndMonth: text('birth_day_and_month'),
  birthdayPoster: text('birthday_poster'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});


export const templates = sqliteTable('templates', {
  name: text('name').primaryKey(),
  htmlContent: text('html_content').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const reviewRequests = sqliteTable('review_requests', {
  id: text('id').primaryKey(),
  jobId: text('job_id').notNull(),
  reviewerEmail: text('reviewer_email').notNull(),
  reviewToken: text('review_token').notNull(),
  status: text('status').notNull(),
  openedAt: text('opened_at'),
  approvedAt: text('approved_at'),
  rejectedAt: text('rejected_at'),
  createdAt: text('created_at').notNull(),
});