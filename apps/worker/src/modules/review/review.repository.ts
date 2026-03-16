import { and, eq } from 'drizzle-orm';
import { getDb } from '../../db/client';
import { reviewRequests } from '../../db/schema';

type EnvWithDb = { DB: D1Database };

export const listReviewRequests = async (
  env: EnvWithDb,
  filters?: { jobId?: string; documentId?: string },
) => {
  const db = getDb(env);
  const conditions = [];

  if (filters?.jobId) {
    conditions.push(eq(reviewRequests.jobId, filters.jobId));
  }

  if (filters?.documentId) {
    conditions.push(eq(reviewRequests.documentId, filters.documentId));
  }

  if (conditions.length === 0) {
    return db.select().from(reviewRequests);
  }

  return db.select().from(reviewRequests).where(and(...conditions));
};

export const getReviewRequestByToken = async (
  env: EnvWithDb,
  token: string,
) => {
  const db = getDb(env);
  const result = await db
    .select()
    .from(reviewRequests)
    .where(eq(reviewRequests.reviewToken, token))
    .limit(1);

  return result[0] ?? null;
};

export const getReviewRequestById = async (env: EnvWithDb, id: string) => {
  const db = getDb(env);
  const result = await db
    .select()
    .from(reviewRequests)
    .where(eq(reviewRequests.id, id))
    .limit(1);

  return result[0] ?? null;
};

export const createReviewRequest = async (
  env: EnvWithDb,
  data: typeof reviewRequests.$inferInsert,
) => {
  const db = getDb(env);
  await db.insert(reviewRequests).values(data);
  return getReviewRequestById(env, data.id);
};

export const updateReviewRequest = async (
  env: EnvWithDb,
  id: string,
  data: Partial<typeof reviewRequests.$inferInsert>,
) => {
  const db = getDb(env);
  await db.update(reviewRequests).set(data).where(eq(reviewRequests.id, id));
  return getReviewRequestById(env, id);
};
