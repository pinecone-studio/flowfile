import {
  createGeneratedDocument as repoCreateGeneratedDocument,
  getGeneratedDocumentById as repoGetGeneratedDocumentById,
  listGeneratedDocuments as repoListGeneratedDocuments,
  updateGeneratedDocument as repoUpdateGeneratedDocument,
} from './document.repository';
import { generatedDocuments } from '../../db/schema';

type EnvWithBindings = {
  DB: D1Database;
  DOCS_BUCKET?: R2Bucket;
};

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
  env: EnvWithBindings,
  filters?: { jobId?: string; employeeId?: string },
) => {
  return repoListGeneratedDocuments(env, filters);
};

export const getGeneratedDocumentById = async (
  env: EnvWithBindings,
  id: string,
) => {
  return repoGetGeneratedDocumentById(env, id);
};

export const addGeneratedDocument = async (
  env: EnvWithBindings,
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

export const updateGeneratedDocument = async (
  env: EnvWithBindings,
  id: string,
  input: Partial<typeof generatedDocuments.$inferInsert>,
) => {
  return repoUpdateGeneratedDocument(env, id, input);
};

export const storeGeneratedDocumentHtml = async (
  env: EnvWithBindings,
  storagePath: string,
  htmlContent: string,
) => {
  if (!env.DOCS_BUCKET) {
    return;
  }

  await env.DOCS_BUCKET.put(storagePath, htmlContent, {
    httpMetadata: {
      contentType: 'text/html; charset=utf-8',
    },
  });
};
