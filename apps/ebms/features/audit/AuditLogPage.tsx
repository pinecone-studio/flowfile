'use client';

import { useEffect, useMemo, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { requestJson } from '../../lib/api/client';
import {
  GlassPanel,
  PageDivider,
  PageShell,
  PageTitle,
  PanelHeader,
  StatusText,
} from '../flowfile/flowfile.ui';

type ApiAuditLog = {
  id: string;
  actionName: string;
  eventType: string;
  status: string;
  message: string | null;
  createdAt: string;
};

function formatActionLabel(value: string) {
  return value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function AuditLogPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  const employeeId = searchParams.get('employeeId');
  const [logs, setLogs] = useState<ApiAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams();

    if (jobId) {
      params.set('jobId', jobId);
    }

    if (employeeId) {
      params.set('employeeId', employeeId);
    }

    setLoading(true);
    setError(null);

    requestJson<ApiAuditLog[]>(`/api/v1/audit?${params.toString()}`)
      .then((result) => {
        if (!active) {
          return;
        }

        setLogs(result);
      })
      .catch((requestError: unknown) => {
        if (!active) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Failed to load audit logs.',
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
  }, [employeeId, jobId]);

  const sortedLogs = useMemo(
    () => logs.slice().sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    [logs],
  );

  return (
    <PageShell>
      <PageTitle
        title="Audit Log"
        subtitle={
          <p className="text-[16px] text-[#eef4ff]">
            Document history and review checkpoints
          </p>
        }
      />
      <PageDivider />

      <GlassPanel className="overflow-hidden">
        <PanelHeader title="Recent Events" />
        <div className="space-y-6 p-8">
          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center text-[17px] text-[#b8c7ea]">
              <LoaderCircle className="mr-3 h-5 w-5 animate-spin" />
              Loading audit logs...
            </div>
          ) : error ? (
            <div className="rounded-[14px] border border-[#7f2834] bg-[#39131c] px-5 py-4 text-[15px] text-[#ffd7df]">
              {error}
            </div>
          ) : sortedLogs.length === 0 ? (
            <div className="text-[17px] text-[#b8c7ea]">No audit events found.</div>
          ) : (
            sortedLogs.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)] items-center gap-5 border-b border-white/6 pb-6 last:border-b-0 last:pb-0"
              >
                <span className="text-[18px] font-medium text-[#eef4ff]">
                  {formatActionLabel(row.actionName)}
                </span>
                <span className="text-[18px] text-[#eef4ff]">
                  {formatActionLabel(row.eventType)}
                </span>
                <StatusText
                  value={
                    row.status === 'success'
                      ? 'Generated'
                      : row.status === 'error'
                        ? 'Failed'
                        : row.status === 'warning'
                          ? 'Canceled'
                          : 'Generating...'
                  }
                />
                <div className="text-[16px] text-[#8fa3cf]">
                  <p>{formatDateTime(row.createdAt)}</p>
                  {row.message ? <p className="mt-1 truncate">{row.message}</p> : null}
                </div>
              </div>
            ))
          )}
        </div>
      </GlassPanel>
    </PageShell>
  );
}
