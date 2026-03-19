import type {
  ApiAuditLog,
  ApiEmployee,
  ApiGeneratedDocument,
  ApiJob,
  ApiReviewRequest,
} from './documents.api';
import { actionLabels, actionTones } from './documents.constants';
import { formatDateTime, formatShortName } from './documents.formatters';
import { buildGroupItem } from './documents.item-builder';
import { buildProgressSteps } from './documents.progress';
import { mapJobState } from './documents.status';
import type { DocumentsCategoryKey, DocumentsPageGroup } from './documents.types';

type DocumentsMaps = {
  employeeMap: Map<string, ApiEmployee>;
  documentsByJobId: Map<string, ApiGeneratedDocument[]>;
  reviewsByDocumentId: Map<string, ApiReviewRequest[]>;
  auditLogsByJobId: Map<string, ApiAuditLog[]>;
};

export function buildDocumentMaps(input: {
  employees: ApiEmployee[];
  documents: ApiGeneratedDocument[];
  reviewRequests: ApiReviewRequest[];
  auditLogs: ApiAuditLog[];
}): DocumentsMaps {
  const employeeMap = new Map(input.employees.map((employee) => [employee.id, employee]));
  const documentsByJobId = new Map<string, ApiGeneratedDocument[]>();
  const reviewsByDocumentId = new Map<string, ApiReviewRequest[]>();
  const auditLogsByJobId = new Map<string, ApiAuditLog[]>();

  for (const document of input.documents) {
    const current = documentsByJobId.get(document.jobId) ?? [];
    current.push(document);
    documentsByJobId.set(document.jobId, current);
  }

  for (const review of input.reviewRequests) {
    const current = reviewsByDocumentId.get(review.documentId) ?? [];
    current.push(review);
    reviewsByDocumentId.set(review.documentId, current);
  }

  for (const log of input.auditLogs) {
    if (!log.jobId) {
      continue;
    }

    const current = auditLogsByJobId.get(log.jobId) ?? [];
    current.push(log);
    auditLogsByJobId.set(log.jobId, current);
  }

  return { employeeMap, documentsByJobId, reviewsByDocumentId, auditLogsByJobId };
}

export function buildAllGroups(input: {
  jobs: ApiJob[];
  reviewRequests: ApiReviewRequest[];
  maps: DocumentsMaps;
}): DocumentsPageGroup[] {
  const { employeeMap, documentsByJobId, reviewsByDocumentId, auditLogsByJobId } =
    input.maps;

  return input.jobs
    .slice()
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map((job) => {
      const employee = employeeMap.get(job.employeeId);
      if (!employee) {
        return null;
      }

      const jobDocuments = (documentsByJobId.get(job.id) ?? []).slice().sort(
        (left, right) => left.generationOrder - right.generationOrder,
      );
      const jobAuditLogs = (auditLogsByJobId.get(job.id) ?? []).slice().sort(
        (left, right) => right.createdAt.localeCompare(left.createdAt),
      );
      const categoryKey = (
        job.actionName in actionLabels ? job.actionName : 'add_employee'
      ) as Exclude<DocumentsCategoryKey, 'all'>;

      return {
        id: job.id,
        employeeId: employee.id,
        employeeName: formatShortName(employee),
        employeeCode: employee.employeeCode,
        employeeAvatar: employee.imageUrl,
        date: formatDateTime(job.createdAt),
        latestAction: actionLabels[categoryKey],
        state: mapJobState(job),
        categoryKey,
        rawJobStatus: job.status,
        actionName: job.actionName,
        tone: actionTones[categoryKey],
        progressSteps: buildProgressSteps(
          job,
          jobDocuments,
          input.reviewRequests.filter((review) => review.jobId === job.id),
        ),
        items: jobDocuments.map((document) =>
          buildGroupItem(
            job,
            document,
            (reviewsByDocumentId.get(document.id) ?? []).slice().sort(
              (left, right) => left.signOrder - right.signOrder,
            ),
            jobAuditLogs,
          ),
        ),
      } satisfies DocumentsPageGroup;
    })
    .filter((group): group is DocumentsPageGroup => Boolean(group));
}
