import type {
  EmployeeLike,
  WorkflowPayload,
  WorkflowRecipient,
} from './workflow.types';

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
  const employeeName =
    `${input.employee.firstName} ${input.employee.lastName}`.trim();
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
