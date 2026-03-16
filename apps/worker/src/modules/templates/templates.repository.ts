import { eq } from 'drizzle-orm';
import { getDb } from '../../db/client';
import { templates } from '../../db/schema';

type EnvWithDb = { DB: D1Database };

export const listTemplates = async (env: EnvWithDb) => {
  const db = getDb(env);
  return db.select().from(templates);
};

export const getTemplateByName = async (env: EnvWithDb, name: string) => {
  const db = getDb(env);
  const result = await db
    .select()
    .from(templates)
    .where(eq(templates.name, name))
    .limit(1);

  return result[0] ?? null;
};

export const createTemplate = async (
  env: EnvWithDb,
  data: typeof templates.$inferInsert,
) => {
  const db = getDb(env);
  await db.insert(templates).values(data);
  return getTemplateByName(env, data.name);
};

export const updateTemplate = async (
  env: EnvWithDb,
  name: string,
  data: Partial<typeof templates.$inferInsert>,
) => {
  const db = getDb(env);
  await db.update(templates).set(data).where(eq(templates.name, name));
  return getTemplateByName(env, name);
};