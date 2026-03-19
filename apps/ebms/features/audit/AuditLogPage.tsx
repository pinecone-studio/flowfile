import { auditLogRows } from '../flowfile/flowfile.data';
import {
  GlassPanel,
  PageDivider,
  PageShell,
  PageTitle,
  PanelHeader,
  StatusText,
} from '../flowfile/flowfile.ui';

export default function AuditLogPage() {
  return (
    <PageShell>
      <PageTitle title="Audit Log" subtitle={<p className="text-[16px] text-[#eef4ff]">Document history and review checkpoints</p>} />
      <PageDivider />

      <GlassPanel className="overflow-hidden">
        <PanelHeader title="Recent Events" />
        <div className="space-y-6 p-8">
          {auditLogRows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[minmax(0,1.7fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_minmax(0,1fr)] items-center gap-5 border-b border-white/6 pb-6 last:border-b-0 last:pb-0"
            >
              <span className="text-[18px] font-medium text-[#eef4ff]">{row.action}</span>
              <span className="text-[18px] text-[#eef4ff]">{row.actor}</span>
              <StatusText value={row.status} />
              <span className="text-[16px] text-[#8fa3cf]">{row.when}</span>
            </div>
          ))}
        </div>
      </GlassPanel>
    </PageShell>
  );
}
