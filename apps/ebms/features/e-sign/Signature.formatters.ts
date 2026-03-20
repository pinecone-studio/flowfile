export function formatDateParts(value: string | null | undefined) {
  if (!value) {
    return { date: '-', time: '-' };
  }

  const date = new Date(value);
  return {
    date: new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(date),
    time: new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date),
  };
}

export function formatDocumentTitle(value: string | undefined) {
  if (!value) {
    return 'Document';
  }

  return value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatSignerRole(value: string | null | undefined) {
  if (!value) {
    return 'Signer';
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
