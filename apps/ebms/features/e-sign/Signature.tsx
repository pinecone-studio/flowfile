'use client';

import { LoaderCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { buildLiveContractPreviewHtml } from './Signature.preview';
import { SignContractPreview } from './components/SignContractPreview';
import { SignPadSection } from './components/SignPadSection';

import { useSignReviewController } from './useSignReviewController';
import { useSignaturePad } from './useSignaturePad';

export default function SignPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const token = useSearchParams().get('token');
  const {
    approveReview,
    contractPreviewHtml,
    contractPreviewUrl,
    employeeName,
    error,
    loading,
    message,
    previewVersion,
    review,
    submitting,
  } = useSignReviewController({
    token,
    isLoaded: Boolean(isLoaded),
    isSignedIn: Boolean(isSignedIn),
  });
  const {
    canvasRef,
    clearSignature,
    draftSignatureUrl,
    readSignatureDataUrl,
    saveSignature,
  } = useSignaturePad(token);

  const isApproved =
    review?.reviewRequest.status === 'approved' || Boolean(message);
  const isRejected = review?.reviewRequest.status === 'rejected';
  const liveSignatureUrl =
    draftSignatureUrl || review?.reviewRequest.signatureImageUrl || null;
  const previewFrameKey = review
    ? `${review.document?.id ?? 'document'}:${review.reviewRequest.status}:${review.reviewRequest.approvedAt ?? previewVersion}`
    : 'contract-preview';
  const liveContractPreviewHtml = contractPreviewHtml
    ? buildLiveContractPreviewHtml({
        html: contractPreviewHtml,
        signatureImageUrl: liveSignatureUrl,
        signerRole: review?.reviewRequest.signerRole,
        signOrder: review?.reviewRequest.signOrder,
        isApproved,
      })
    : null;

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-[18px] text-white">
        <LoaderCircle className="mr-3 h-5 w-5 animate-spin" />
        Loading review...
      </div>
    );
  }

  if (error && !review) {
    return (
      <div className="w-full max-w-[670px] rounded-[28px] bg-[#08101c]/95 p-10 text-[18px] text-[#ffd7df] shadow-[0_40px_80px_rgba(0,0,0,0.38)]">
        {error}
      </div>
    );
  }

  if (!review) {
    return null;
  }

  return (
    <div className="w-full max-w-[1320px] overflow-hidden rounded-[28px] bg-[#08101c]/95 shadow-[0_40px_80px_rgba(0,0,0,0.38)]">
      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_560px]">
        <SignContractPreview
          review={review}
          employeeName={employeeName}
          contractPreviewUrl={contractPreviewUrl}
          liveContractPreviewHtml={liveContractPreviewHtml}
          draftSignatureUrl={draftSignatureUrl}
          isApproved={isApproved}
          previewFrameKey={previewFrameKey}
        />
        <SignPadSection
          canvasRef={canvasRef}
          error={error}
          hasSignature={Boolean(draftSignatureUrl)}
          isApproved={isApproved}
          isRejected={isRejected}
          message={message}
          onClear={clearSignature}
          onSave={saveSignature}
          onApprove={() => {
            const signatureImageUrl = readSignatureDataUrl();
            if (!signatureImageUrl) {
              window.alert('Please sign before approving.');
              return;
            }
            void approveReview(signatureImageUrl);
          }}
          submitting={submitting}
        />
      </div>
    </div>
  );
}
 
