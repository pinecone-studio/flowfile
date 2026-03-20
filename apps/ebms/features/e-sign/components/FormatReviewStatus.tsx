function formatDocumentTitle(value: string | undefined) {
  if (!value) {
    return 'Document';
  }

  return value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatReviewStatus(value: string | null | undefined) {
  switch (value) {
    case 'approved':
      return 'Signed';
    case 'rejected':
      return 'Rejected';
    case 'opened':
      return 'Opened';
    case 'awaiting_review':
      return 'Awaiting signature';
    default:
      return value ? formatDocumentTitle(value) : 'Pending';
  }
}
