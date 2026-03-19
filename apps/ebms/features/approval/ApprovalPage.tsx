import Link from 'next/link';
import { approvalDocuments } from '../flowfile/flowfile.data';
import {
  GlassPanel,
  PageDivider,
  PageShell,
  PageTitle,
  PanelHeader,
} from '../flowfile/flowfile.ui';

export default function ApprovalPage() {
  return (
    <PageShell>
      <PageTitle
        title="Approval"
        subtitle={<p className="text-[16px] text-[#eef4ff]">Sign and approve documents if needed</p>}
      />

      <PageDivider />

      <GlassPanel className="max-w-[644px] overflow-hidden">
        <PanelHeader title="Waiting Documents" />

        <div className="min-h-[760px] border-t border-white/10">
          {approvalDocuments.map((document) => (
            <div key={document.id} className="border-b border-[#335381] px-8 py-5">
              <div className="flex items-start justify-between gap-8">
                <div>
                  <p className="text-[16px] text-[#8699c3]">{document.employee}</p>
                  <p className="text-[20px] font-medium text-[#eef4ff]">
                    {document.name} ↗
                  </p>
                </div>

                <div className="text-right text-[16px] leading-6 text-[#dce5f8]">
                  <p>{document.date}</p>
                  <p>{document.time}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/sign"
                  className="flex h-[46px] min-w-[280px] items-center justify-center rounded-[12px] bg-[#23478a] px-6 text-[18px] font-semibold text-[#f4f8ff]"
                >
                  Sign & Approve
                </Link>

                <button
                  type="button"
                  className="flex h-[46px] min-w-[140px] items-center justify-center rounded-[12px] border border-[#ff2b2d] px-6 text-[18px] font-semibold text-[#ff2b2d]"
                >
                  Reject
                </button>

                <button
                  type="button"
                  className="flex h-[46px] min-w-[140px] items-center justify-center rounded-[12px] border border-[#d4ca13] px-6 text-[18px] font-semibold text-[#d4ca13]"
                >
                  Return
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </PageShell>
  );
}
