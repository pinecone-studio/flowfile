import { FileText, MoreHorizontal } from 'lucide-react';
import type { DetailActionItem, DetailDocumentItem } from './employeeProfile.data';

const toneClassNames = {
  promotion: 'bg-[#174f22] text-[#23cc46]',
  'role-change': 'bg-[#5d6422] text-[#d1c314]',
  onboarding: 'bg-[#1f4c98] text-[#2d87ff]',
  terminate: 'bg-[#562126] text-[#ff707d]',
};

type DetailTimelineCardProps = {
  items: DetailActionItem[];
  documents: DetailDocumentItem[];
};

const segmentClassNames = [
  'bg-[#09101d]',
  'bg-[#24498f]',
  'bg-[#09101d]',
];

export function DetailTimelineCard({
  items,
  documents,
}: DetailTimelineCardProps) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-white/5 bg-[#11254a] shadow-[0_26px_72px_rgba(4,9,22,0.26)]">
      <div className="bg-[#1f468b] px-8 py-4">
        <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[#eef3ff]">
          Actions
        </h2>
      </div>

      <div>
        {items.map((item, index) => (
          <article
            key={item.id}
            className={`px-8 py-8 ${segmentClassNames[index] ?? 'bg-[#09101d]'}`}
          >
            <div className="flex items-center justify-between text-[18px] text-[#e5ecfb]">
              <p>{item.date}</p>
              <p className="text-[18px] text-[#dbe4f8]">{item.year}</p>
            </div>

            <div className="relative mt-6 h-[48px] overflow-hidden rounded-[14px] bg-[#080d18]">
              <div
                className={`absolute inset-y-0 left-0 flex items-center rounded-[14px] px-6 text-[18px] font-semibold ${toneClassNames[item.tone]}`}
                style={{ width: item.width }}
              >
                {item.label}
              </div>

              <span className="absolute inset-y-0 right-5 flex items-center text-[16px] font-medium text-[#d1d7e5]">
                {item.state}
              </span>
            </div>

            {index === 1 ? (
              <div className="mt-10 space-y-4">
                {documents.slice(0, 3).map((document) => (
                  <div
                    key={document.id}
                    className="grid grid-cols-[1fr_168px_28px] items-center gap-4 rounded-[16px] bg-[#132a53] px-5 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="h-10 w-10 text-[#e8eefc]" strokeWidth={1.8} />
                      <p className="text-[18px] font-medium leading-snug text-[#edf3ff]">
                        {document.title}
                      </p>
                    </div>

                    <div>
                      <p className="text-[18px] font-medium text-[#eff4ff]">Generated</p>
                      <p className="mt-1 text-[16px] text-[#8191b1]">{document.date}</p>
                    </div>

                    <button
                      type="button"
                      aria-label={`Open actions for ${document.title}`}
                      className="flex h-7 w-7 items-center justify-center text-[#eef2fb] transition hover:opacity-80"
                    >
                      <MoreHorizontal className="h-6 w-6" strokeWidth={2.2} />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
