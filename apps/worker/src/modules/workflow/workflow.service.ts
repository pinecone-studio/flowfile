import { getAllRecipients } from '../action/action.service';

type EnvWithDb = { DB: D1Database };

type EmployeeLike = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  department: string | null;
  branch: string | null;
};

type RecipientRecord = Awaited<ReturnType<typeof getAllRecipients>>[number];

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

type ReviewRequestLike = {
  id: string;
  reviewToken: string;
  reviewerEmail: string;
  reviewerName: string | null;
  signerRole: string;
  documentId: string;
};

type DocumentLike = {
  id: string;
  fileName: string;
  documentType: string;
  actionName: string;
};

type JobLike = {
  id: string;
  actionName: string;
};

const payloadEmailByRole: Record<string, string[]> = {
  department_chief: ['departmentChiefEmail', 'approverEmail', 'higherEmployeeEmail'],
  branch_manager: ['branchManagerEmail', 'approverEmail', 'higherEmployeeEmail'],
  ceo: ['ceoEmail', 'approverEmail'],
  manager: ['managerEmail', 'approverEmail', 'higherEmployeeEmail'],
  approver: ['approverEmail', 'higherEmployeeEmail', 'managerEmail'],
  hr_team: ['hrEmail', 'requestedByEmail'],
};

const genericApproverFields = [
  'approverEmail',
  'higherEmployeeEmail',
  'managerEmail',
  'departmentChiefEmail',
  'branchManagerEmail',
  'ceoEmail',
];

function getPayloadString(
  payload: WorkflowPayload,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function pushUniqueRecipient(
  recipients: WorkflowRecipient[],
  recipient: WorkflowRecipient,
) {
  const alreadyExists = recipients.some(
    (current) =>
      current.email.toLowerCase() === recipient.email.toLowerCase() &&
      current.role === recipient.role,
  );

  if (!alreadyExists) {
    recipients.push(recipient);
  }
}

function matchesEmployeeScope(
  recipient: RecipientRecord,
  employee: EmployeeLike,
) {
  const departmentMatches =
    !recipient.department || recipient.department === employee.department;
  const branchMatches = !recipient.branch || recipient.branch === employee.branch;

  return departmentMatches && branchMatches;
}

function buildRecipientFromRecord(
  record: RecipientRecord,
  signOrder: number,
): WorkflowRecipient {
  return {
    email: record.recipientEmail,
    name: record.recipientName ?? null,
    role: record.roleKey,
    signOrder,
  };
}

export const parseWorkflowPayload = (value: unknown): WorkflowPayload => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return value as WorkflowPayload;
};

export const resolveWorkflowRecipients = async (
  env: EnvWithDb,
  employee: EmployeeLike,
  roleKeys: string[],
  payload: WorkflowPayload,
  requestedByEmail?: string,
  overrideRecipients?: WorkflowRecipientInput[],
) => {
  if (overrideRecipients && overrideRecipients.length > 0) {
    return overrideRecipients
      .filter((recipient) => recipient.email.trim())
      .map((recipient, index) => ({
        email: recipient.email.trim(),
        name: recipient.name?.trim() || null,
        role: recipient.role?.trim() || `signer_${index + 1}`,
        signOrder: recipient.signOrder ?? index + 1,
      }));
  }

  const recipients: WorkflowRecipient[] = [];
  const employeeEmail = employee.email ?? getPayloadString(payload, ['employeeEmail']);

  if (employeeEmail) {
    pushUniqueRecipient(recipients, {
      email: employeeEmail,
      name: `${employee.firstName} ${employee.lastName}`.trim(),
      role: 'employee',
      signOrder: 1,
    });
  }

  const availableRecipients = await getAllRecipients(env);

  for (const roleKey of roleKeys) {
    const payloadEmail = getPayloadString(payload, payloadEmailByRole[roleKey] ?? []);

    if (payloadEmail) {
      pushUniqueRecipient(recipients, {
        email: payloadEmail,
        name: null,
        role: roleKey,
        signOrder: recipients.length + 1,
      });
      continue;
    }

    const match = availableRecipients.find(
      (recipient) =>
        recipient.isActive &&
        recipient.roleKey === roleKey &&
        matchesEmployeeScope(recipient, employee),
    );

    if (match) {
      pushUniqueRecipient(
        recipients,
        buildRecipientFromRecord(match, recipients.length + 1),
      );
    }
  }

  const genericApproverEmail = getPayloadString(payload, genericApproverFields);

  if (genericApproverEmail) {
    pushUniqueRecipient(recipients, {
      email: genericApproverEmail,
      name: null,
      role: recipients.some((recipient) => recipient.role !== 'employee')
        ? 'approver'
        : 'manager',
      signOrder: recipients.length + 1,
    });
  }

  if (requestedByEmail && recipients.length < 2) {
    pushUniqueRecipient(recipients, {
      email: requestedByEmail,
      name: null,
      role: 'hr_requester',
      signOrder: recipients.length + 1,
    });
  }

  return recipients;
};

export const buildReviewUrl = (token: string) => `/api/v1/reviews/${token}`;

export const buildDocumentFileUrl = (documentId: string) =>
  `/api/v1/document-files/${documentId}`;

export const buildWorkflowDocumentHtml = (input: {
  documentType: string;
  actionName: string;
  employee: EmployeeLike;
  payload: WorkflowPayload;
  recipients: WorkflowRecipient[];
  status: string;
  templateHtml?: string | null;
  approvalSummary?: Array<{
    reviewerEmail: string;
    reviewerName: string | null;
    approvedAt: string | null;
    signMethod: string | null;
  }>;
}) => {
  const employeeName = `${input.employee.firstName} ${input.employee.lastName}`.trim();
  const payloadEntries = Object.entries(input.payload);
  const reviewerList = input.recipients
    .map(
      (recipient) =>
        `<li><strong>${recipient.role}</strong>: ${recipient.name ?? recipient.email}</li>`,
    )
    .join('');
  const approvalList = (input.approvalSummary ?? [])
    .map(
      (approval) =>
        `<li>${approval.reviewerName ?? approval.reviewerEmail} - ${
          approval.approvedAt ?? 'pending'
        }${approval.signMethod ? ` (${approval.signMethod})` : ''}</li>`,
    )
    .join('');

  if (input.templateHtml) {
    return input.templateHtml
      .replaceAll('{{employeeName}}', employeeName)
      .replaceAll('{{employeeId}}', input.employee.id)
      .replaceAll('{{actionName}}', input.actionName)
      .replaceAll('{{documentType}}', input.documentType)
      .replaceAll('{{status}}', input.status);
  }

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${input.documentType}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 32px; color: #17202a; }
      h1 { margin-bottom: 8px; }
      h2 { margin-top: 24px; }
      .meta { color: #566573; margin-bottom: 16px; }
      ul { padding-left: 20px; }
      table { border-collapse: collapse; width: 100%; margin-top: 12px; }
      td, th { border: 1px solid #d5d8dc; padding: 8px; text-align: left; }
    </style>
  </head>
  <body>
    <h1>${input.documentType}</h1>
    <div class="meta">${input.actionName} • ${input.status}</div>
    <p><strong>Employee:</strong> ${employeeName}</p>
    <p><strong>Department:</strong> ${input.employee.department ?? '-'}</p>
    <p><strong>Branch:</strong> ${input.employee.branch ?? '-'}</p>
    <h2>Requested Changes</h2>
    <table>
      <tbody>
        ${
          payloadEntries.length > 0
            ? payloadEntries
                .map(
                  ([key, value]) =>
                    `<tr><th>${key}</th><td>${
                      value == null ? '' : String(value)
                    }</td></tr>`,
                )
                .join('')
            : '<tr><td colspan="2">No extra payload provided.</td></tr>'
        }
      </tbody>
    </table>
    <h2>Required Signers</h2>
    <ul>${reviewerList}</ul>
    <h2>Approval Status</h2>
    <ul>${approvalList || '<li>Pending signatures</li>'}</ul>
  </body>
</html>`;
};

export const buildReviewNotifications = (input: {
  job: JobLike;
  documents: DocumentLike[];
  reviewRequests: ReviewRequestLike[];
}) => {
  const documentsById = new Map(
    input.documents.map((document) => [document.id, document]),
  );

  return input.reviewRequests.map((reviewRequest) => {
    const document = documentsById.get(reviewRequest.documentId);

    return {
      type: 'review_request',
      to: reviewRequest.reviewerEmail,
      subject: `EPAS signature requested: ${document?.documentType ?? input.job.actionName}`,
      reviewUrl: buildReviewUrl(reviewRequest.reviewToken),
      documentId: reviewRequest.documentId,
      jobId: input.job.id,
      message: `${reviewRequest.reviewerName ?? reviewRequest.reviewerEmail}, please review and sign ${
        document?.fileName ?? 'the requested document'
      }.`,
    };
  });
};

export const buildCompletionNotifications = (input: {
  job: JobLike;
  documents: Array<DocumentLike & { fileUrl: string | null }>;
  recipients: WorkflowRecipient[];
}) => {
  return input.recipients.map((recipient) => ({
    type: 'workflow_completed',
    to: recipient.email,
    subject: `EPAS completed: ${input.job.actionName}`,
    jobId: input.job.id,
    documents: input.documents.map((document) => ({
      documentId: document.id,
      documentType: document.documentType,
      fileUrl: document.fileUrl,
    })),
    message: `${recipient.name ?? recipient.email}, the ${input.job.actionName} workflow has completed.`,
  }));
};

export const emitWorkflowNotifications = (notifications: unknown[]) => {
  for (const notification of notifications) {
    console.log('WORKFLOW_NOTIFICATION', JSON.stringify(notification));
  }
};
