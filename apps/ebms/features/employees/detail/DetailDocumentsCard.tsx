import { MoreHorizontal } from 'lucide-react';
import type { DetailDocumentItem } from './employeeProfile.data';
import { DetailPanel } from './DetailPanel';

const statusClassNames = {
  'Generating...': 'text-[#eff4ff]',
  Failed: 'text-[#eef3ff]',
  Generated: 'text-[#eef3ff]',
};

type DetailDocumentsCardProps = {
  items: DetailDocumentItem[];
};

export function DetailDocumentsCard({ items }: DetailDocumentsCardProps) {
  return (
    <DetailPanel title="Documents" bodyClassName="space-y-7">
      {items.map((item) => (
        <article
          key={item.id}
          className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)_auto] items-center gap-4"
        >
          <p className="text-[17px] font-medium text-[#f2f6ff]">{item.title}</p>

          <div>
            <p className={`text-[20px] font-medium ${statusClassNames[item.status]}`}>
              {item.status}
            </p>
            <p className="mt-1 text-[16px] text-[#8191b1]">{item.date}</p>
          </div>

          <button
            type="button"
            aria-label={`Open actions for ${item.title}`}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#eef2fb] transition hover:bg-white/5"
          >
            <MoreHorizontal className="h-6 w-6" strokeWidth={2.2} />
          </button>
        </article>
      ))}
    </DetailPanel>
  );
}
