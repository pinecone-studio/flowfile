import { SegmentTab } from "../showcase.data";

export function SegmentTabs({
  tabs,
  compact = false,
}: {
  tabs: SegmentTab[];
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap items-center ${compact ? 'gap-4' : 'gap-7'} text-[#e2e7f4]`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={`rounded-[12px] px-4 py-3 text-[17px] font-medium transition ${
            tab.active
              ? 'bg-[#23478a] text-white shadow-[0_14px_28px_rgba(8,24,58,0.34)]'
              : 'text-[#e2e6f2] hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}