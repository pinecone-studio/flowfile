import { and, eq } from 'drizzle-orm';
import { getDb } from '../../db/client';
import { auditLog } from '../../db/schema';

type EnvWithDb = { DB: D1Database };

type AuditFilters = {
  employeeId?: string;
  actionName?: string;
  jobId?: string;
};

export const listAuditLogs = async (env: EnvWithDb, filters?: AuditFilters) => {
  const db = getDb(env);

  const conditions = [];

  if (filters?.employeeId) {
    conditions.push(eq(auditLog.employeeId, filters.employeeId));
  }

  if (filters?.actionName) {
    conditions.push(eq(auditLog.actionName, filters.actionName));
  }

  if (filters?.jobId) {
    conditions.push(eq(auditLog.jobId, filters.jobId));
  }

  if (conditions.length === 0) {
    return db.select().from(auditLog);
  }

  return db.select().from(auditLog).where(and(...conditions));
};

export const createAuditLog = async (
  env: EnvWithDb,
  data: typeof auditLog.$inferInsert,
) => {
  const db = getDb(env);
  await db.insert(auditLog).values(data);

  const result = await db
    .select()
    .from(auditLog)
    .where(eq(auditLog.id, data.id))
    .limit(1);

  return result[0] ?? null;
};