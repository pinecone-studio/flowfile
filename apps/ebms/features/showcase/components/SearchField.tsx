import { Search } from "lucide-react";

export function SearchField({
  placeholder,
  className = '',
}: {
  placeholder: string;
  className?: string;
}) {
  return (
    <label
      className={`flex h-[54px] w-full items-center gap-4 rounded-[16px] border border-[#274983]/75 bg-[#2b4b87]/55 px-4 text-[#dce5f7] shadow-[0_10px_35px_rgba(3,9,24,0.18)] backdrop-blur-[14px] ${className}`}
    >
      <input
        aria-label={placeholder}
        className="w-full bg-transparent text-[17px] font-medium placeholder:text-[#b7c4dd] focus:outline-none"
        placeholder={placeholder}
      />
      <Search className="h-6 w-6 shrink-0 text-[#d0d8eb]" strokeWidth={2.1} />
    </label>
  );
}
