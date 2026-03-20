'use client';

import {
  GlassPanel,
  KebabButton,
  MetricLegend,
  PageDivider,
  PageShell,
  PageTitle,
  PanelHeader,
  ProgressTrack,
  StatusText,
} from '../flowfile/flowfile.ui';
import { useDashboard } from './useDashboard';
import { buildDashboardModel } from './dashboard.helpers';

function DashboardMetricCard({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <GlassPanel className="min-h-[146px] p-8">
      <div className="flex h-full flex-col justify-between">
        <div className="text-[72px] font-semibold leading-none tracking-[-0.04em] text-white">
          {value}
        </div>
        <div className="text-[18px] text-[#d7dff0]">{label}</div>
      </div>
    </GlassPanel>
  );
}

function DashboardProgress({
  steps,
}: {
  steps: Array<{ label: string; status: string; tone: string }>;
}) {
  if (!steps.length) {
    return (
      <div className="flex h-[170px] items-center justify-center text-[16px] text-[#9fb0d4]">
        No workflow progress yet.
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <div className="relative mb-8 mt-6 h-[36px]">
        <div className="absolute left-0 right-0 top-[12px] h-px bg-white/40" />
        <div className="relative grid grid-cols-5">
          {steps.map((step, index) => (
            <div
              key={`${step.label}-${index}`}
              className="relative flex justify-center"
            >
              <span
                className={`h-[12px] w-[12px] rounded-full border border-white/70 ${
                  step.tone === 'success'
                    ? 'bg-white'
                    : step.tone === 'warning'
                      ? 'bg-[#f3dcc0]'
                      : 'bg-[#9ca8bd]'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        {steps.map((step) => (
          <div key={step.label} className="space-y-2">
            <p className="text-[15px] font-medium leading-6 text-[#eef3ff]">
              {step.label}
            </p>
            <p className="text-[14px] leading-5 text-[#98abcf]">
              {step.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <GlassPanel className="p-8 text-[18px] text-[#d7dff0]">
      Loading dashboard...
    </GlassPanel>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <GlassPanel className="border border-[#6b2e45]/60 bg-[#30131f]/80 p-8 text-[18px] text-[#ffd6df]">
      {message}
    </GlassPanel>
  );
}

export default function DashboardPage() {
  const {
    employees,
    jobs,
    generatedDocuments,
    reviewRequests,
    isLoading,
    error,
  } = useDashboard();

  if (isLoading) {
    return (
      <PageShell className="max-w-[var(--dashboard-shell-width)] gap-[30px]">
        <LoadingState />
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell className="max-w-[var(--dashboard-shell-width)] gap-[30px]">
        <ErrorState message={error} />
      </PageShell>
    );
  }

  const model = buildDashboardModel({
    employees,
    jobs,
    generatedDocuments,
    reviewRequests,
  });

  return (
    <PageShell className="max-w-[var(--dashboard-shell-width)] gap-[30px]">
      <PageTitle
        title="Dashboard"
        subtitle={
          <MetricLegend
            items={[
              {
                label: 'Hello, welcome to FLOWFILE!',
                value: '',
                color: '#22cd35',
              },
            ]}
          />
        }
      />

      <PageDivider />

      <div className="grid gap-6 md:grid-cols-3">
        {model.metrics.map((metric) => (
          <DashboardMetricCard
            key={metric.label}
            value={metric.value}
            label={metric.label}
          />
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <GlassPanel className="h-[385px] overflow-hidden">
          <PanelHeader title="Latest Actions" />
          <div className="flex h-[calc(100%-42px)] flex-col px-8 py-7">
            {model.latestActions.length === 0 ? (
              <div className="flex h-full items-center justify-center text-[16px] text-[#9fb0d4]">
                No recent actions.
              </div>
            ) : (
              model.latestActions.map((row) => (
                <div
                  key={row.id}
                  className="flex flex-1 items-center border-b border-white/5 py-4 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <div className="flex w-full items-center gap-4">
                    <img
                      src={row.avatar}
                      alt={row.employee}
                      className="h-[58px] w-[58px] rounded-[10px] object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-5">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="truncate text-[18px] font-medium text-[#f1f5ff]">
                            {row.employee}
                          </span>
                          <span className="text-[18px] text-[#8ca1cb]">
                            {row.code}
                          </span>
                        </div>

                        <span className="text-[16px] font-medium text-[#edf2ff]">
                          {row.date}
                        </span>
                      </div>

                      <ProgressTrack
                        value={row.progress}
                        label={row.action}
                        trailing={row.state}
                        className="mt-[15px]"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassPanel>

        <GlassPanel className="h-[385px] overflow-hidden">
          <PanelHeader title="Latest Documents" />
          <div className="flex h-[calc(100%-42px)] flex-col px-8 py-6">
            {model.latestDocuments.length === 0 ? (
              <div className="flex h-full items-center justify-center text-[16px] text-[#9fb0d4]">
                No recent documents.
              </div>
            ) : (
              model.latestDocuments.map((row) => (
                <div
                  key={row.id}
                  className="grid flex-1 grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.9fr)_36px] items-center gap-5 border-b border-white/5 py-3 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <span className="truncate text-[18px] font-medium text-[#f1f5ff]">
                    {row.name}
                  </span>
                  <span className="truncate text-[18px] font-medium text-[#eef3ff]">
                    {row.employee}
                  </span>
                  <div className="space-y-1">
                    <StatusText value={row.status} />
                    <p className="text-[16px] text-[#8598c5]">
                      {row.timestamp}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <KebabButton />
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <GlassPanel className="min-h-[254px] overflow-hidden">
          <PanelHeader title="Waiting Documents" />
          <div className="space-y-6 p-8">
            {model.waitingDocuments.length === 0 ? (
              <div className="text-[16px] text-[#9fb0d4]">
                No waiting documents.
              </div>
            ) : (
              model.waitingDocuments.map((document) => (
                <div
                  key={document.id}
                  className="rounded-[14px] bg-white/[0.02] p-1"
                >
                  <div className="mb-3 flex items-start justify-between gap-4 px-2">
                    <div>
                      <p className="text-[14px] text-[#8ea2cb]">
                        {document.employee}
                      </p>
                      <p className="text-[18px] font-medium text-white">
                        {document.name}
                      </p>
                    </div>
                    <p className="text-right text-[14px] text-[#9bb0d8]">
                      {document.timestamp}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      className="h-[44px] rounded-[10px] bg-[#153d82] text-[15px] font-semibold text-[#eef4ff]"
                    >
                      Sign & Approve
                    </button>
                    <button
                      type="button"
                      className="h-[44px] rounded-[10px] border border-[#d7c4c1] bg-transparent text-[15px] font-semibold text-[#f0d9d6]"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      className="h-[44px] rounded-[10px] border border-[#6f5f45] bg-transparent text-[15px] font-semibold text-[#f1d6a9]"
                    >
                      Return
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassPanel>

        <GlassPanel className="min-h-[254px] overflow-hidden">
          <PanelHeader title="Latest Document Progress" />
          <DashboardProgress steps={model.progressSteps} />
        </GlassPanel>
      </div>
    </PageShell>
  );
}
