import { DetailDocumentsCard } from './DetailDocumentsCard';
import { DetailGenerateCard } from './DetailGenerateCard';
import { DetailInfoCard } from './DetailInfoCard';
import { DetailOverviewCard } from './DetailOverviewCard';
import { DetailTimelineCard } from './DetailTimelineCard';
import type { TriggerActionDefinition } from './employeeDetail.transform';
import type { EmployeeProfile } from './employeeProfile.data';

type EmployeeDetailPageProps = {
  profile: EmployeeProfile;
  actions: TriggerActionDefinition[];
  disabled?: boolean;
  pendingActionName?: string | null;
  onActionSelect: (action: TriggerActionDefinition) => void;
};

export function EmployeeDetailPage({
  profile,
  actions,
  disabled = false,
  pendingActionName,
  onActionSelect,
}: EmployeeDetailPageProps) {
  return (
    <section className="mx-auto w-full max-w-[var(--dashboard-shell-width)] pb-10">
      <div className="grid gap-7 xl:grid-cols-[616px_520px] xl:gap-[35px]">
        <div className="space-y-[24px] xl:space-y-[20px]">
          <DetailOverviewCard
            profile={profile}
            actions={actions}
            disabled={disabled}
            pendingActionName={pendingActionName}
            onActionSelect={onActionSelect}
          />
          <DetailInfoCard title="Personal Information" fields={profile.personalInfo} />
          <DetailInfoCard title="Work Information" fields={profile.workInfo} />
          <DetailInfoCard title="Contact" fields={profile.contactInfo} />
        </div>

        <div className="space-y-[48px]">
          <DetailTimelineCard items={profile.timeline} />
          <DetailDocumentsCard items={profile.documents} />
          <DetailGenerateCard options={profile.generateOptions} />
        </div>
      </div>
    </section>
  );
}
