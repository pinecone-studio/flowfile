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

const actionAliases: Record<string, string> = {
  salary_increase: 'promote_employee',
  promote_employee: 'salary_increase',
};

const resolveActionLookupCandidates = (actionName: string) => {
  const normalized = actionName.trim();
  const aliasTarget = actionAliases[normalized];

  return aliasTarget ? [normalized, aliasTarget] : [normalized];
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
  for (const candidate of resolveActionLookupCandidates(actionName)) {
    const action = await getActionByName(env, candidate);

    if (action) {
      return action;
    }
  }

  return null;
};

export const getActiveAction = async (env: EnvWithDb, actionName: string) => {
  for (const candidate of resolveActionLookupCandidates(actionName)) {
    const action = await repoGetActiveActionByName(env, candidate);

    if (action) {
      return action;
    }
  }

  throw new Error(`Active action not found: ${actionName}`);
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

type RawActionDocumentConfig = {
  id?: string;
  template?: string;
  order?: number;
  documentType?: string;
  templateName?: string;
  fileName?: string;
  storagePath?: string;
  generationOrder?: number;
};

export type ActionDocumentConfig = {
  documentType: string;
  templateName: string;
  fileName: string;
  storagePath?: string;
  generationOrder: number;
};

export const parseDocuments = (action: Pick<ActionRecord, 'documentsJson'>) => {
  const documents = safeParseJson<RawActionDocumentConfig[]>(
    action.documentsJson,
    [],
  );

  return documents.map((document, index) => {
    const documentType = document.documentType ?? document.id ?? `document_${index + 1}`;
    const templateName =
      document.templateName ?? document.template ?? `${documentType}.html`;
    const fileName =
      document.fileName ??
      templateName.replace(/\.(docx|html)$/i, '.pdf');

    return {
      documentType,
      templateName,
      fileName,
      storagePath: document.storagePath,
      generationOrder: document.generationOrder ?? document.order ?? index + 1,
    };
  });
};

export const parseRecipients = (action: Pick<ActionRecord, 'recipientsJson'>) => {
  const recipientsJson = safeParseJson<Array<string | { roleKey?: string }>>(
    action.recipientsJson,
    [],
  );

  return recipientsJson
    .map((recipient) =>
      typeof recipient === 'string' ? recipient : recipient.roleKey ?? '',
    )
    .filter(Boolean);
};
