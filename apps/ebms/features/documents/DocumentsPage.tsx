'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  documentCategories,
  documentGroups,
  documentProgressSteps,
  sharedRecipients,
} from '../flowfile/flowfile.data';
import {
  AvatarCluster,
  GlassPanel,
  PageDivider,
  PageShell,
  PageTitle,
  PanelHeader,
  SearchBar,
  StatusDotLabel,
  StatusText,
  TabsRow,
} from '../flowfile/flowfile.ui';

export default function DocumentsPage() {
  const [openGroupId, setOpenGroupId] = useState('');

  const fallbackDocuments = useMemo(
    () => documentGroups.find((group) => group.documents.length > 0)?.documents ?? [],
    []
  );

  return (
    <PageShell>
      <PageTitle
        title="Documents"
        subtitle={
          <div className="flex items-center gap-8 text-[16px] font-medium text-[#eef4ff]">
            <div className="flex items-center gap-3">
              <span className="h-[11px] w-[11px] rounded-full bg-[#2d87ff]" />
              <span>Ongoing 2</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-[11px] w-[11px] rounded-full bg-[#22cd35]" />
              <span>Completed 24</span>
            </div>
          </div>
        }
      />

      <PageDivider />

      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <TabsRow items={documentCategories} />
        <SearchBar
          placeholder="Search employee or action..."
          className="max-w-[392px]"
        />
      </div>

      <div
        className={`grid gap-8 ${
          openGroupId
            ? 'xl:grid-cols-[minmax(0,1fr)_202px]'
            : 'xl:grid-cols-[minmax(0,1fr)]'
        }`}
      >
        <GlassPanel className="overflow-hidden">
          <PanelHeader title="Latest Actions" />

          <div>
            {documentGroups.map((group) => {
              const isOpen = openGroupId === group.id;
              const documents =
                group.documents.length > 0 ? group.documents : fallbackDocuments;

              return (
                <div key={group.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenGroupId((currentId) =>
                        currentId === group.id ? '' : group.id
                      )
                    }
                    className="grid w-full grid-cols-[72px_minmax(0,1fr)_150px_54px] items-center gap-5 px-8 py-6 text-left transition hover:bg-white/[0.03]"
                  >
                    <img
                      src="/pro5.png"
                      alt={group.employee}
                      className="h-[58px] w-[58px] rounded-[10px] object-cover"
                    />

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="truncate text-[18px] font-medium text-[#eff4ff]">
                          {group.employee}
                        </span>
                        <span className="text-[18px] text-[#8fa3cf]">{group.code}</span>
                      </div>

                      <div className="mt-4 rounded-[10px] bg-[#183155] px-4 py-3">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[16px] font-semibold text-[#2f87ff]">
                            {group.latestAction}
                          </span>
                          <span className="truncate text-[16px] text-[#95a8d4]">
                            {group.state}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-right text-[16px] font-medium text-[#eef4ff]">
                      {group.date}
                    </span>

                    <span className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] bg-[#23478a]">
                      {isOpen ? (
                        <ChevronUp className="h-7 w-7 text-white" strokeWidth={2.1} />
                      ) : (
                        <ChevronDown className="h-7 w-7 text-white" strokeWidth={2.1} />
                      )}
                    </span>
                  </button>

                  {isOpen ? (
                    <div className="bg-[#305393]/78 px-8 py-6">
                      <div className="space-y-4">
                        {documents.map((document) => (
                          <div
                            key={`${group.id}-${document.id}`}
                            className="grid h-[48px] grid-cols-[minmax(0,1.45fr)_minmax(0,0.9fr)_minmax(0,1.1fr)_minmax(0,0.9fr)_36px] items-center gap-5"
                          >
                            <span className="truncate text-[18px] font-medium text-[#f3f7ff]">
                              {document.title}
                            </span>

                            <div className="flex h-[48px] flex-col justify-center">
                              <StatusText value={document.status} />
                              <span
                                className={`text-[16px] leading-4 text-[#a0b0d3] ${
                                  document.timestamp ? '' : 'invisible'
                                }`}
                              >
                                {document.timestamp || 'Jun 15, 09:14'}
                              </span>
                            </div>

                            <StatusDotLabel
                              label={document.missing}
                              tone={document.missingTone}
                            />

                            <div className="flex items-center gap-3">
                              <span className="text-[16px] text-[#eef4ff]">Sent to</span>
                              <AvatarCluster avatars={sharedRecipients} />
                            </div>

                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                            >
                              <span className="text-[24px] leading-none">...</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </GlassPanel>

        {openGroupId ? (
          <div className="mx-auto h-[489px] w-[202px] overflow-hidden rounded-[8px] bg-[#12387899] shadow-[0_24px_60px_rgba(4,10,24,0.24)] xl:mx-0">
            <div className="flex h-[32px] items-center border-b border-[#2b4c83] bg-[#12387899] px-6">
              <h2 className="text-[20px] font-semibold leading-none text-[#d0d5dc]">
                Progress
              </h2>
            </div>

            <div className="relative h-[457px]">
              <div className="absolute left-[31px] top-[48px] h-[361px] w-px bg-[#32813e]" />

              {documentProgressSteps.map((step, index) => {
                const blockTop = 31 + index * 94;
                const dotTop = 33 + index * 94;

                return (
                  <div
                    key={step.label}
                    className="absolute left-0 right-0"
                    style={{ top: `${blockTop}px` }}
                  >
                    <span
                      className={`absolute left-[24px] h-[15px] w-[15px] rounded-full ${
                        step.tone === 'success'
                          ? 'bg-[#32813e]'
                          : step.tone === 'warning'
                            ? 'bg-[#afb814]'
                            : 'bg-[#202020]'
                      }`}
                      style={{ top: `${dotTop - blockTop}px` }}
                    />

                    <div className="pl-[50px] pr-3">
                      <p className="text-[16px] font-medium leading-6 text-[#d0d5dc]">
                        {step.label}
                      </p>
                      <p className="mt-[4px] text-[16px] leading-6 text-[#687da6]">
                        {step.status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
