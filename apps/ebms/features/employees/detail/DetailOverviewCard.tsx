import Link from 'next/link';
import { X } from 'lucide-react';
import type { TriggerActionDefinition } from './employeeDetail.transform';
import type { EmployeeProfile } from './employeeProfile.data';

const statusClassNames = {
  Active: 'bg-[#153d1f]/92 text-[#33d853]',
  Inactive: 'bg-[#272d38]/90 text-[#b8c0d6]',
  Terminated: 'bg-[#51212b]/92 text-[#ff8390]',
};

type DetailOverviewCardProps = {
  profile: EmployeeProfile;
  actions: TriggerActionDefinition[];
  disabled?: boolean;
  pendingActionName?: string | null;
  onActionSelect: (action: TriggerActionDefinition) => void;
};

export function DetailOverviewCard({
  profile,
  actions,
  disabled = false,
  pendingActionName,
  onActionSelect,
}: DetailOverviewCardProps) {
  return (
    <section className="rounded-[30px] border border-white/5 bg-[linear-gradient(180deg,rgba(22,35,63,0.96)_0%,rgba(14,24,46,0.98)_100%)] px-8 py-7 shadow-[0_34px_90px_rgba(4,9,22,0.34)]">
      <div className="grid gap-7 xl:grid-cols-[326px_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-[18px]">
          <img
            src={profile.image}
            alt={profile.name}
            className="h-[332px] w-full object-cover"
          />
          <span
            className={`absolute left-5 top-5 inline-flex h-[40px] items-center rounded-full px-5 text-[16px] font-semibold ${statusClassNames[profile.status]}`}
          >
            {profile.status}
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[36px] font-medium tracking-[-0.04em] text-[#7f93bc]">
                {profile.code}
              </p>
              <h1 className="mt-1 text-[32px] font-semibold tracking-[-0.035em] text-white">
                {profile.name}
              </h1>
            </div>

            <Link
              href="/employees"
              aria-label="Close profile view"
              className="flex h-[56px] w-[56px] items-center justify-center rounded-[18px] bg-[#111b2d] text-[#edf3ff] transition hover:bg-[#18253b]"
            >
              <X className="h-7 w-7" strokeWidth={1.9} />
            </Link>
          </div>

          <div className="mt-auto rounded-[18px] bg-[linear-gradient(180deg,rgba(54,79,121,0.74)_0%,rgba(44,63,97,0.8)_100%)] px-6 py-5">
            <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-[#f5f7ff]">
              Trigger Action
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {actions.map((action) => (
                <button
                  key={action.actionName}
                  type="button"
                  disabled={disabled}
                  onClick={() => onActionSelect(action)}
                  className="flex h-[46px] items-center justify-center rounded-[14px] bg-[#274988] text-[18px] font-semibold text-[#eaf1ff] transition hover:bg-[#2d549b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pendingActionName === action.actionName
                    ? 'Triggering...'
                    : action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
