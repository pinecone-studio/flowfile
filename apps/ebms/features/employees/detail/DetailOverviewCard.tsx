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
    <section className="rounded-[22px] border border-white/5 bg-[linear-gradient(180deg,rgba(10,19,36,0.98)_0%,rgba(9,17,32,0.98)_100%)] px-[31px] py-[29px] shadow-[0_32px_80px_rgba(4,9,22,0.32)]">
      <div className="grid gap-8 xl:grid-cols-[326px_1fr]">
        <div className="relative overflow-hidden rounded-[14px]">
          <img
            src={profile.image}
            alt={profile.name}
            className="h-[325px] w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,rgba(8,16,29,0)_0%,rgba(8,16,29,0.82)_100%)]" />
          <span
            className={`absolute left-5 top-5 inline-flex h-[33px] items-center rounded-full px-[17px] text-[16px] font-semibold ${statusClassNames[profile.status]}`}
          >
            {profile.status}
          </span>
        </div>

        <div className="flex min-h-[325px] flex-col">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[37px] font-normal leading-[0.95] tracking-[-0.04em] text-[#7e91bb]">
                {profile.code}
              </p>
              <h1 className="mt-[2px] text-[38px] font-medium leading-[0.96] tracking-[-0.04em] text-white">
                {profile.name}
              </h1>
            </div>

            <Link
              href="/employees"
              aria-label="Close profile view"
              className="flex h-[56px] w-[56px] items-center justify-center rounded-[16px] bg-[#0f1626] text-[#edf3ff] transition hover:bg-[#162136]"
            >
              <X className="h-7 w-7" strokeWidth={1.9} />
            </Link>
          </div>

          <div className="mt-auto rounded-[14px] bg-[linear-gradient(180deg,rgba(6,12,25,0.98)_0%,rgba(7,13,26,0.98)_100%)] px-[21px] py-[17px] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
            <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-[#f5f7ff]">
              Trigger Action
            </h2>

            <div className="mt-[18px] grid gap-3 sm:grid-cols-2">
              {actions.map((action) => (
                <button
                  key={action.actionName}
                  type="button"
                  disabled={disabled}
                  onClick={() => onActionSelect(action)}
                  className="flex h-[46px] items-center justify-center rounded-[11px] bg-[#23478a] text-[17px] font-semibold text-[#eef4ff] transition hover:bg-[#2a5197] disabled:cursor-not-allowed disabled:opacity-60"
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
