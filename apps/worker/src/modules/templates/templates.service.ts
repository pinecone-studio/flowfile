import {
  listTemplates as repoListTemplates,
  getTemplateByName as repoGetTemplateByName,
} from './templates.repository';

type EnvWithDb = { DB: D1Database };

const TEMPLATE_TOKEN_PATTERN = /{{\s*([a-zA-Z0-9_.-]+)\s*}}/g;

function stripTemplateExtension(name: string) {
  return name.replace(/\.(html|docx)$/i, '');
}

function normalizeTemplateKey(name: string) {
  return stripTemplateExtension(name)
    .replace(/[^a-zA-Z0-9]+/g, '')
    .toLowerCase();
}

async function resolveTemplateRecord(env: EnvWithDb, name: string) {
  const exactMatch = await repoGetTemplateByName(env, name);

  if (exactMatch) {
    return exactMatch;
  }

  const normalizedName = normalizeTemplateKey(name);
  const templates = await repoListTemplates(env);

  return (
    templates.find(
      (template) => normalizeTemplateKey(template.name) === normalizedName,
    ) ?? null
  );
}

export const getTemplates = async (env: EnvWithDb) => {
  return repoListTemplates(env);
};

export const getTemplateByName = async (env: EnvWithDb, name: string) => {
  return resolveTemplateRecord(env, name);
};

export const requireTemplateByName = async (env: EnvWithDb, name: string) => {
  const template = await resolveTemplateRecord(env, name);

  if (!template) {
    throw new Error(`Template not found: ${name}`);
  }

  return template;
};

export const renderTemplateHtml = (
  htmlContent: string,
  data: Record<string, string | number | boolean | null | undefined>,
) => {
  return htmlContent.replace(TEMPLATE_TOKEN_PATTERN, (match, key: string) => {
    if (!Object.prototype.hasOwnProperty.call(data, key)) {
      return match;
    }

    const value = data[key];
    return value == null ? '' : String(value);
  });
};

export const findUnresolvedTemplateTokens = (htmlContent: string) => {
  const unresolvedTokens = new Set<string>();

  for (const match of htmlContent.matchAll(TEMPLATE_TOKEN_PATTERN)) {
    const token = match[1]?.trim();

    if (token) {
      unresolvedTokens.add(token);
    }
  }

  return [...unresolvedTokens];
};

export const renderTemplateHtmlStrict = (
  htmlContent: string,
  data: Record<string, string | number | boolean | null | undefined>,
  options?: {
    templateName?: string | null;
    documentType?: string | null;
  },
) => {
  const rendered = renderTemplateHtml(htmlContent, data);
  const unresolvedTokens = findUnresolvedTemplateTokens(rendered);

  if (unresolvedTokens.length === 0) {
    return rendered;
  }

  const targetLabel =
    options?.templateName?.trim() ||
    options?.documentType?.trim() ||
    'workflow document';

  throw new Error(
    `Template "${targetLabel}" has unresolved tokens: ${unresolvedTokens.join(', ')}`,
  );
};

export const injectSignatureIntoHtml = (
  htmlContent: string,
  signatureImageUrl: string,
) => {
  return htmlContent.replaceAll(
    '{{signature}}',
    `<img src="${signatureImageUrl}" alt="Signature" />`,
  );
};
