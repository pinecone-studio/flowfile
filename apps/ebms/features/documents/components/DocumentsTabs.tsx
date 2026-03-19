import type { DocumentsCategoryKey } from '../documents.transform';

type DocumentsTabsProps = {
  categories: Array<{ key: DocumentsCategoryKey; label: string; count: number }>;
  categoryKey: DocumentsCategoryKey;
  onChange: (key: DocumentsCategoryKey) => void;
};

export function DocumentsTabs({
  categories,
  categoryKey,
  onChange,
}: DocumentsTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-5 text-[16px] font-medium text-[#e4eaf8]">
      {categories.map((category) => {
        const isActive = category.key === categoryKey;

        return (
          <button
            key={category.key}
            type="button"
            onClick={() => onChange(category.key)}
            className={`flex items-center gap-2 rounded-[12px] px-4 py-3 transition ${
              isActive
                ? 'bg-[#23478a] text-white shadow-[0_16px_28px_rgba(7,21,48,0.3)]'
                : 'text-[#e4eaf8] hover:bg-white/5'
            }`}
          >
            <span>{category.label}</span>
            <span
              className={`rounded-full px-2 py-[2px] text-[13px] leading-none ${
                isActive ? 'bg-white/15 text-white' : 'bg-[#1a315d] text-[#b9c8ea]'
              }`}
            >
              {category.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
