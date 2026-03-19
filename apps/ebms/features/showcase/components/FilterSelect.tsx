import { ChevronDown } from "lucide-react";

export function FilterSelect({
  label,
  withPrefix,
}: {
  label: string;
  withPrefix?: string;
}) {
  return (
    <div className="flex items-center gap-4">
      {withPrefix ? (
        <span className="text-[18px] font-medium text-[#d1d8e8]">
          {withPrefix}
        </span>
      ) : null}
      <button
        type="button"
        className="flex h-[46px] items-center gap-3 rounded-[14px] border border-[#203f76]/70 bg-[#18315d]/72 px-4 text-[16px] font-medium text-[#d8e0f2] backdrop-blur-[14px]"
      >
        <span>{label}</span>
        <ChevronDown className="h-5 w-5 text-[#cbd5ea]" strokeWidth={2} />
      </button>
    </div>
  );
}


