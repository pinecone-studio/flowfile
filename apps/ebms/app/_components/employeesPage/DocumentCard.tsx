import { ChevronDown, Download, FileText, Printer } from 'lucide-react';

type DocumentCardProps = {
  title: string;
  type: string;
  expanded: boolean;
  onToggle: () => void;
  generated?: string;
  storage?: string;
};

const DocumentCard = ({
  title,
  type,
  expanded,
  onToggle,
  generated,
  storage,
}: DocumentCardProps) => {
  return (
    <div className="rounded-[10px] border border-[#c7cedd] bg-white p-3">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#46516b] text-white">
            <FileText className="h-4 w-4" strokeWidth={1.8} />
          </div>

          <div>
            <h3 className="text-[14px] font-medium leading-5 text-[#111827]">
              {title}
            </h3>
            <p className="mt-[2px] text-[12px] text-[#818794]">{type}</p>
          </div>
        </div>

        <ChevronDown
          className={`mt-1 h-4 w-4 shrink-0 text-[#111827] transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          strokeWidth={1.8}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? 'mt-4 max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-[#d7dce5] pt-4">
          <div className="grid grid-cols-2 gap-y-3 text-[12px]">
            <div>
              <p className="text-[#6b7280]">Generated:</p>
              <p className="mt-1 text-[#4b5565]">{generated}</p>
            </div>

            <div className="text-right">
              <p className="text-[#6b7280]">Storage:</p>
              <p className="mt-1 text-[#4b5565]">{storage}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="flex h-[30px] items-center justify-center gap-1 rounded-[4px] border border-[#c7cedd] bg-white text-[12px] font-medium text-[#4b5565]"
            >
              <Printer className="h-3.5 w-3.5" strokeWidth={1.8} />
              Print
            </button>

            <button
              type="button"
              className="flex h-[30px] items-center justify-center gap-1 rounded-[4px] bg-[#46516b] text-[12px] font-medium text-white"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.8} />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
