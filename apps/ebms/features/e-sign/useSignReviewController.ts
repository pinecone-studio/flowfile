'use client';

import { useEffect, useMemo, useState } from 'react';
import { buildApiUrl, requestJson } from '../../lib/api/client';
import { getEmployeeById } from '../../lib/employee/api';
import type { ApiEmployee, ReviewResponse } from './Signature.types';

type UseSignReviewControllerParams = {
  isLoaded: boolean;
  isSignedIn: boolean;
  token: string | null;
};

async function fetchPreviewHtml(url: string) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Preview request failed with status ${response.status}`);
  }
  return response.text();
}

export function useSignReviewController({ token, isLoaded, isSignedIn }: UseSignReviewControllerParams) {
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [employeeName, setEmployeeName] = useState('-');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewVersion, setPreviewVersion] = useState(0);
  const [contractPreviewHtml, setContractPreviewHtml] = useState<string | null>(null);
  const contractPreviewUrl = useMemo(() => (
    review?.document?.id
      ? `${buildApiUrl(`/api/v1/document-previews/${review.document.id}`)}?preview=${previewVersion}`
      : null
  ), [previewVersion, review?.document?.id]);

  useEffect(() => {
    let active = true;

    if (!token) {
      setLoading(false);
      setError('Missing review token.');
      setReview(null);
      return undefined;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    requestJson<ReviewResponse>(`/api/v1/reviews/${token}`)
      .then((result) => {
        if (active) {
          setReview(result);
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Failed to load review request.',
          );
        }
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
      setEmployeeName(review.reviewRequest.reviewerName || review.reviewRequest.reviewerEmail || '-');
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
          setEmployeeName(review.reviewRequest.reviewerName || review.reviewRequest.reviewerEmail || '-');
        }
      });

    return () => {
      active = false;
    };
  }, [isLoaded, isSignedIn, review]);

  useEffect(() => {
    let active = true;

    if (!contractPreviewUrl) {
      setContractPreviewHtml(null);
      return undefined;
    }

    fetchPreviewHtml(contractPreviewUrl)
      .then((html) => {
        if (active) {
          setContractPreviewHtml(html);
        }
      })
      .catch(() => {
        if (active) {
          setContractPreviewHtml(null);
        }
      });

    return () => {
      active = false;
    };
  }, [contractPreviewUrl]);

  const approveReview = async (signatureImageUrl: string) => {
    if (!token) {
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
            signatureImageUrl,
            signMethod: 'signature_pad',
          }),
        },
      );

      setReview(updatedReview);
      const nextPreviewVersion = previewVersion + 1;
      setPreviewVersion(nextPreviewVersion);
      if (updatedReview.document?.id) {
        const nextPreviewUrl = `${buildApiUrl(`/api/v1/document-previews/${updatedReview.document.id}`)}?preview=${nextPreviewVersion}`;
        try {
          setContractPreviewHtml(await fetchPreviewHtml(nextPreviewUrl));
        } catch {
          // Keep the live preview visible even if the refresh request fails.
        }
      }
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

  return { approveReview, contractPreviewHtml, contractPreviewUrl, employeeName, error, loading, message, previewVersion, review, submitting };
}
