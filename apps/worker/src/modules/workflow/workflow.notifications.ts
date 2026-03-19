import { titleCaseRole } from './workflow.helpers';
import { renderNotificationHtml, renderNotificationText } from './workflow.templates';
import { buildAbsoluteUrl, buildReviewUrl } from './workflow.urls';
import type {
  DocumentLike,
  EmployeeLike,
  JobLike,
  ReviewRequestLike,
  WorkflowNotification,
  WorkflowRecipient,
} from './workflow.types';

type DocumentWithFileUrl = DocumentLike & { fileUrl: string | null };

const buildDocumentLinks = (
  documents: DocumentWithFileUrl[],
  baseUrl?: string,
) => {
  return documents.map((document) => ({
    label: document.documentType,
    url: buildAbsoluteUrl(baseUrl, document.fileUrl),
  }));
};

const buildDocumentMetadata = (
  documents: DocumentWithFileUrl[],
  baseUrl?: string,
) => {
  return documents.map((document) => ({
    documentId: document.id,
    documentType: document.documentType,
    fileUrl: buildAbsoluteUrl(baseUrl, document.fileUrl),
  }));
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
    const documentUrl = buildAbsoluteUrl(input.baseUrl, document?.fileUrl ?? null);
    const intro = `${reviewRequest.reviewerName ?? reviewRequest.reviewerEmail}, please review and sign ${
      document?.fileName ?? 'the requested document'
    }.`;
    const paragraphs = [
      `Workflow: ${input.job.actionName}`,
      `Document: ${document?.documentType ?? 'Generated document'}`,
      `Role: ${titleCaseRole(reviewRequest.signerRole)}`,
    ];
    const links = [
      reviewUrl ? { label: 'Open review request', url: reviewUrl } : null,
      documentUrl ? { label: 'Open current document', url: documentUrl } : null,
    ].filter((link): link is { label: string; url: string } => Boolean(link));

    return {
      type: 'review_request',
      to: reviewRequest.reviewerEmail,
      subject: `EPAS signature requested: ${document?.documentType ?? input.job.actionName}`,
      text: renderNotificationText({
        intro,
        paragraphs,
        links,
      }),
      html: renderNotificationHtml({
        title: 'Signature Requested',
        intro,
        paragraphs,
        links,
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
  documents: DocumentWithFileUrl[];
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
    const links = buildDocumentLinks(input.documents, input.baseUrl);

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
        documents: buildDocumentMetadata(input.documents, input.baseUrl),
      },
    };
  });
};

export const buildCompletionNotifications = (input: {
  job: JobLike;
  documents: DocumentWithFileUrl[];
  recipients: WorkflowRecipient[];
  baseUrl?: string;
}) => {
  return input.recipients.map<WorkflowNotification>((recipient) => {
    const intro = `${
      recipient.name ?? recipient.email
    }, the ${input.job.actionName} workflow has completed.`;
    const links = buildDocumentLinks(input.documents, input.baseUrl);
    const paragraphs = [
      `Completed documents: ${input.documents.length}`,
      `Recipient role: ${titleCaseRole(recipient.role)}`,
    ];

    return {
      type: 'workflow_completed',
      to: recipient.email,
      subject: `EPAS completed: ${input.job.actionName}`,
      text: renderNotificationText({
        intro,
        paragraphs,
        links,
      }),
      html: renderNotificationHtml({
        title: 'Workflow Completed',
        intro,
        paragraphs,
        links,
      }),
      metadata: {
        jobId: input.job.id,
        documents: buildDocumentMetadata(input.documents, input.baseUrl),
      },
    };
  });
};
