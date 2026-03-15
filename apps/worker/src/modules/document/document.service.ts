import {
  createGeneratedDocument as repoCreateGeneratedDocument,
  listGeneratedDocuments as repoListGeneratedDocuments,
} from './document.repository';

type EnvWithDb = { DB: D1Database };

type CreateGeneratedDocumentInput = {
  jobId: string;
  employeeId: string;
  actionName: string;
  documentType: string;
  templateName: string;
  fileName: string;
  storagePath: string;
  fileUrl?: string | null;
  generationOrder: number;
  status: string;
};

export const getGeneratedDocuments = async (
  env: EnvWithDb,
  filters?: { jobId?: string; employeeId?: string },
) => {
  return repoListGeneratedDocuments(env, filters);
};

export const addGeneratedDocument = async (
  env: EnvWithDb,
  input: CreateGeneratedDocumentInput,
) => {
  return repoCreateGeneratedDocument(env, {
    id: crypto.randomUUID(),
    jobId: input.jobId,
    employeeId: input.employeeId,
    actionName: input.actionName,
    documentType: input.documentType,
    templateName: input.templateName,
    fileName: input.fileName,
    storagePath: input.storagePath,
    fileUrl: input.fileUrl ?? null,
    generationOrder: input.generationOrder,
    status: input.status,
    createdAt: new Date().toISOString(),
  });
};