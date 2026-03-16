import {
  listTemplates as repoListTemplates,
  getTemplateByName as repoGetTemplateByName,
} from './templates.repository';

type EnvWithDb = { DB: D1Database };

export const getTemplates = async (env: EnvWithDb) => {
  return repoListTemplates(env);
};

export const getTemplateByName = async (env: EnvWithDb, name: string) => {
  return repoGetTemplateByName(env, name);
};

export const requireTemplateByName = async (env: EnvWithDb, name: string) => {
  const template = await repoGetTemplateByName(env, name);

  if (!template) {
    throw new Error(`Template not found: ${name}`);
  }

  return template;
};

export const renderTemplateHtml = (
  htmlContent: string,
  data: Record<string, string | number | boolean | null | undefined>,
) => {
  let rendered = htmlContent;

  for (const [key, value] of Object.entries(data)) {
    rendered = rendered.replaceAll(
      `{{${key}}}`,
      value == null ? '' : String(value),
    );
  }

  return rendered;
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
