import { and, eq } from 'drizzle-orm';
import { getDb } from '../../db/client';
import { generatedDocuments } from '../../db/schema';

type EnvWithDb = { DB: D1Database };

type DocumentFilters = {
  jobId?: string;
  employeeId?: string;
};

export const listGeneratedDocuments = async (
  env: EnvWithDb,
  filters?: DocumentFilters,
) => {
  const db = getDb(env);

  const conditions = [];

  if (filters?.jobId) {
    conditions.push(eq(generatedDocuments.jobId, filters.jobId));
  }

  if (filters?.employeeId) {
    conditions.push(eq(generatedDocuments.employeeId, filters.employeeId));
  }

  if (conditions.length === 0) {
    return db.select().from(generatedDocuments);
  }

  return db.select().from(generatedDocuments).where(and(...conditions));
};

export const getGeneratedDocumentById = async (
  env: EnvWithDb,
  id: string,
) => {
  const db = getDb(env);
  const result = await db
    .select()
    .from(generatedDocuments)
    .where(eq(generatedDocuments.id, id))
    .limit(1);

  return result[0] ?? null;
};

export const createGeneratedDocument = async (
  env: EnvWithDb,
  data: typeof generatedDocuments.$inferInsert,
) => {
  const db = getDb(env);
  await db.insert(generatedDocuments).values(data);
  return getGeneratedDocumentById(env, data.id);
};