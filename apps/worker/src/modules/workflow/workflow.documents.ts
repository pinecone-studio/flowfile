import { renderTemplateHtmlStrict } from '../templates/templates.service';
import type {
  EmployeeLike,
  WorkflowPayload,
  WorkflowRecipient,
} from './workflow.types';

type ApprovalSummary = {
  reviewerEmail: string;
  reviewerName: string | null;
  signerRole: string;
  signOrder: number;
  approvedAt: string | null;
  signMethod: string | null;
  signatureImageUrl: string | null;
};

type WorkflowDocumentInput = {
  documentType: string;
  actionName: string;
  employee: EmployeeLike;
  payload: WorkflowPayload;
  recipients: WorkflowRecipient[];
  status: string;
  templateName?: string | null;
  templateHtml?: string | null;
  approvalSummary?: ApprovalSummary[];
  signatureImageUrl?: string | null;
  renderSignatureImage?: boolean;
};

type PdfLine = {
  text: string;
  fontSize: number;
  lineHeight: number;
};

const PDF_PAGE_WIDTH = 612;
const PDF_PAGE_HEIGHT = 792;
const PDF_MARGIN = 48;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function stringifyTemplateValue(value: unknown): string {
  if (value == null) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((entry) => stringifyTemplateValue(entry)).join(', ');
  }

  if (isPlainObject(value)) {
    return JSON.stringify(value);
  }

  return String(value);
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeTemplateTokenKey(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

function formatRoleLabel(value: string | null | undefined) {
  if (!value) {
    return 'Signer';
  }

  return value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatApprovedAt(value: string | null | undefined) {
  if (!value) {
    return 'Pending signature';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function buildSignatureMarkup(signatureImageUrl: string | null | undefined) {
  if (!signatureImageUrl) {
    return '';
  }

  return `<img src="${signatureImageUrl}" alt="Signature" style="display:block;max-width:100%;max-height:72px;object-fit:contain;" />`;
}

function buildTemplateSignatureSlot(input: {
  content: string;
  kind: 'document' | 'review';
  signerRole?: string;
  signOrder?: number;
}) {
  const attributes = [
    `data-live-signature="${input.kind}"`,
    input.signerRole
      ? `data-signer-role="${escapeHtml(input.signerRole)}"`
      : null,
    typeof input.signOrder === 'number'
      ? `data-sign-order="${input.signOrder}"`
      : null,
    'style="display:inline-flex;min-height:72px;min-width:160px;align-items:center;"',
  ]
    .filter(Boolean)
    .join(' ');

  return `<span ${attributes}>${input.content}</span>`;
}

function appendFlattenedValues(
  target: Record<string, string>,
  prefix: string,
  value: unknown,
) {
  if (!prefix) {
    return;
  }

  if (isPlainObject(value)) {
    for (const [childKey, childValue] of Object.entries(value)) {
      appendFlattenedValues(target, `${prefix}.${childKey}`, childValue);
    }
    return;
  }

  target[prefix] = stringifyTemplateValue(value);
}

function buildTemplateData(input: WorkflowDocumentInput) {
  const employeeRecord = input.employee as Record<string, unknown>;
  const employeeName =
    `${input.employee.firstName} ${input.employee.lastName}`.trim();
  const nowIso = new Date().toISOString();
  const approvalSummaryText = (input.approvalSummary ?? [])
    .map((approval) => {
      const reviewer = approval.reviewerName ?? approval.reviewerEmail;
      const timestamp = approval.approvedAt ?? 'pending';
      const method = approval.signMethod ? ` via ${approval.signMethod}` : '';
      return `${reviewer} signed ${timestamp}${method}`;
    })
    .join('\n');
  const recipientSummary = input.recipients
    .map(
      (recipient) =>
        `${recipient.signOrder}. ${recipient.role}: ${recipient.name ?? recipient.email}`,
    )
    .join('\n');
  const hasApprovedSignature = (input.approvalSummary ?? []).some((approval) =>
    Boolean(approval.approvedAt),
  );
  const signatureInner =
    input.renderSignatureImage && input.signatureImageUrl
      ? buildSignatureMarkup(input.signatureImageUrl)
      : hasApprovedSignature
        ? 'Signed electronically'
        : '';
  const signatureValue =
    buildTemplateSignatureSlot({
      content: signatureInner,
      kind: 'document',
    });

  const data: Record<string, string> = {
    employeeName,
    fullName: employeeName,
    employeeFullName: employeeName,
    employeeId: input.employee.id,
    employeeCode: stringifyTemplateValue(employeeRecord.employeeCode),
    firstName: input.employee.firstName,
    lastName: input.employee.lastName,
    employeeFirstName: input.employee.firstName,
    employeeLastName: input.employee.lastName,
    firstNameEng: stringifyTemplateValue(employeeRecord.firstNameEng),
    lastNameEng: stringifyTemplateValue(employeeRecord.lastNameEng),
    employeeEmail: input.employee.email ?? '',
    email: input.employee.email ?? '',
    department: input.employee.department ?? '',
    branch: input.employee.branch ?? '',
    level: stringifyTemplateValue(employeeRecord.level),
    hireDate: stringifyTemplateValue(employeeRecord.hireDate),
    terminationDate: stringifyTemplateValue(employeeRecord.terminationDate),
    numberOfVacationDays: stringifyTemplateValue(
      employeeRecord.numberOfVacationDays,
    ),
    isSalaryCompany: stringifyTemplateValue(employeeRecord.isSalaryCompany),
    actionName: input.actionName,
    documentType: input.documentType,
    templateName: input.templateName ?? '',
    status: input.status,
    employeeStatus: stringifyTemplateValue(employeeRecord.status ?? input.status),
    workflowStatus: input.status,
    requiredSigners: recipientSummary,
    approvalSummary: approvalSummaryText,
    currentDate: nowIso,
    currentDateOnly: nowIso.slice(0, 10),
    generatedAt: nowIso,
    signature: signatureValue,
  };

  appendFlattenedValues(data, 'employee', input.employee);
  appendFlattenedValues(data, 'payload', input.payload);

  for (const [key, value] of Object.entries(employeeRecord)) {
    data[key] = stringifyTemplateValue(value);
  }

  for (const [key, value] of Object.entries(input.payload)) {
    data[key] = stringifyTemplateValue(value);
  }

  for (const approval of input.approvalSummary ?? []) {
    const roleKey =
      normalizeTemplateTokenKey(approval.signerRole) ||
      `signer_${approval.signOrder}`;
    const signatureInnerMarkup =
      input.renderSignatureImage && approval.signatureImageUrl
        ? buildSignatureMarkup(approval.signatureImageUrl)
        : approval.approvedAt
          ? 'Signed electronically'
          : '';
    const signatureMarkup = buildTemplateSignatureSlot({
      content: signatureInnerMarkup,
      kind: 'review',
      signerRole: approval.signerRole,
      signOrder: approval.signOrder,
    });
    const signerName = approval.reviewerName ?? approval.reviewerEmail;

    data[`signature_${roleKey}`] = signatureMarkup;
    data[`signature_${roleKey}_${approval.signOrder}`] = signatureMarkup;
    data[`reviewerName_${roleKey}`] = signerName;
    data[`reviewerName_${roleKey}_${approval.signOrder}`] = signerName;
    data[`approvedAt_${roleKey}`] = approval.approvedAt ?? '';
    data[`approvedAt_${roleKey}_${approval.signOrder}`] =
      approval.approvedAt ?? '';
    data[`approvalStatus_${roleKey}`] = approval.approvedAt
      ? formatApprovedAt(approval.approvedAt)
      : 'Pending signature';
    data[`approvalStatus_${roleKey}_${approval.signOrder}`] = approval.approvedAt
      ? formatApprovedAt(approval.approvedAt)
      : 'Pending signature';
  }

  return data;
}

function buildSignatureCardsHtml(
  input: WorkflowDocumentInput,
  options?: { roles?: 'hr' | 'other' },
) {
  const approvalMap = new Map(
    (input.approvalSummary ?? []).map((approval) => [
      `${approval.reviewerEmail}:${approval.signerRole}:${approval.signOrder}`,
      approval,
    ]),
  );

  const signerRows = input.recipients
    .slice()
    .sort((left, right) => left.signOrder - right.signOrder)
    .map((recipient) => {
      const key = `${recipient.email}:${recipient.role}:${recipient.signOrder}`;
      const approval = approvalMap.get(key);
      const isHrRole = recipient.role.toLowerCase().includes('hr');

      return {
        signerRole: recipient.role,
        signOrder: recipient.signOrder,
        roleLabel: formatRoleLabel(recipient.role),
        signerName: approval?.reviewerName ?? recipient.name ?? recipient.email,
        signerEmail: approval?.reviewerEmail ?? recipient.email,
        statusLabel: approval?.approvedAt
          ? `Signed ${formatApprovedAt(approval.approvedAt)}`
          : 'Awaiting signature',
        signatureMarkup:
          input.renderSignatureImage && approval?.signatureImageUrl
            ? buildSignatureMarkup(approval.signatureImageUrl)
            : approval?.approvedAt
              ? '<span style="color:#2f6c42;font-weight:600;">Signed electronically</span>'
              : '<span style="color:#8b97ab;">Pending signature</span>',
        isHrRole,
      };
    })
    .filter((row) =>
      options?.roles === 'hr'
        ? row.isHrRole
        : options?.roles === 'other'
          ? !row.isHrRole
          : true,
    );

  if (signerRows.length === 0) {
    return '';
  }

  return signerRows
    .map(
      (row) => `
        <article
          data-signer-card="true"
          data-signer-role="${escapeHtml(row.signerRole)}"
          data-sign-order="${row.signOrder}"
          style="border:1px solid #dbe4f0;border-radius:16px;padding:16px;background:#ffffff;"
        >
          <div style="display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:12px;">
            <div>
              <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#64748b;">Step ${row.signOrder}</div>
              <div style="margin-top:6px;font-size:17px;font-weight:600;color:#0f172a;">${escapeHtml(row.roleLabel)}</div>
              <div style="margin-top:4px;font-size:14px;color:#475569;">${escapeHtml(row.signerName)} · ${escapeHtml(row.signerEmail)}</div>
            </div>
            <div
              data-signer-status="true"
              style="font-size:13px;font-weight:600;color:${row.statusLabel.startsWith('Signed') ? '#2f6c42' : '#7c5b16'};"
            >
              ${escapeHtml(row.statusLabel)}
            </div>
          </div>
          <div
            data-signature-slot="true"
            style="margin-top:16px;min-height:88px;border:1px dashed #c9d6e4;border-radius:14px;padding:14px;background:#f8fbff;"
          >
            ${row.signatureMarkup}
          </div>
        </article>`,
    )
    .join('');
}

function buildSignatureSectionsHtml(input: WorkflowDocumentInput) {
  const hrSectionCards = buildSignatureCardsHtml(input, { roles: 'hr' });
  const otherSectionCards = buildSignatureCardsHtml(input, { roles: 'other' });

  if (!hrSectionCards && !otherSectionCards) {
    return '';
  }

  const hrSection = hrSectionCards
    ? `
      <section style="margin-top:22px;">
        <h3 style="margin:0 0 14px;font-size:18px;color:#0f172a;">HR Section</h3>
        <div style="display:grid;gap:14px;">
          ${hrSectionCards}
        </div>
      </section>`
    : '';

  const otherSection = otherSectionCards
    ? `
      <section style="margin-top:${hrSection ? '22px' : '0'};">
        <h3 style="margin:0 0 14px;font-size:18px;color:#0f172a;">Other Approvals</h3>
        <div style="display:grid;gap:14px;">
          ${otherSectionCards}
        </div>
      </section>`
    : '';

  return `
    <section style="margin-top:32px;padding:24px;border:1px solid #dbe4f0;border-radius:22px;background:#f8fbff;">
      <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#64748b;">Signature Preview</div>
      <h2 style="margin:10px 0 8px;font-size:24px;color:#0f172a;">Approval Signatures</h2>
      <p style="margin:0;color:#475569;line-height:1.7;">
        Completed signatures appear in their signer section as the document moves through the workflow.
      </p>
      ${hrSection}
      ${otherSection}
    </section>`;
}

function appendHtmlBeforeClosingBody(html: string, sectionHtml: string) {
  if (!sectionHtml) {
    return html;
  }

  const bodyCloseIndex = html.lastIndexOf('</body>');

  if (bodyCloseIndex >= 0) {
    return `${html.slice(0, bodyCloseIndex)}${sectionHtml}${html.slice(bodyCloseIndex)}`;
  }

  return `${html}${sectionHtml}`;
}

function buildWorkflowMetadataHtml(input: WorkflowDocumentInput) {
  const recipientItems = input.recipients
    .map(
      (recipient) =>
        `<li><strong>${recipient.role}</strong>: ${recipient.name ?? recipient.email}</li>`,
    )
    .join('');
  const approvalItems = (input.approvalSummary ?? [])
    .map((approval) => {
      const reviewer = approval.reviewerName ?? approval.reviewerEmail;
      const timestamp = approval.approvedAt ?? 'pending';
      const method = approval.signMethod ? ` (${approval.signMethod})` : '';
      return `<li>${reviewer} - ${timestamp}${method}</li>`;
    })
    .join('');

  return `
  <section class="epas-workflow-summary">
    <hr />
    <h2>Workflow Summary</h2>
    <p><strong>Document:</strong> ${input.documentType}</p>
    <p><strong>Workflow:</strong> ${input.actionName}</p>
    <p><strong>Status:</strong> ${input.status}</p>
    <h3>Required Signers</h3>
    <ul>${recipientItems || '<li>No signers configured</li>'}</ul>
    <h3>Approval Status</h3>
    <ul>${approvalItems || '<li>Pending signatures</li>'}</ul>
  </section>`;
}

const defaultDocumentHtml = (input: WorkflowDocumentInput) => {
  const employeeName =
    `${input.employee.firstName} ${input.employee.lastName}`.trim();
  const payloadEntries = Object.entries(input.payload);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${input.documentType}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 32px; color: #17202a; }
      h1 { margin-bottom: 8px; }
      h2 { margin-top: 24px; }
      table { border-collapse: collapse; width: 100%; margin-top: 12px; }
      td, th { border: 1px solid #d5d8dc; padding: 8px; text-align: left; }
    </style>
  </head>
  <body>
    <h1>${input.documentType}</h1>
    <p><strong>Workflow:</strong> ${input.actionName}</p>
    <p><strong>Status:</strong> ${input.status}</p>
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
  </body>
</html>`;
};

export const buildWorkflowDocumentHtml = (input: WorkflowDocumentInput) => {
  if (input.templateName && !input.templateHtml?.trim()) {
    throw new Error(`Template "${input.templateName}" has no HTML content`);
  }

  if (input.templateHtml?.trim()) {
    const renderedTemplate = renderTemplateHtmlStrict(
      input.templateHtml,
      buildTemplateData(input),
      {
        templateName: input.templateName,
        documentType: input.documentType,
      },
    );

    return appendHtmlBeforeClosingBody(
      renderedTemplate,
      buildSignatureSectionsHtml(input),
    );
  }

  return appendHtmlBeforeClosingBody(
    defaultDocumentHtml(input),
    `${buildWorkflowMetadataHtml(input)}${buildSignatureSectionsHtml(input)}`,
  );
};

function decodeHtmlEntities(text: string) {
  return text
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

function htmlToPlainText(html: string) {
  const withLineBreaks = html
    .replace(/<style[\s\S]*?<\/style>/gi, '\n')
    .replace(/<script[\s\S]*?<\/script>/gi, '\n')
    .replace(/<\/(h1|h2|h3|h4|h5|h6|p|div|section|article|tr|ul|ol|li)>/gi, '\n')
    .replace(/<(br|hr)\s*\/?>/gi, '\n')
    .replace(/<\/(td|th)>/gi, '  ')
    .replace(/<li>/gi, '- ')
    .replace(/<[^>]+>/g, ' ');

  return decodeHtmlEntities(withLineBreaks)
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function wrapLine(text: string, fontSize: number) {
  const maxChars = Math.max(
    20,
    Math.floor((PDF_PAGE_WIDTH - PDF_MARGIN * 2) / (fontSize * 0.52)),
  );
  const normalized = text.trim();

  if (!normalized) {
    return [''];
  }

  const words = normalized.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;

    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    if (word.length <= maxChars) {
      current = word;
      continue;
    }

    let remainder = word;
    while (remainder.length > maxChars) {
      lines.push(remainder.slice(0, maxChars - 1) + '-');
      remainder = remainder.slice(maxChars - 1);
    }
    current = remainder;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function buildPdfLines(text: string): PdfLine[] {
  const rawLines = text.split('\n');
  const lines: PdfLine[] = [];
  const firstNonEmptyIndex = rawLines.findIndex((line) => line.trim());

  for (const [index, rawLine] of rawLines.entries()) {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      lines.push({ text: '', fontSize: 11, lineHeight: 14 });
      continue;
    }

    const isTitle = index === firstNonEmptyIndex;
    const fontSize = isTitle ? 18 : 11;
    const lineHeight = isTitle ? 24 : 14;

    for (const wrappedLine of wrapLine(trimmed, fontSize)) {
      lines.push({ text: wrappedLine, fontSize, lineHeight });
    }
  }

  return lines;
}

function escapePdfText(text: string) {
  const asciiSafeText = text.replace(/[^\x20-\x7E]/g, '?');

  return asciiSafeText
    .replaceAll('\\', '\\\\')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)');
}

function buildPdfContent(pages: PdfLine[][]) {
  return pages.map((pageLines) => {
    let y = PDF_PAGE_HEIGHT - PDF_MARGIN;
    const commands = ['BT'];

    for (const line of pageLines) {
      commands.push(`/F1 ${line.fontSize} Tf`);
      commands.push(
        `1 0 0 1 ${PDF_MARGIN} ${Number(y.toFixed(2))} Tm (${escapePdfText(
          line.text,
        )}) Tj`,
      );
      y -= line.lineHeight;
    }

    commands.push('ET');
    return commands.join('\n');
  });
}

function paginatePdfLines(lines: PdfLine[]) {
  const pages: PdfLine[][] = [];
  let currentPage: PdfLine[] = [];
  let remainingHeight = PDF_PAGE_HEIGHT - PDF_MARGIN * 2;

  for (const line of lines) {
    if (currentPage.length > 0 && remainingHeight < line.lineHeight) {
      pages.push(currentPage);
      currentPage = [];
      remainingHeight = PDF_PAGE_HEIGHT - PDF_MARGIN * 2;
    }

    currentPage.push(line);
    remainingHeight -= line.lineHeight;
  }

  if (currentPage.length === 0) {
    currentPage.push({ text: '', fontSize: 11, lineHeight: 14 });
  }

  pages.push(currentPage);

  return pages;
}

function serializePdf(contentStreams: string[]) {
  const objects: Array<string | null> = [
    null,
    '<< /Type /Catalog /Pages 2 0 R >>',
    '',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  const pageObjectNumbers: number[] = [];

  for (const content of contentStreams) {
    const pageObjectNumber = objects.length;
    const contentObjectNumber = pageObjectNumber + 1;
    pageObjectNumbers.push(pageObjectNumber);
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PDF_PAGE_WIDTH} ${PDF_PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`,
    );
    objects.push(
      `<< /Length ${new TextEncoder().encode(content).length} >>\nstream\n${content}\nendstream`,
    );
  }

  objects[2] = `<< /Type /Pages /Kids [${pageObjectNumbers
    .map((objectNumber) => `${objectNumber} 0 R`)
    .join(' ')}] /Count ${pageObjectNumbers.length} >>`;

  let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets = [0];

  for (let index = 1; index < objects.length; index += 1) {
    offsets[index] = pdf.length;
    pdf += `${index} 0 obj\n${objects[index]}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length}\n`;
  pdf += '0000000000 65535 f \n';

  for (let index = 1; index < objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}

export const buildWorkflowDocumentPdf = (input: WorkflowDocumentInput) => {
  const text = htmlToPlainText(buildWorkflowDocumentHtml(input));
  const lines = buildPdfLines(text);
  const pages = paginatePdfLines(lines);

  return serializePdf(buildPdfContent(pages));
};
