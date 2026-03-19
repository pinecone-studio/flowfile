import { Skeleton } from '@team-4/shadcn';
import { PageDivider, PageShell } from './flowfile.ui';

function HeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-11 w-52 rounded-[12px] bg-white/12" />
      <Skeleton className="h-6 w-64 rounded-[10px] bg-white/10" />
      <PageDivider />
    </div>
  );
}

export function PageSkeleton({
  variant,
}: {
  variant:
    | 'dashboard'
    | 'employees'
    | 'employee-detail'
    | 'documents'
    | 'actions'
    | 'approval'
    | 'audit-log'
    | 'sign'
    | 'generic';
}) {
  if (variant === 'sign') {
    return (
      <div className="w-full max-w-[670px] rounded-[28px] bg-[#08101c]/95 p-0 shadow-[0_40px_80px_rgba(0,0,0,0.38)]">
        <div className="px-12 py-10">
          <Skeleton className="h-10 w-48 rounded-[12px] bg-white/10" />
          <div className="mt-10 flex items-start justify-between gap-8">
            <div className="space-y-3">
              <Skeleton className="h-8 w-40 rounded-[10px] bg-white/10" />
              <Skeleton className="h-8 w-72 rounded-[10px] bg-white/10" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-8 w-36 rounded-[10px] bg-white/10" />
              <Skeleton className="h-8 w-20 rounded-[10px] bg-white/10" />
            </div>
          </div>
          <div className="mt-10 h-px bg-white/10" />
          <Skeleton className="mt-8 h-9 w-40 rounded-[10px] bg-white/10" />
          <Skeleton className="mt-8 h-[360px] w-full rounded-[18px] bg-white/10" />
        </div>
        <Skeleton className="h-[70px] w-full rounded-b-[28px] rounded-t-none bg-[#23478a]" />
      </div>
    );
  }

  if (variant === 'employee-detail') {
    return (
      <PageShell>
        <div className="grid gap-8 xl:grid-cols-[616px_minmax(0,1fr)]">
          <div className="space-y-8">
            <Skeleton className="h-[360px] w-full rounded-[16px] bg-white/10" />
            <Skeleton className="h-[150px] w-full rounded-[16px] bg-white/10" />
            <Skeleton className="h-[330px] w-full rounded-[16px] bg-white/10" />
            <Skeleton className="h-[250px] w-full rounded-[16px] bg-white/10" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-[272px] w-full rounded-[16px] bg-white/10" />
            <Skeleton className="h-[356px] w-full rounded-[16px] bg-white/10" />
            <Skeleton className="h-[354px] w-full rounded-[16px] bg-white/10" />
          </div>
        </div>
      </PageShell>
    );
  }

  if (variant === 'approval') {
    return (
      <PageShell>
        <HeaderSkeleton />
        <Skeleton className="h-[780px] w-full max-w-[644px] rounded-[16px] bg-white/10" />
      </PageShell>
    );
  }

  if (variant === 'documents') {
    return (
      <PageShell>
        <HeaderSkeleton />
        <div className="flex flex-col gap-7 xl:flex-row xl:items-start xl:justify-between">
          <Skeleton className="h-14 w-full max-w-[510px] rounded-[16px] bg-white/10" />
          <Skeleton className="h-14 w-full max-w-[510px] rounded-[16px] bg-white/10" />
        </div>
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_202px]">
          <Skeleton className="h-[1020px] w-full rounded-[16px] bg-white/10" />
          <Skeleton className="mx-auto h-[489px] w-[202px] rounded-[16px] bg-white/10 xl:mx-0" />
        </div>
      </PageShell>
    );
  }

  if (variant === 'employees') {
    return (
      <PageShell>
        <HeaderSkeleton />
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <Skeleton className="h-14 w-full max-w-[598px] rounded-[16px] bg-white/10" />
          <Skeleton className="h-14 w-full max-w-[420px] rounded-[16px] bg-white/10" />
        </div>
        <div className="flex flex-wrap gap-4 xl:justify-between">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[434px] w-[274px] rounded-[36px] bg-white/10"
            />
          ))}
        </div>
      </PageShell>
    );
  }

  if (variant === 'dashboard') {
    return (
      <PageShell>
        <HeaderSkeleton />
        <div className="grid gap-8 xl:grid-cols-2">
          <Skeleton className="h-[385px] w-full rounded-[16px] bg-white/10" />
          <Skeleton className="h-[338px] w-full rounded-[16px] bg-white/10" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <HeaderSkeleton />
      <Skeleton className="h-[760px] w-full rounded-[16px] bg-white/10" />
    </PageShell>
  );
}
