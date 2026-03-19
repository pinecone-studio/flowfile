import type { ApiGeneratedDocument, ApiJob, ApiReviewRequest } from './documents.api';
import type { DocumentsProgressStep } from './documents.types';
import { formatDateTime } from './documents.formatters';

function buildStep(
  label: string,
  current: number,
  total: number,
  waitingLabel: string,
  completedAt: string,
): DocumentsProgressStep {
  return {
    label: `${label} ${current}/${total}`,
    status: total > 0 && current >= total ? completedAt : waitingLabel,
    tone:
      total > 0 && current >= total
        ? 'success'
        : current > 0
          ? 'warning'
          : 'neutral',
  };
}

export function buildProgressSteps(
  job: ApiJob,
  documents: ApiGeneratedDocument[],
  reviews: ApiReviewRequest[],
) {
  const totalDocuments = Math.max(job.documentsExpected || documents.length, 1);
  const generatedDocuments = documents.filter((document) =>
    ['generated', 'completed', 'awaiting_signatures', 'partially_signed'].includes(
      document.status,
    ),
  ).length;
  const firstOrderReviews = reviews.filter((review) => review.signOrder === 1);
  const firstOrderApproved = firstOrderReviews.filter(
    (review) => review.status === 'approved',
  ).length;
  const hrReviews = reviews.filter((review) =>
    review.signerRole.toLowerCase().includes('hr'),
  );
  const hrApproved = hrReviews.filter((review) => review.status === 'approved').length;
  const approvalReviews = reviews.filter(
    (review) =>
      review.signOrder > 1 && !review.signerRole.toLowerCase().includes('hr'),
  );
  const approvalApproved = approvalReviews.filter(
    (review) => review.status === 'approved',
  ).length;
  const distributed = documents.filter((document) => document.status === 'completed').length;
  const updatedLabel = `Completed ${formatDateTime(job.updatedAt)}`;

  return [
    buildStep('Generate', generatedDocuments, totalDocuments, 'Waiting...', updatedLabel),
    buildStep(
      'Employee Signed',
      firstOrderApproved,
      Math.max(firstOrderReviews.length, 1),
      'Waiting...',
      updatedLabel,
    ),
    buildStep(
      'HR Review',
      hrApproved,
      Math.max(hrReviews.length, 1),
      'Waiting...',
      updatedLabel,
    ),
    buildStep(
      'Approval',
      approvalApproved,
      Math.max(approvalReviews.length, 1),
      'Waiting...',
      updatedLabel,
    ),
    buildStep(
      'Distribution',
      distributed,
      totalDocuments,
      job.status === 'completed'
        ? `Completed ${formatDateTime(job.completedAt)}`
        : 'Waiting...',
      updatedLabel,
    ),
  ];
}
