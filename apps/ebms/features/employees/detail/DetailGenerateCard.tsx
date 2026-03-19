import { ChevronDown } from 'lucide-react';
import { DetailPanel } from './DetailPanel';

type DetailGenerateCardProps = {
  options: string[];
};

export function DetailGenerateCard({ options }: DetailGenerateCardProps) {
  const [primaryOption, ...secondaryOptions] = options;

  return (
    <DetailPanel title="Generate Document" bodyClassName="space-y-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
        <div className="flex min-h-[48px] flex-1 items-center justify-between rounded-[14px] bg-[#182847] px-5 text-[17px] font-medium text-[#eef3ff]">
          <span>{primaryOption}</span>
          <ChevronDown className="h-5 w-5 text-[#b8c6e1]" strokeWidth={2.2} />
        </div>

        <button
          type="button"
          className="flex h-[48px] min-w-[158px] items-center justify-center rounded-[14px] bg-[#274988] px-8 text-[18px] font-semibold text-[#eef4ff] transition hover:bg-[#2d549b]"
        >
          Generate
        </button>
      </div>

      <div className="space-y-5">
        {secondaryOptions.map((option) => (
          <p key={option} className="text-[17px] font-medium text-[#edf2ff]">
            {option}
          </p>
        ))}
      </div>
    </DetailPanel>
  );
}
