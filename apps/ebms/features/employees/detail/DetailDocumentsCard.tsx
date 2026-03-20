import { MoreHorizontal } from 'lucide-react';
import type { DetailDocumentItem } from './employeeProfile.data';
import { DetailPanel } from './DetailPanel';

const statusClassNames = {
  'Generating...': 'text-[#eef3ff]',
  Failed: 'text-[#eef3ff]',
  Generated: 'text-[#eef3ff]',
};

type DetailDocumentsCardProps = {
  items: DetailDocumentItem[];
};

export function DetailDocumentsCard({ items }: DetailDocumentsCardProps) {
  return (
    <DetailPanel title="Documents" bodyClassName="space-y-[18px]">
      {items.length === 0 ? (
        <p className="text-[17px] text-[#c8d2e9]">No documents yet.</p>
      ) : null}

      {items.map((item) => (
        <article
          key={item.id}
          className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)_auto] items-center gap-4"
        >
          <p className="text-[18px] font-medium leading-snug text-[#f2f6ff]">
            {item.title}
          </p>

          <div>
            <p className={`text-[20px] font-medium ${statusClassNames[item.status]}`}>
              {item.status}
            </p>
            <p className="mt-[3px] text-[16px] text-[#8194bf]">{item.date}</p>
          </div>

          <button
            type="button"
            aria-label={`Open actions for ${item.title}`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#eef2fb] transition hover:bg-white/5"
          >
            <MoreHorizontal className="h-5 w-5" strokeWidth={2.2} />
          </button>
        </article>
      ))}
    </DetailPanel>
  );
}
