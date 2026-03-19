import type { ApiGeneratedDocument, ApiJob, ApiReviewRequest } from './documents.api';
import type { DocumentsPageItem, DocumentRecipient } from './documents.types';
import { formatSignerRole, toInitials } from './documents.formatters';

export function mapJobState(job: ApiJob) {
  switch (job.status) {
    case 'completed':
      return 'Completed';
    case 'rejected':
      return 'Rejected during review';
    case 'canceled':
      return 'Canceled';
    case 'awaiting_signatures':
      return 'Waiting HR Review...';
    case 'failed':
      return 'Generation failed';
    default:
      return 'Generating documents...';
  }
}

export function mapDocumentStatusLabel(status: string) {
  switch (status) {
    case 'completed':
    case 'generated':
      return 'Generated';
    case 'awaiting_signatures':
      return 'Awaiting Signatures';
    case 'partially_signed':
      return 'Partially Signed';
    case 'rejected':
    case 'failed':
      return 'Failed';
    case 'canceled':
      return 'Canceled';
    default:
      return 'Generating...';
  }
}

export function buildPendingLabel(
  document: ApiGeneratedDocument,
  reviews: ApiReviewRequest[],
): Pick<DocumentsPageItem, 'pendingLabel' | 'pendingTone' | 'signToken'> {
  if (!reviews.length) {
    if (document.status === 'completed') {
      return { pendingLabel: 'All Signed', pendingTone: 'success', signToken: null };
    }

    if (document.status === 'rejected' || document.status === 'failed') {
      return {
        pendingLabel: 'Generation Error',
        pendingTone: 'warning',
        signToken: null,
      };
    }

    if (document.status === 'canceled') {
      return { pendingLabel: 'Canceled', pendingTone: 'neutral', signToken: null };
    }

    return {
      pendingLabel: 'Waiting Generation',
      pendingTone: 'neutral',
      signToken: null,
    };
  }

  const approvedCount = reviews.filter((review) => review.status === 'approved').length;
  const nextReview = reviews
    .filter((review) => review.status === 'awaiting_review' || review.status === 'opened')
    .sort((left, right) => left.signOrder - right.signOrder)[0];
  const rejectedReview = reviews.find((review) => review.status === 'rejected');

  if (rejectedReview) {
    return {
      pendingLabel: `${formatSignerRole(rejectedReview.signerRole)} Rejected`,
      pendingTone: 'warning',
      signToken: null,
    };
  }

  if (approvedCount === reviews.length) {
    return { pendingLabel: 'All Signed', pendingTone: 'success', signToken: null };
  }

  if (nextReview) {
    return {
      pendingLabel: `Waiting ${formatSignerRole(nextReview.signerRole)}`,
      pendingTone: 'warning',
      signToken: nextReview.reviewToken,
    };
  }

  return {
    pendingLabel: 'Waiting Review',
    pendingTone: 'neutral',
    signToken: null,
  };
}

export function buildRecipients(reviews: ApiReviewRequest[]): DocumentRecipient[] {
  const unique = new Map<string, DocumentRecipient>();

  for (const review of reviews) {
    const name = review.reviewerName?.trim() || review.reviewerEmail;
    if (!unique.has(review.reviewerEmail)) {
      unique.set(review.reviewerEmail, {
        id: review.id,
        name,
        initials: toInitials(name),
      });
    }
  }

  return Array.from(unique.values());
}
