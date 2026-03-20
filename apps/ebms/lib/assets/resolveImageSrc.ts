export function resolveImageSrc(
  value: string | null | undefined,
  fallback: string,
) {
  const normalized = value?.trim();

  if (
    !normalized ||
    normalized.toLowerCase() === 'null' ||
    normalized.toLowerCase() === 'undefined'
  ) {
    return fallback;
  }

  return normalized;
}
