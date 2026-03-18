import type { WorkflowRecipient } from '../workflow/workflow.service';
import type { ReviewWorkflowRecipientSource } from './review.types';

export function nowIso() {
  return new Date().toISOString();
}

export function reviewsToWorkflowRecipients(
  reviews: ReviewWorkflowRecipientSource[],
): WorkflowRecipient[] {
  return reviews.map((review) => ({
    email: review.reviewerEmail,
    name: review.reviewerName,
    role: review.signerRole,
    signOrder: review.signOrder,
  }));
}
