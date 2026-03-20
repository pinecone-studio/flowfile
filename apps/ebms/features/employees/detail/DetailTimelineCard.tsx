import type { DetailActionItem } from './employeeProfile.data';

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
    <section className="overflow-hidden rounded-[14px] border border-white/5 bg-[linear-gradient(180deg,rgba(32,46,70,0.96)_0%,rgba(29,42,63,0.98)_100%)] shadow-[0_26px_72px_rgba(4,9,22,0.26)]">
      <div className="flex h-[42px] items-center bg-[#23478a] px-8">
        <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[#eef3ff]">
          Actions
        </h2>
      </div>

      <div className="space-y-[22px] px-8 py-[22px]">
        {items.length === 0 ? (
          <p className="text-[17px] text-[#c8d2e9]">No actions yet.</p>
        ) : null}

        {items.map((item) => (
          <article key={item.id}>
            <div className="flex items-center justify-between text-[18px] text-[#e5ecfb]">
              <p>{item.date}</p>
              <p className="text-[18px] text-[#dbe4f8]">{item.year}</p>
            </div>

            <div className="relative mt-[14px] h-[36px] overflow-hidden rounded-[12px] bg-[#152947]">
              <div
                className={`absolute inset-y-0 left-0 flex items-center rounded-[12px] px-[14px] text-[16px] font-semibold ${toneClassNames[item.tone]}`}
                style={{ width: item.width }}
              >
                {item.label}
              </div>

              <span className="absolute inset-y-0 right-[14px] flex items-center text-[16px] font-medium text-[#98aad2]">
                {item.state}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
