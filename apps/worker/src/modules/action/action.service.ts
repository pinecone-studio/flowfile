import {
  getActionByName,
  getActiveActionByName as repoGetActiveActionByName,
  getRecipientById,
  listActions,
  listRecipients,
} from './action.repository';

type EnvWithDb = { DB: D1Database };

type ActionRecord = {
  actionName: string;
  triggerFieldsJson: string;
  documentsJson: string;
  recipientsJson: string;
};

function safeParseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export const getAllActions = async (env: EnvWithDb) => {
  return listActions(env);
};

export const getAction = async (env: EnvWithDb, actionName: string) => {
  return getActionByName(env, actionName);
};

export const getActiveAction = async (env: EnvWithDb, actionName: string) => {
  const action = await repoGetActiveActionByName(env, actionName);

  if (!action) {
    throw new Error(`Active action not found: ${actionName}`);
  }

  return action;
};

export const getAllRecipients = async (env: EnvWithDb) => {
  return listRecipients(env);
};

export const getRecipient = async (env: EnvWithDb, id: string) => {
  return getRecipientById(env, id);
};

export const parseTriggerFields = (action: Pick<ActionRecord, 'triggerFieldsJson'>) => {
  return safeParseJson<string[]>(action.triggerFieldsJson, []);
};

export type ActionDocumentConfig = {
  documentType?: string;
  templateName?: string;
  fileName?: string;
  storagePath?: string;
};

export const parseDocuments = (action: Pick<ActionRecord, 'documentsJson'>) => {
  return safeParseJson<ActionDocumentConfig[]>(action.documentsJson, []);
};

export const parseRecipients = (action: Pick<ActionRecord, 'recipientsJson'>) => {
  return safeParseJson<unknown[]>(action.recipientsJson, []);
};