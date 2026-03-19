import { actionRecords, actionTabs } from '../showcase/showcase.data';
import { SearchField } from '../showcase/components/SearchField';
import { SegmentTabs } from '../showcase/components/SegmentTabs';
import { TonePill } from '../showcase/components/TonePill';
import { MetricLegend } from '../showcase/components/MetricLegend';
import { ProgressBar } from '../showcase/components/ProgressBar';

export default function ActionsPage() {
  return (
    <section className="mx-auto w-full max-w-[1548px] pb-10">
      <h1 className="text-[36px] font-semibold tracking-[-0.03em] text-white md:text-[38px]">
        Actions
      </h1>

      <MetricLegend
        items={[{ label: 'Ongoing', value: '2', color: '#23cd35' }]}
      />

      <div className="mt-8 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <SearchField
          placeholder="Search Actions by Time, Employee, Date, or Phase..."
          className="max-w-[532px]"
        />
        <SegmentTabs tabs={actionTabs} compact />
      </div>

      <div className="mt-6 h-px bg-[#1f3c74]/80" />

      <div className="mt-6 overflow-x-auto overflow-y-hidden rounded-[18px] border border-[#235092]/65 bg-[#13254c]/70 shadow-[0_24px_60px_rgba(4,10,25,0.3)] backdrop-blur-[18px]">
        <div className="min-w-[1240px]">
          <div className="grid grid-cols-[1fr_1fr_1.35fr_1.1fr_3.2fr_1.2fr] items-center bg-[#1d4385] px-10 py-3 text-[17px] font-medium text-[#ecf2ff]">
            <div>Date</div>
            <div>Time</div>
            <div>Employee</div>
            <div>Phase</div>
            <div>Progress</div>
            <div>Waiting</div>
          </div>

          {actionRecords.map((record, index) => (
            <div
              key={record.id}
              className={`grid grid-cols-[1fr_1fr_1.35fr_1.1fr_3.2fr_1.2fr] items-center gap-6 px-10 py-5 ${
                index === 0 ? '' : 'border-t border-white/5'
              }`}
            >
              <p className="text-[18px] font-medium text-[#dbe2ef]">
                {record.date}
              </p>
              <p className="text-[18px] font-medium text-[#dbe2ef]">
                {record.time}
              </p>
              <p className="text-[18px] font-medium text-[#dbe2ef]">
                {record.employee}
              </p>
              <TonePill label={record.phase} tone={record.phaseTone} />

              <ProgressBar
                value={record.progress}
                label={record.progressLabel}
              />

              <p className="text-[18px] font-medium text-[#edf2fc]">
                {record.waiting}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
