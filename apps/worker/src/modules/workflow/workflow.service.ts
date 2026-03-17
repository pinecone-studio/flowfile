import { getAllRecipients } from '../action/action.service';

type EnvWithDb = {
  DB: D1Database;
  APP_BASE_URL?: string;
  EMAIL_WEBHOOK_URL?: string;
  MAILCHANNELS_API_URL?: string;
  MAIL_FROM_EMAIL?: string;
  MAIL_FROM_NAME?: string;
  MAIL_REPLY_TO?: string;
};

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

type WorkflowNotification = {
  type: 'review_request' | 'documents_generated' | 'workflow_completed';
  to: string;
  subject: string;
  text: string;
  html: string;
  metadata?: Record<string, unknown>;
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

const generatedNotificationRecipientSpecs = [
  {
    role: 'clo',
    payloadKeys: ['cloEmail', 'legalEmail', 'chiefLegalOfficerEmail'],
    recipientRoleKeys: ['clo', 'chief_legal_officer', 'legal'],
  },
  {
    role: 'hr_management',
    payloadKeys: ['hrManagementEmail', 'hrEmail'],
    recipientRoleKeys: ['hr_management', 'hr_team'],
  },
] as const;

function getPayloadString(
  payload: WorkflowPayload,
  keys: readonly string[],
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

function pushUniqueEmailRecipient(
  recipients: WorkflowRecipient[],
  recipient: WorkflowRecipient,
) {
  const alreadyExists = recipients.some(
    (current) =>
      current.email.toLowerCase() === recipient.email.toLowerCase(),
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

function normalizeBaseUrl(baseUrl?: string) {
  return baseUrl?.trim().replace(/\/+$/, '') ?? '';
}

function buildAbsoluteUrl(baseUrl: string | undefined, path: string | null) {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  if (!normalizedBaseUrl) {
    return path;
  }

  return new URL(path, `${normalizedBaseUrl}/`).toString();
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function titleCaseRole(role: string) {
  return role
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function renderNotificationHtml(input: {
  title: string;
  intro: string;
  paragraphs: string[];
  links?: Array<{ label: string; url: string | null }>;
}) {
  const links = input.links ?? [];

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(input.title)}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; color: #17202a; }
      h1 { margin-bottom: 12px; }
      p { line-height: 1.5; }
      ul { padding-left: 20px; }
      a { color: #0f5fff; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(input.title)}</h1>
    <p>${escapeHtml(input.intro)}</p>
    ${input.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
    ${
      links.length > 0
        ? `<ul>${links
            .map((link) => {
              if (!link.url) {
                return `<li>${escapeHtml(link.label)}</li>`;
              }

              return `<li><a href="${escapeHtml(link.url)}">${escapeHtml(link.label)}</a></li>`;
            })
            .join('')}</ul>`
        : ''
    }
  </body>
</html>`;
}

function renderNotificationText(input: {
  intro: string;
  paragraphs: string[];
  links?: Array<{ label: string; url: string | null }>;
}) {
  const lines = [input.intro, ...input.paragraphs];

  for (const link of input.links ?? []) {
    lines.push(link.url ? `${link.label}: ${link.url}` : link.label);
  }

  return lines.join('\n\n');
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

export const resolveGeneratedDocumentRecipients = async (
  env: EnvWithDb,
  employee: EmployeeLike,
  payload: WorkflowPayload,
  requestedByEmail?: string,
) => {
  const recipients: WorkflowRecipient[] = [];
  const availableRecipients = await getAllRecipients(env);

  for (const spec of generatedNotificationRecipientSpecs) {
    const payloadEmail = getPayloadString(payload, spec.payloadKeys);
    const fallbackRequestedByEmail =
      spec.role === 'hr_management' && requestedByEmail?.trim()
        ? requestedByEmail.trim()
        : null;
    const recipientEmail = payloadEmail ?? fallbackRequestedByEmail;

    if (recipientEmail) {
      pushUniqueEmailRecipient(recipients, {
        email: recipientEmail,
        name: null,
        role: spec.role,
        signOrder: recipients.length + 1,
      });
      continue;
    }

    const match = availableRecipients.find(
      (recipient) =>
        recipient.isActive &&
        (spec.recipientRoleKeys as readonly string[]).includes(recipient.roleKey) &&
        matchesEmployeeScope(recipient, employee),
    );

    if (match) {
      pushUniqueEmailRecipient(recipients, {
        email: match.recipientEmail,
        name: match.recipientName ?? null,
        role: spec.role,
        signOrder: recipients.length + 1,
      });
    }
  }

  const employeeEmail = employee.email ?? getPayloadString(payload, ['employeeEmail']);

  if (employeeEmail) {
    pushUniqueEmailRecipient(recipients, {
      email: employeeEmail,
      name: `${employee.firstName} ${employee.lastName}`.trim(),
      role: 'employee',
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
  baseUrl?: string;
}) => {
  const documentsById = new Map(
    input.documents.map((document) => [document.id, document]),
  );

  return input.reviewRequests.map<WorkflowNotification>((reviewRequest) => {
    const document = documentsById.get(reviewRequest.documentId);
    const reviewUrl = buildAbsoluteUrl(
      input.baseUrl,
      buildReviewUrl(reviewRequest.reviewToken),
    );
    const intro = `${reviewRequest.reviewerName ?? reviewRequest.reviewerEmail}, please review and sign ${
      document?.fileName ?? 'the requested document'
    }.`;
    const paragraphs = [
      `Workflow: ${input.job.actionName}`,
      `Document: ${document?.documentType ?? 'Generated document'}`,
      `Role: ${titleCaseRole(reviewRequest.signerRole)}`,
    ];

    return {
      type: 'review_request',
      to: reviewRequest.reviewerEmail,
      subject: `EPAS signature requested: ${document?.documentType ?? input.job.actionName}`,
      text: renderNotificationText({
        intro,
        paragraphs,
        links: reviewUrl ? [{ label: 'Open review request', url: reviewUrl }] : [],
      }),
      html: renderNotificationHtml({
        title: 'Signature Requested',
        intro,
        paragraphs,
        links: reviewUrl ? [{ label: 'Open review request', url: reviewUrl }] : [],
      }),
      metadata: {
        reviewUrl,
        documentId: reviewRequest.documentId,
        jobId: input.job.id,
      },
    };
  });
};

export const buildDocumentsGeneratedNotifications = (input: {
  job: JobLike;
  employee: EmployeeLike;
  documents: Array<DocumentLike & { fileUrl: string | null }>;
  recipients: WorkflowRecipient[];
  baseUrl?: string;
}) => {
  return input.recipients.map<WorkflowNotification>((recipient) => {
    const employeeName =
      `${input.employee.firstName} ${input.employee.lastName}`.trim();
    const intro = `${
      recipient.name ?? recipient.email
    }, documents for ${employeeName} have been generated for the ${
      input.job.actionName
    } workflow.`;
    const paragraphs = [
      `Employee: ${employeeName}`,
      `Recipient role: ${titleCaseRole(recipient.role)}`,
      `Generated documents: ${input.documents.length}`,
    ];
    const links = input.documents.map((document) => ({
      label: `${document.documentType}`,
      url: buildAbsoluteUrl(input.baseUrl, document.fileUrl),
    }));

    return {
      type: 'documents_generated',
      to: recipient.email,
      subject: `EPAS documents generated: ${input.job.actionName}`,
      text: renderNotificationText({
        intro,
        paragraphs,
        links,
      }),
      html: renderNotificationHtml({
        title: 'Documents Generated',
        intro,
        paragraphs,
        links,
      }),
      metadata: {
        jobId: input.job.id,
        employeeId: input.employee.id,
        role: recipient.role,
        documents: input.documents.map((document) => ({
          documentId: document.id,
          documentType: document.documentType,
          fileUrl: buildAbsoluteUrl(input.baseUrl, document.fileUrl),
        })),
      },
    };
  });
};

export const buildCompletionNotifications = (input: {
  job: JobLike;
  documents: Array<DocumentLike & { fileUrl: string | null }>;
  recipients: WorkflowRecipient[];
  baseUrl?: string;
}) => {
  return input.recipients.map<WorkflowNotification>((recipient) => {
    const intro = `${
      recipient.name ?? recipient.email
    }, the ${input.job.actionName} workflow has completed.`;
    const links = input.documents.map((document) => ({
      label: `${document.documentType}`,
      url: buildAbsoluteUrl(input.baseUrl, document.fileUrl),
    }));

    return {
      type: 'workflow_completed',
      to: recipient.email,
      subject: `EPAS completed: ${input.job.actionName}`,
      text: renderNotificationText({
        intro,
        paragraphs: [
          `Completed documents: ${input.documents.length}`,
          `Recipient role: ${titleCaseRole(recipient.role)}`,
        ],
        links,
      }),
      html: renderNotificationHtml({
        title: 'Workflow Completed',
        intro,
        paragraphs: [
          `Completed documents: ${input.documents.length}`,
          `Recipient role: ${titleCaseRole(recipient.role)}`,
        ],
        links,
      }),
      metadata: {
        jobId: input.job.id,
        documents: input.documents.map((document) => ({
          documentId: document.id,
          documentType: document.documentType,
          fileUrl: buildAbsoluteUrl(input.baseUrl, document.fileUrl),
        })),
      },
    };
  });
};

async function sendNotificationViaWebhook(
  env: EnvWithDb,
  notification: WorkflowNotification,
) {
  if (!env.EMAIL_WEBHOOK_URL?.trim()) {
    return false;
  }

  const response = await fetch(env.EMAIL_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notification),
  });

  if (!response.ok) {
    throw new Error(`Email webhook failed with status ${response.status}`);
  }

  return true;
}

async function sendNotificationViaMailChannels(
  env: EnvWithDb,
  notification: WorkflowNotification,
) {
  if (!env.MAIL_FROM_EMAIL?.trim()) {
    return false;
  }

  const response = await fetch(
    env.MAILCHANNELS_API_URL?.trim() || 'https://api.mailchannels.net/tx/v1/send',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: notification.to }],
          },
        ],
        from: {
          email: env.MAIL_FROM_EMAIL,
          name: env.MAIL_FROM_NAME?.trim() || 'EPAS',
        },
        reply_to: env.MAIL_REPLY_TO?.trim()
          ? {
              email: env.MAIL_REPLY_TO.trim(),
            }
          : undefined,
        subject: notification.subject,
        content: [
          {
            type: 'text/plain',
            value: notification.text,
          },
          {
            type: 'text/html',
            value: notification.html,
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`MailChannels failed with status ${response.status}`);
  }

  return true;
}

export const emitWorkflowNotifications = async (
  env: EnvWithDb,
  notifications: WorkflowNotification[],
) => {
  for (const notification of notifications) {
    try {
      const sentWithWebhook = await sendNotificationViaWebhook(env, notification);

      if (!sentWithWebhook) {
        const sentWithMailChannels = await sendNotificationViaMailChannels(
          env,
          notification,
        );

        if (!sentWithMailChannels) {
          console.log('WORKFLOW_NOTIFICATION', JSON.stringify(notification));
        }
      }
    } catch (error) {
      console.error(
        'WORKFLOW_NOTIFICATION_FAILED',
        JSON.stringify({
          to: notification.to,
          type: notification.type,
          message: error instanceof Error ? error.message : 'Unknown notification error',
        }),
      );
      console.log('WORKFLOW_NOTIFICATION', JSON.stringify(notification));
    }
  }
};
