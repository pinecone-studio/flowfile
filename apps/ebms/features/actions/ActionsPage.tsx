import { ChevronDown, MoreHorizontal } from 'lucide-react';
import {
  actionQueueItem,
  completedActions,
  sharedRecipients,
  triggerStatusOptions,
  triggerTableRows,
} from '../flowfile/flowfile.data';
import {
  AvatarCluster,
  DetailsMenu,
  FilterChip,
  GlassPanel,
  KebabButton,
  MenuList,
  PageDivider,
  PageShell,
  PageTitle,
  SearchBar,
  StatusDotLabel,
  StatusPill,
  StatusText,
} from '../flowfile/flowfile.ui';

export default function ActionsPage() {
  return (
    <PageShell>
      <PageTitle title="Action" />
      <PageDivider />

      <div className="space-y-3">
        <p className="text-[18px] text-[#cfd8eb]">List Item</p>

        <GlassPanel className="rounded-[12px] px-8 py-5">
          <div className="grid grid-cols-[1.4fr_1.05fr_0.9fr_1.2fr_0.9fr_0.45fr] items-center gap-5">
            <span className="text-[16px] text-[#d8e0f2]">{actionQueueItem.label}</span>
            <div className="text-[16px] text-[#d8e0f2]">
              <p>{actionQueueItem.employee}</p>
              <p className="text-[#7f94c1]">{actionQueueItem.employeeCode}</p>
            </div>
            <span className="text-[16px] text-[#d8e0f2]">{actionQueueItem.flow}</span>
            <div className="flex items-center gap-5">
              <StatusPill label={actionQueueItem.state} tone="pending" compact />
              <StatusDotLabel label={actionQueueItem.waiting} tone="warning" />
            </div>
            <div className="text-[16px] text-[#d8e0f2]">
              <p>{actionQueueItem.date}</p>
              <p className="text-[#7f94c1]">{actionQueueItem.time}</p>
            </div>
            <div className="flex justify-end">
              <KebabButton />
            </div>
          </div>
        </GlassPanel>
      </div>

      <GlassPanel className="overflow-visible p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <SearchBar
            placeholder="Search Documents by name, Employee, Date, or Phase..."
            className="max-w-[412px]"
          />

          <div className="flex flex-wrap items-center gap-5">
            <FilterChip label="All" />
            <span className="text-[16px] text-[#eef4ff]">Onboarding 4</span>
            <span className="text-[16px] text-[#eef4ff]">Promotion 8</span>
            <span className="text-[16px] text-[#eef4ff]">Role Change 3</span>
            <span className="text-[16px] text-[#eef4ff]">Termination 2</span>
          </div>
        </div>

        <PageDivider />

        <div className="overflow-x-auto pt-5">
          <div className="min-w-[1080px] rounded-[12px] bg-[linear-gradient(180deg,rgba(20,37,68,0.9)_0%,rgba(18,32,58,0.9)_100%)]">
            <div className="grid grid-cols-[1.6fr_1.1fr_1.05fr_0.85fr_1.35fr_0.9fr_0.95fr_44px] items-center rounded-t-[12px] bg-[#1d4385] px-8 py-4 text-[16px] font-medium text-[#f0f5ff]">
              <span>Document Name</span>
              <span className="flex items-center gap-2">
                Employee
                <ChevronDown className="h-4 w-4" strokeWidth={2.2} />
              </span>
              <span>Latest Action</span>
              <span className="flex items-center gap-2">
                Date
                <ChevronDown className="h-4 w-4" strokeWidth={2.2} />
              </span>
              <span>Missing Signatures</span>
              <span>Sent To</span>
              <span className="flex items-center gap-2">
                Status
                <ChevronDown className="h-4 w-4" strokeWidth={2.2} />
              </span>
              <span />
            </div>

            {triggerTableRows.map((row, index) => (
              <div
                key={row.id}
                className={`grid grid-cols-[1.6fr_1.1fr_1.05fr_0.85fr_1.35fr_0.9fr_0.95fr_44px] items-center gap-5 px-8 py-5 ${
                  index === 0 ? '' : 'border-t border-white/6'
                }`}
              >
                <span className="text-[18px] font-medium text-[#edf3ff]">{row.document}</span>
                <span className="text-[18px] font-medium text-[#edf3ff]">{row.employee}</span>
                <StatusPill label={row.latestAction} tone={row.tone} compact />
                <span className="text-[18px] font-medium text-[#edf3ff]">{row.date}</span>
                <StatusDotLabel label={row.missing} tone={row.missingTone} />
                <AvatarCluster avatars={sharedRecipients} />

                <DetailsMenu
                  trigger={
                    <span className="flex items-center gap-2 text-left">
                      <StatusText value={row.status} />
                      <ChevronDown className="h-4 w-4 text-[#dce5f8]" strokeWidth={2.2} />
                    </span>
                  }
                >
                  <MenuList items={triggerStatusOptions} className="w-[150px]" />
                </DetailsMenu>

                <DetailsMenu
                  trigger={
                    <span className="flex justify-end">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full text-[#eef2fb]">
                        <MoreHorizontal className="h-5 w-5" strokeWidth={2.2} />
                      </span>
                    </span>
                  }
                  className="justify-self-end"
                >
                  <MenuList items={completedActions} className="w-[172px]" />
                </DetailsMenu>
              </div>
            ))}
          </div>
        </div>
      </GlassPanel>
    </PageShell>
  );
}
