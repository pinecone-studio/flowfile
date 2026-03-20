'use client';

import { useEffect, useRef, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import SignaturePad from 'signature_pad';
import { buildApiUrl, requestJson } from '../../lib/api/client';
import { getEmployeeById } from '../../lib/employee/api';

type ReviewResponse = {
  reviewRequest: {
    reviewerEmail: string;
    reviewerName: string | null;
    signerRole: string;
    status: string;
  };
  job: {
    employeeId: string;
  } | null;
  document: {
    id: string;
    documentType: string;
    fileName: string;
    status: string;
    createdAt: string;
  } | null;
};

type ApiEmployee = {
  firstName: string;
  lastName: string;
};

function formatDateParts(value: string | null | undefined) {
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

function formatSignerRole(value: string | null | undefined) {
  if (!value) {
    return 'Signer';
  }

  return value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatReviewStatus(value: string | null | undefined) {
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

export default function SignPage() {
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn } = useAuth();
  const token = searchParams.get('token');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [employeeName, setEmployeeName] = useState('-');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewVersion, setPreviewVersion] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const width = canvas.parentElement?.clientWidth ?? 560;
      const height = 360;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      padRef.current?.clear();
    };

    resizeCanvas();

    padRef.current = new SignaturePad(canvas, {
      backgroundColor: 'rgba(0,0,0,0)',
      penColor: '#0b1832',
      minWidth: 1.2,
      maxWidth: 2.8,
    });

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      padRef.current?.off();
      padRef.current = null;
    };
  }, []);

  useEffect(() => {
    let active = true;

    if (!token) {
      setLoading(false);
      setError('Missing review token.');
      return;
    }

    setLoading(true);
    setError(null);

    requestJson<ReviewResponse>(`/api/v1/reviews/${token}`)
      .then((result) => {
        if (!active) {
          return;
        }

        setReview(result);
      })
      .catch((requestError: unknown) => {
        if (!active) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Failed to load review request.',
        );
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    let active = true;

    if (!review) {
      return undefined;
    }

    if (!review.job?.employeeId || !isLoaded || !isSignedIn) {
      setEmployeeName(
        review.reviewRequest.reviewerName ||
          review.reviewRequest.reviewerEmail ||
          '-',
      );
      return undefined;
    }

    getEmployeeById(review.job.employeeId)
      .then((employee: ApiEmployee) => {
        if (active) {
          setEmployeeName(`${employee.firstName}.${employee.lastName.charAt(0)}`);
        }
      })
      .catch(() => {
        if (active) {
          setEmployeeName(
            review.reviewRequest.reviewerName ||
              review.reviewRequest.reviewerEmail ||
              '-',
          );
        }
      });

    return () => {
      active = false;
    };
  }, [isLoaded, isSignedIn, review]);

  const handleApprove = async () => {
    if (!token) {
      return;
    }

    if (padRef.current?.isEmpty()) {
      window.alert('Please sign before approving.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setMessage(null);

      const updatedReview = await requestJson<ReviewResponse>(
        `/api/v1/reviews/${token}/approve`,
        {
          method: 'POST',
          body: JSON.stringify({
            reviewerName: review?.reviewRequest.reviewerName || undefined,
            signatureImageUrl: canvasRef.current?.toDataURL() ?? null,
            signMethod: 'signature_pad',
          }),
        },
      );

      setReview(updatedReview);
      setPreviewVersion((current) => current + 1);
      setMessage('Document approved successfully.');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to approve document.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const dateParts = formatDateParts(review?.document?.createdAt);
  const reviewStatusLabel = formatReviewStatus(review?.reviewRequest.status);
  const signerRoleLabel = formatSignerRole(review?.reviewRequest.signerRole);
  const signerName =
    review?.reviewRequest.reviewerName ||
    review?.reviewRequest.reviewerEmail ||
    '-';
  const contractPreviewUrl = review?.document?.id
    ? `${buildApiUrl(`/api/v1/document-previews/${review.document.id}`)}?preview=${previewVersion}`
    : null;
  const isApproved = review?.reviewRequest.status === 'approved' || Boolean(message);
  const isRejected = review?.reviewRequest.status === 'rejected';

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

  return (
    <div className="w-full max-w-[1180px] overflow-hidden rounded-[28px] bg-[#08101c]/95 shadow-[0_40px_80px_rgba(0,0,0,0.38)]">
      <div className="grid lg:grid-cols-[minmax(0,1.2fr)_420px]">
        <div className="border-b border-[#17325f] lg:border-b-0 lg:border-r">
          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[16px] uppercase tracking-[0.18em] text-[#7d92be]">
                  Contract Preview
                </p>
                <h1 className="mt-3 text-[26px] font-semibold tracking-[-0.03em] text-white">
                  {formatDocumentTitle(review?.document?.documentType)}
                </h1>
                <p className="mt-3 text-[16px] text-[#b9cae7]">
                  Employee: {employeeName}
                </p>
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
                Role: {signerRoleLabel}
              </span>
              <span className="rounded-full border border-[#2b4d89] bg-[#10213d] px-3 py-1">
                Status: {reviewStatusLabel}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-[14px] text-[#9db2d9]">
              <span>The contract below is the generated backend document for this review.</span>
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
              {contractPreviewUrl ? (
                <iframe
                  key={contractPreviewUrl}
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
          </div>
        </div>

        <div className="flex flex-col">
          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-white">
              Sign Here
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-[#a8bad9]">
              Review the contract on the left, then sign below to approve it.
            </p>

            {message ? (
              <div className="mt-6 rounded-[14px] border border-[#255f37] bg-[#14301e] px-4 py-3 text-[15px] text-[#d1ffe0]">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="mt-6 rounded-[14px] border border-[#7f2834] bg-[#39131c] px-4 py-3 text-[15px] text-[#ffd7df]">
                {error}
              </div>
            ) : null}

            <div className="mt-8 rounded-[18px] bg-[#8fa1c1] p-0">
              <canvas
                ref={canvasRef}
                className="block w-full rounded-[18px] touch-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleApprove}
            disabled={submitting || isApproved || isRejected}
            className="mt-auto flex h-[70px] w-full items-center justify-center bg-[#23478a] text-[24px] font-semibold text-white disabled:opacity-60"
          >
            {submitting
              ? 'Approving...'
              : isRejected
                ? 'Rejected'
                : isApproved
                  ? 'Approved'
                  : 'Approve'}
          </button>
        </div>
      </div>
    </div>
  );
}
