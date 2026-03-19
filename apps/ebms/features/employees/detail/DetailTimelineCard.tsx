import type { DetailActionItem } from './employeeProfile.data';
import { DetailPanel } from './DetailPanel';

const toneClassNames = {
  promotion: 'bg-[#174f22] text-[#23cc46]',
  'role-change': 'bg-[#5d6422] text-[#d1c314]',
  onboarding: 'bg-[#1f4c98] text-[#2d87ff]',
  terminate: 'bg-[#562126] text-[#ff707d]',
};

type DetailTimelineCardProps = {
  items: DetailActionItem[];
};

export function DetailTimelineCard({ items }: DetailTimelineCardProps) {
  return (
    <DetailPanel title="Actions" bodyClassName="space-y-8">
      {items.map((item) => (
        <article key={item.id}>
          <div className="flex items-center justify-between text-[18px] text-[#eaf1ff]">
            <p>{item.date}</p>
            <p className="font-medium tracking-[0.02em] text-[#dbe4f8]">{item.year}</p>
          </div>

          <div className="relative mt-4 h-[40px] overflow-hidden rounded-[14px] bg-[#101a2b]">
            <div
              className={`absolute inset-y-0 left-0 flex items-center rounded-[14px] px-4 text-[18px] font-semibold ${toneClassNames[item.tone]}`}
              style={{ width: item.width }}
            >
              {item.label}
            </div>

            <span className="absolute inset-y-0 right-5 flex items-center text-[16px] font-medium text-[#8e9dbd]">
              {item.state}
            </span>
          </div>
        </article>
      ))}
    </DetailPanel>
  );
}
