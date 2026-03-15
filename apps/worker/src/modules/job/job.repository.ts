import { eq } from 'drizzle-orm';
import { getDb } from '../../db/client';
import { jobs } from '../../db/schema';

type EnvWithDb = { DB: D1Database };

export const getJobById = async (env: EnvWithDb, id: string) => {
  const db = getDb(env);
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return result[0] ?? null;
};

export const listJobs = async (env: EnvWithDb) => {
  const db = getDb(env);
  return db.select().from(jobs);
};

export const createJob = async (
  env: EnvWithDb,
  data: typeof jobs.$inferInsert,
) => {
  const db = getDb(env);
  await db.insert(jobs).values(data);
  return getJobById(env, data.id);
};

export const updateJob = async (
  env: EnvWithDb,
  id: string,
  data: Partial<typeof jobs.$inferInsert>,
) => {
  const db = getDb(env);
  await db.update(jobs).set(data).where(eq(jobs.id, id));
  return getJobById(env, id);
};