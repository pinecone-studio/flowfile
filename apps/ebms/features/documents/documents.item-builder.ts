import type {
  ApiAuditLog,
  ApiGeneratedDocument,
  ApiJob,
  ApiReviewRequest,
} from './documents.api';
import { formatDateTime, formatTitle } from './documents.formatters';
import {
  buildPendingLabel,
  buildRecipients,
  mapDocumentStatusLabel,
} from './documents.status';
import type { DocumentsPageItem } from './documents.types';

export function buildGroupItem(
  job: ApiJob,
  document: ApiGeneratedDocument,
  reviews: ApiReviewRequest[],
  jobAuditLogs: ApiAuditLog[],
): DocumentsPageItem {
  const pending = buildPendingLabel(document, reviews);
  const errorLog = jobAuditLogs.find(
    (log) =>
      log.status === 'error' &&
      (!log.eventPayloadJson || log.eventPayloadJson.includes(document.id)),
  );
  const errorMessage =
    job.errorMessage ||
    errorLog?.message ||
    (document.status === 'failed' || document.status === 'rejected'
      ? `${formatTitle(document.documentType)} failed to finish the workflow.`
      : null);
  const isDownloadable = !['failed', 'rejected', 'canceled'].includes(document.status);
  const canRetry =
    ['failed', 'rejected', 'canceled'].includes(document.status) ||
    ['failed', 'rejected', 'canceled'].includes(job.status);
  const canCancel = !['completed', 'rejected', 'canceled'].includes(job.status);

  return {
    id: `${job.id}-${document.id}`,
    documentId: document.id,
    title: formatTitle(document.documentType),
    statusLabel: mapDocumentStatusLabel(document.status),
    timestamp: formatDateTime(
      document.finalizedAt || document.signedAt || document.createdAt,
    ),
    pendingLabel: pending.pendingLabel,
    pendingTone: pending.pendingTone,
    recipients: buildRecipients(reviews),
    menuActions: [
      { key: 'download', label: 'Download PDF', disabled: !isDownloadable },
      { key: 'sign', label: 'Sign / Approve', disabled: !pending.signToken },
      { key: 'audit', label: 'View Audit / History' },
      { key: 'error', label: 'View Error', disabled: !errorMessage },
      { key: 'retry', label: 'Retry Generation', disabled: !canRetry },
      { key: 'cancel', label: 'Cancel Generation', disabled: !canCancel },
    ],
    downloadUrl: `/api/v1/document-files/${document.id}`,
    signToken: pending.signToken,
    errorMessage,
    rawStatus: document.status,
  };
}
