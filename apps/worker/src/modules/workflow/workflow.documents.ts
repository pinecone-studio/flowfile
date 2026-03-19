import { renderTemplateHtml } from '../templates/templates.service';
import type {
  EmployeeLike,
  WorkflowPayload,
  WorkflowRecipient,
} from './workflow.types';

type ApprovalSummary = {
  reviewerEmail: string;
  reviewerName: string | null;
  approvedAt: string | null;
  signMethod: string | null;
};

type WorkflowDocumentInput = {
  documentType: string;
  actionName: string;
  employee: EmployeeLike;
  payload: WorkflowPayload;
  recipients: WorkflowRecipient[];
  status: string;
  templateHtml?: string | null;
  approvalSummary?: ApprovalSummary[];
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
  const employeeName =
    `${input.employee.firstName} ${input.employee.lastName}`.trim();
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

  const data: Record<string, string> = {
    employeeName,
    employeeId: input.employee.id,
    firstName: input.employee.firstName,
    lastName: input.employee.lastName,
    employeeFirstName: input.employee.firstName,
    employeeLastName: input.employee.lastName,
    employeeEmail: input.employee.email ?? '',
    department: input.employee.department ?? '',
    branch: input.employee.branch ?? '',
    actionName: input.actionName,
    documentType: input.documentType,
    status: input.status,
    requiredSigners: recipientSummary,
    approvalSummary: approvalSummaryText,
    currentDate: new Date().toISOString(),
    signature: approvalSummaryText ? 'Signed electronically' : '',
  };

  appendFlattenedValues(data, 'employee', input.employee);
  appendFlattenedValues(data, 'payload', input.payload);

  for (const [key, value] of Object.entries(input.employee as Record<string, unknown>)) {
    data[key] = stringifyTemplateValue(value);
  }

  for (const [key, value] of Object.entries(input.payload)) {
    data[key] = stringifyTemplateValue(value);
  }

  return data;
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
  const templateHtml = input.templateHtml?.trim()
    ? renderTemplateHtml(input.templateHtml, buildTemplateData(input))
    : defaultDocumentHtml(input);

  return `${templateHtml}${buildWorkflowMetadataHtml(input)}`;
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
