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
    <section className="mx-auto w-full max-w-[1170px] pb-10">
      <div className="grid gap-8 xl:grid-cols-[616px_519px] xl:gap-[35px]">
        <div className="space-y-8">
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

        <div>
          <DetailTimelineCard items={profile.timeline} documents={profile.documents} />
        </div>
      </div>
    </section>
  );
}
