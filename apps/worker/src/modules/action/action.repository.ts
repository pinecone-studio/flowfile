import { and, eq } from 'drizzle-orm';
import { getDb } from '../../db/client';
import { actionRegistry, recipients } from '../../db/schema';

type EnvWithDb = { DB: D1Database };

export const getActionByName = async (
  env: EnvWithDb,
  actionName: string,
) => {
  const db = getDb(env);
  const result = await db
    .select()
    .from(actionRegistry)
    .where(eq(actionRegistry.actionName, actionName))
    .limit(1);

  return result[0] ?? null;
};

export const getActiveActionByName = async (
  env: EnvWithDb,
  actionName: string,
) => {
  const db = getDb(env);
  const result = await db
    .select()
    .from(actionRegistry)
    .where(
      and(
        eq(actionRegistry.actionName, actionName),
        eq(actionRegistry.isActive, true),
      ),
    )
    .limit(1);

  return result[0] ?? null;
};

export const listActions = async (env: EnvWithDb) => {
  const db = getDb(env);
  return db.select().from(actionRegistry);
};

export const listActiveActions = async (env: EnvWithDb) => {
  const db = getDb(env);
  return db
    .select()
    .from(actionRegistry)
    .where(eq(actionRegistry.isActive, true));
};

export const listRecipients = async (env: EnvWithDb) => {
  const db = getDb(env);
  return db.select().from(recipients);
};

export const getRecipientById = async (env: EnvWithDb, id: string) => {
  const db = getDb(env);
  const result = await db
    .select()
    .from(recipients)
    .where(eq(recipients.id, id))
    .limit(1);

  return result[0] ?? null;
};