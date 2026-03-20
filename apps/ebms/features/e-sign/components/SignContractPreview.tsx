import type { ReviewResponse } from '../Signature.types';
import {
  formatDateParts,
  formatDocumentTitle,
  formatReviewStatus,
  formatSignerRole,
} from '../Signature.formatters';

type SignContractPreviewProps = {
  contractPreviewUrl: string | null;
  draftSignatureUrl: string | null;
  employeeName: string;
  isApproved: boolean;
  liveContractPreviewHtml: string | null;
  previewFrameKey: string;
  review: ReviewResponse;
};

export function SignContractPreview({
  review,
  employeeName,
  contractPreviewUrl,
  liveContractPreviewHtml,
  draftSignatureUrl,
  isApproved,
  previewFrameKey,
}: SignContractPreviewProps) {
  const dateParts = formatDateParts(review.document?.createdAt);
  const signerName =
    review.reviewRequest.reviewerName || review.reviewRequest.reviewerEmail || '-';

  return (
    <div className="border-b border-[#17325f] lg:border-b-0 lg:border-r">
      <div className="px-6 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[16px] uppercase tracking-[0.18em] text-[#7d92be]">
              Contract Preview
            </p>
            <h1 className="mt-3 text-[26px] font-semibold tracking-[-0.03em] text-white">
              {formatDocumentTitle(review.document?.documentType)}
            </h1>
            <p className="mt-3 text-[16px] text-[#b9cae7]">Employee: {employeeName}</p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[18px] text-[#7d92be]">{dateParts.date}</p>
            <p className="text-[18px] text-[#f0f4ff]">{dateParts.time}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-[13px] text-[#dbe7ff]">
          <span className="rounded-full border border-[#2b4d89] bg-[#10213d] px-3 py-1">
            Signer: {signerName}
          </span>
          <span className="rounded-full border border-[#2b4d89] bg-[#10213d] px-3 py-1">
            Role: {formatSignerRole(review.reviewRequest.signerRole)}
          </span>
          <span className="rounded-full border border-[#2b4d89] bg-[#10213d] px-3 py-1">
            Status: {formatReviewStatus(review.reviewRequest.status)}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-[14px] text-[#9db2d9]">
          <span>
            The contract below is the generated contract.
            {isApproved
              ? ' It refreshes with the signed contract after approval.'
              : draftSignatureUrl
                ? ' The contract is showing your live signature while you draw.'
                : ''}
          </span>
          {contractPreviewUrl ? (
            <a
              href={contractPreviewUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[#dce8ff] underline decoration-[#4a79c6]/70 underline-offset-4"
            >
              Open full contract
            </a>
          ) : null}
        </div>

        <div className="mt-8 overflow-hidden rounded-[22px] border border-[#23478a]/60 bg-[#060b12]">
          {liveContractPreviewHtml ? (
            <iframe
              key={previewFrameKey}
              title="Contract preview"
              srcDoc={liveContractPreviewHtml}
              className="h-[540px] w-full bg-white sm:h-[660px] lg:h-[760px]"
            />
          ) : contractPreviewUrl ? (
            <iframe
              key={`${previewFrameKey}:${contractPreviewUrl}`}
              title="Contract preview"
              src={contractPreviewUrl}
              className="h-[540px] w-full bg-white sm:h-[660px] lg:h-[760px]"
            />
          ) : (
            <div className="flex min-h-[360px] items-center justify-center px-6 text-center text-[16px] text-[#aab9d5]">
              The contract preview is not available for this review yet.
            </div>
          )}
        </div>

        {isApproved ? (
          <div className="mt-6 rounded-[14px] border border-[#255f37] bg-[#14301e] px-4 py-3 text-[15px] text-[#d1ffe0]">
            The contract preview has been updated with your signature in the document.
          </div>
        ) : null}
      </div>
    </div>
  );
}
