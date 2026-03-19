import { dashboardActions, dashboardDocuments } from '../flowfile/flowfile.data';
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

function DashboardPage() {
  return (
    <PageShell>
      <PageTitle
        title="Dashboard"
        subtitle={
          <MetricLegend
            items={[{ label: 'Good Evening, Mr. Narantsatsralt', value: '', color: '#22cd35' }]}
          />
        }
      />

      <PageDivider />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,746px)_minmax(0,1fr)]">
        <GlassPanel className="overflow-hidden">
          <PanelHeader title="Latest Actions" />
          <div className="space-y-8 p-8">
            {dashboardActions.map((row) => (
              <div key={row.id} className="border-b border-white/5 pb-8 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-4">
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
                        <span className="text-[18px] text-[#8ca1cb]">{row.code}</span>
                      </div>

                      <span className="text-[16px] font-medium text-[#edf2ff]">{row.date}</span>
                    </div>

                    <ProgressTrack
                      value={row.progress}
                      label={row.action}
                      trailing={row.state}
                      className="mt-4"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="overflow-hidden">
          <PanelHeader title="Latest Documents" />
          <div className="space-y-7 p-8">
            {dashboardDocuments.map((row) => (
              <div key={row.id} className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_36px] items-start gap-5">
                <span className="truncate text-[18px] font-medium text-[#f1f5ff]">
                  {row.name}
                </span>
                <span className="truncate text-[18px] font-medium text-[#eef3ff]">
                  {row.employee}
                </span>
                <div className="space-y-1">
                  <StatusText value={row.status} />
                  <p className="text-[16px] text-[#8598c5]">{row.timestamp}</p>
                </div>
                <div className="flex justify-end">
                  <KebabButton />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </PageShell>
  );
}

export default DashboardPage;
