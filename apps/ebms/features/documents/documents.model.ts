import type {
  ApiAuditLog,
  ApiEmployee,
  ApiGeneratedDocument,
  ApiJob,
  ApiReviewRequest,
} from './documents.api';
import { buildFilteredDocumentsModel } from './documents.filters';
import { buildAllGroups, buildDocumentMaps } from './documents.group-builder';
import type { DocumentsCategoryKey, DocumentsPageModel } from './documents.types';

type DocumentsPageModelInput = {
  employees: ApiEmployee[];
  jobs: ApiJob[];
  documents: ApiGeneratedDocument[];
  reviewRequests: ApiReviewRequest[];
  auditLogs: ApiAuditLog[];
  search: string;
  categoryKey: DocumentsCategoryKey;
};

export function buildDocumentsPageModel(
  input: DocumentsPageModelInput,
): DocumentsPageModel {
  const maps = buildDocumentMaps(input);
  const groups = buildAllGroups({
    jobs: input.jobs,
    reviewRequests: input.reviewRequests,
    maps,
  });

  return buildFilteredDocumentsModel({
    groups,
    search: input.search,
    categoryKey: input.categoryKey,
  });
}
