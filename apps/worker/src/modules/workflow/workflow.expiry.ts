import { REVIEW_LINK_TTL_DAYS } from './workflow.constants';

export function createReviewExpiryDate(days = REVIEW_LINK_TTL_DAYS) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

export function isExpired(expiresAt: string | null | undefined) {
  if (!expiresAt) {
    return false;
  }

  return Date.now() > new Date(expiresAt).getTime();
}

export function isReviewLinkUsable(input: {
  expiresAt?: string | null;
  usedAt?: string | null;
}) {
  if (input.usedAt) {
    return false;
  }

  if (isExpired(input.expiresAt)) {
    return false;
  }

  return true;
}

export function formatExpiryDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
}