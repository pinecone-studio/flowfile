import Link from 'next/link';
import { ChevronDown, X } from 'lucide-react';
import {
  employeeActions,
  employeeDetail,
  employeeDocuments,
  generateDocumentOptions,
} from '../flowfile/flowfile.data';
import {
  GlassPanel,
  KebabButton,
  PageShell,
  PanelHeader,
  StatusPill,
  StatusText,
} from '../flowfile/flowfile.ui';

function InfoGrid({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <GlassPanel className="p-6">
      <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-white">{title}</h2>
      <div className="mt-5 grid gap-x-12 gap-y-7 md:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label}>
            <p className="text-[18px] text-[#7f94bf]">{row.label}</p>
            <p className="mt-2 text-[20px] font-medium text-[#f4f7ff]">{row.value}</p>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

export default function EmployeeDetailPage() {
  return (
    <PageShell className="gap-0">
      <div className="grid gap-8 xl:grid-cols-[616px_minmax(0,1fr)]">
        <div className="space-y-8">
          <GlassPanel className="p-6">
            <div className="grid gap-6 md:grid-cols-[324px_minmax(0,1fr)]">
              <div className="relative h-[324px] overflow-hidden rounded-[16px]">
                <img
                  src={employeeDetail.image}
                  alt={employeeDetail.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,11,21,0)_40%,rgba(6,11,21,0.82)_100%)]" />
                <StatusPill
                  label={employeeDetail.status}
                  tone={employeeDetail.statusTone}
                  compact
                  className="absolute left-5 top-5"
                />
              </div>

              <div className="relative">
                <Link
                  href="/employees"
                  className="absolute right-0 top-0 flex h-[58px] w-[58px] items-center justify-center rounded-[18px] bg-[#101c33]"
                >
                  <X className="h-8 w-8 text-white" strokeWidth={2} />
                </Link>

                <div className="pr-20">
                  <p className="text-[24px] text-[#8194be]">{employeeDetail.employeeCode}</p>
                  <h1 className="text-[40px] font-semibold tracking-[-0.04em] text-white">
                    {employeeDetail.name}
                  </h1>
                </div>

                <div className="mt-16 rounded-[12px] bg-[#2b456d] p-5">
                  <h2 className="text-[26px] font-semibold text-white">Trigger Action</h2>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {['Onboard', 'Change Role', 'Promote', 'Terminate'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        className="flex h-[46px] items-center justify-center rounded-[10px] bg-[#23478a] text-[17px] font-semibold text-[#eef4ff]"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </GlassPanel>

          <InfoGrid
            title="Personal Information"
            rows={[
              { label: 'Full Name', value: employeeDetail.fullName },
              { label: 'Birthday', value: employeeDetail.birthday },
            ]}
          />

          <InfoGrid
            title="Work Information"
            rows={[
              { label: 'Position', value: employeeDetail.position },
              { label: 'Department', value: employeeDetail.department },
              { label: 'Employee Code', value: employeeDetail.employeeCode },
              { label: 'Years Worked', value: employeeDetail.yearsWorked },
              { label: 'KPI Eligible', value: employeeDetail.kpiEligible },
              { label: 'Paid by Company', value: employeeDetail.paidByCompany },
            ]}
          />

          <InfoGrid
            title="Contact"
            rows={[{ label: 'Email', value: employeeDetail.email }]}
          />
        </div>

        <div className="space-y-8">
          <GlassPanel className="overflow-hidden">
            <PanelHeader title="Actions" />
            <div className="space-y-8 p-8">
              {employeeActions.map((action) => (
                <div key={action.id} className="space-y-3">
                  <div className="flex items-center justify-between text-[18px] text-[#eef3ff]">
                    <span>{action.date}</span>
                    <span>{action.year}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-[12px] bg-[#162842] px-5 py-3">
                    <span
                      className={
                        action.tone === 'promotion'
                          ? 'text-[18px] font-semibold text-[#1ece36]'
                          : action.tone === 'role-change'
                            ? 'text-[18px] font-semibold text-[#d3d320]'
                            : 'text-[18px] font-semibold text-[#2e87ff]'
                      }
                    >
                      {action.label}
                    </span>
                    <span className="text-[16px] text-[#95a8d4]">{action.state}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="overflow-hidden">
            <PanelHeader title="Documents" />
            <div className="space-y-7 p-8">
              {employeeDocuments.map((document) => (
                <div
                  key={document.id}
                  className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_36px] items-start gap-5"
                >
                  <span className="truncate text-[18px] font-medium text-[#eff4ff]">
                    {document.name}
                  </span>
                  <div className="space-y-1">
                    <StatusText value={document.status} />
                    <p className="text-[16px] text-[#8194bf]">{document.timestamp}</p>
                  </div>
                  <div className="flex justify-end">
                    <KebabButton />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="overflow-hidden">
            <PanelHeader title="Generate Document" />
            <div className="p-8">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <button
                  type="button"
                  className="flex h-[46px] min-w-[248px] items-center justify-between rounded-[10px] bg-[#16315d] px-4 text-[18px] text-[#f1f6ff]"
                >
                  <span>{generateDocumentOptions[0]}</span>
                  <ChevronDown className="h-5 w-5" strokeWidth={2.2} />
                </button>

                <button
                  type="button"
                  className="flex h-[46px] min-w-[242px] items-center justify-center rounded-[10px] bg-[#23478a] text-[18px] font-semibold text-[#f2f6ff]"
                >
                  Generate
                </button>
              </div>

              <div className="mt-8 space-y-6">
                {generateDocumentOptions.slice(1).map((item) => (
                  <p key={item} className="text-[18px] text-[#f0f4ff]">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </PageShell>
  );
}
