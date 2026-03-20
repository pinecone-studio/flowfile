import { ChevronDown } from 'lucide-react';
import { DetailPanel } from './DetailPanel';

type DetailGenerateCardProps = {
  options: string[];
};

export function DetailGenerateCard({ options }: DetailGenerateCardProps) {
  const [primaryOption = 'Select a document', ...secondaryOptions] = options;

  return (
    <DetailPanel title="Generate Document" bodyClassName="space-y-[27px]">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-h-[46px] flex-1 items-center justify-between rounded-[10px] bg-[#16315d] px-4 text-[18px] font-medium text-[#eef3ff]">
          <span>{primaryOption}</span>
          <ChevronDown className="h-5 w-5 text-[#b8c6e1]" strokeWidth={2.2} />
        </div>

        <button
          type="button"
          className="flex h-[46px] min-w-[242px] items-center justify-center rounded-[10px] bg-[#23478a] px-8 text-[18px] font-semibold text-[#eef4ff] transition hover:bg-[#2d549b]"
        >
          Generate
        </button>
      </div>

      <div className="space-y-[19px]">
        {secondaryOptions.map((option) => (
          <p key={option} className="text-[18px] font-medium text-[#edf2ff]">
            {option}
          </p>
        ))}
      </div>
    </DetailPanel>
  );
}
