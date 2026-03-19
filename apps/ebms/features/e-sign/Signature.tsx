'use client';

import { useEffect, useRef, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import SignaturePad from 'signature_pad';
import { requestJson } from '../../lib/api/client';

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
    documentType: string;
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

export default function SignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [employeeName, setEmployeeName] = useState('-');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      .then(async (result) => {
        if (!active) {
          return;
        }

        setReview(result);

        if (result.job?.employeeId) {
          try {
            const employee = await requestJson<ApiEmployee>(
              `/employees/${result.job.employeeId}`,
            );
            if (active) {
              setEmployeeName(`${employee.firstName}.${employee.lastName.charAt(0)}`);
            }
          } catch {
            if (active) {
              setEmployeeName(result.reviewRequest.reviewerName || '-');
            }
          }
        }
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

      await requestJson(`/api/v1/reviews/${token}/approve`, {
        method: 'POST',
        body: JSON.stringify({
          reviewerName: review?.reviewRequest.reviewerName || undefined,
          signatureImageUrl: padRef.current?.toDataURL(),
          signMethod: 'signature_pad',
        }),
      });

      setMessage('Document approved successfully.');
      router.refresh();
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
    <div className="w-full max-w-[670px] overflow-hidden rounded-[28px] bg-[#08101c]/95 shadow-[0_40px_80px_rgba(0,0,0,0.38)]">
      <div className="px-12 py-10">
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-white">
          Signing Form
        </h1>

        <div className="mt-10 flex items-start justify-between gap-10">
          <div>
            <p className="text-[20px] text-[#7d92be]">{employeeName}</p>
            <p className="mt-1 text-[22px] text-[#f0f4ff]">
              {formatDocumentTitle(review?.document?.documentType)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[20px] text-[#7d92be]">{dateParts.date}</p>
            <p className="text-[22px] text-[#f0f4ff]">{dateParts.time}</p>
          </div>
        </div>

        <div className="mt-10 h-px bg-[#2b4d89]/85" />

        <h2 className="mt-8 text-[28px] font-semibold text-white">Sign Here</h2>

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
        disabled={submitting || Boolean(message)}
        className="flex h-[70px] w-full items-center justify-center bg-[#23478a] text-[24px] font-semibold text-white disabled:opacity-60"
      >
        {submitting ? 'Approving...' : message ? 'Approved' : 'Approve'}
      </button>
    </div>
  );
}
