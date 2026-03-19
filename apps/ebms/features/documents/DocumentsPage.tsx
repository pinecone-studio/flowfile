import { ChevronDown } from 'lucide-react';
import { documentRecords, documentTabs } from '../showcase/showcase.data';
import { SearchField } from '../showcase/components/SearchField';
import { SegmentTabs } from '../showcase/components/SegmentTabs';
import { AvatarStack, TonePill } from '../showcase/components/TonePill';
import { OverflowAction } from '../showcase/components/OverFlowAction';

const headerCellClass =
  'flex items-center gap-2 text-[17px] font-medium text-[#e4ebf8]';

export default function DocumentsPage() {
  return (
    <section className="mx-auto w-full max-w-[1548px] pb-10">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <SearchField
          placeholder="Search Documents by name, Employee, Date, or Phase..."
          className="max-w-[538px]"
        />
        <SegmentTabs tabs={documentTabs} />
      </div>

      <div className="mt-6 h-px bg-[#1f3c74]/80" />

      <div className="mt-6 overflow-x-auto overflow-y-hidden rounded-[18px] border border-[#235092]/65 bg-[#13254c]/70 shadow-[0_24px_60px_rgba(4,10,25,0.3)] backdrop-blur-[18px]">
        <div className="min-w-[1240px]">
          <div className="grid grid-cols-[2.1fr_1.55fr_1.45fr_1.2fr_1.85fr_1.2fr_1.15fr_64px] items-center bg-[#1d4385] px-10 py-3">
            <div className={headerCellClass}>Document Name</div>
            <div className={headerCellClass}>
              Employee
              <ChevronDown className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className={headerCellClass}>
              Phase
              <ChevronDown className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className={headerCellClass}>
              Date
              <ChevronDown className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className={headerCellClass}>
              Missing Signatures
              <ChevronDown className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className={headerCellClass}>
              Sent To
              <ChevronDown className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className={headerCellClass}>
              Status
              <ChevronDown className="h-4 w-4" strokeWidth={2} />
            </div>
            <div />
          </div>

          {documentRecords.map((record, index) => (
            <div
              key={record.id}
              className={`grid grid-cols-[2.1fr_1.55fr_1.45fr_1.2fr_1.85fr_1.2fr_1.15fr_64px] items-center px-10 py-3.5 ${
                index === 0 ? '' : 'border-t border-white/5'
              }`}
            >
              <p className="text-[18px] font-medium text-[#d9e0ee]">
                {record.name}
              </p>
              <p className="text-[18px] font-medium text-[#d9e0ee]">
                {record.employee}
              </p>

              <div>
                <TonePill label={record.phase} tone={record.phaseTone} />
              </div>

              <p className="text-[18px] font-medium text-[#d7deec]">
                {record.date}
              </p>

              <div className="flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${
                    record.missingTone === 'warning'
                      ? 'bg-[#c6c02c]'
                      : 'bg-[#24cd35]'
                  }`}
                />
                <span className="text-[18px] font-medium text-[#d7deec]">
                  {record.missingSignatures}
                </span>
              </div>

              <AvatarStack avatars={record.recipients} />

              <p className="text-[18px] font-medium text-[#d7deec]">
                {record.status}
              </p>

              <div className="flex justify-end">
                <OverflowAction />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
