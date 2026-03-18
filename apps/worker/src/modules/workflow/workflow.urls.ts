export function normalizeBaseUrl(baseUrl?: string) {
  return baseUrl?.trim().replace(/\/+$/, '') ?? '';
}

export function buildAbsoluteUrl(baseUrl: string | undefined, path: string | null) {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  if (!normalizedBaseUrl) {
    return path;
  }

  return new URL(path, `${normalizedBaseUrl}/`).toString();
}

export const buildReviewUrl = (token: string) => `/api/v1/reviews/${token}`;

export const buildDocumentFileUrl = (documentId: string) =>
  `/api/v1/document-files/${documentId}`;