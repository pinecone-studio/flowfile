'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

type FilterOption = {
  label: string;
  value: string;
};

type FilterSelectProps = {
  label: string;
  withPrefix?: string;
  options?: FilterOption[];
  value?: string;
  onValueChange?: (value: string) => void;
};

const findLabel = (options: FilterOption[], value: string, label: string) =>
  options.find((option) => option.value === value)?.label ?? label;

export function FilterSelect({
  label,
  withPrefix,
  options = [],
  value = 'all',
  onValueChange,
}: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  return (
    <div ref={rootRef} className="relative flex items-center gap-3">
      {withPrefix ? (
        <span className="text-[14px] font-medium text-[#c6d3ea]/90">{withPrefix}</span>
      ) : null}

      <button
        type="button"
        className={`flex h-[34px] min-w-[104px] items-center justify-between gap-2 rounded-[10px] border px-3 text-[12px] font-medium transition ${
          isOpen
            ? 'border-[#5d88d1] bg-[#243f74] text-white shadow-[0_10px_28px_rgba(9,20,45,0.28)]'
            : 'border-[#314f83]/80 bg-[#2b4678]/72 text-[#eef4ff]'
        }`}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="truncate">{findLabel(options, value, label)}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-[#d7e4ff] transition ${
            isOpen ? 'rotate-180' : ''
          }`}
          strokeWidth={2.4}
        />
      </button>

      {isOpen && options.length > 0 ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-30 min-w-[184px] overflow-hidden rounded-[14px] border border-[#3c5e98]/80 bg-[#102346]/95 p-1.5 shadow-[0_24px_44px_rgba(4,10,24,0.42)] backdrop-blur-[18px]">
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={`${label}-${option.value}`}
                type="button"
                className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left text-[13px] font-medium transition ${
                  isSelected
                    ? 'bg-[#284a86] text-white'
                    : 'text-[#d4def3] hover:bg-[#1b3566] hover:text-white'
                }`}
                onClick={() => {
                  onValueChange?.(option.value);
                  setIsOpen(false);
                }}
              >
                <span>{option.label}</span>
                {isSelected ? (
                  <Check className="h-3.5 w-3.5 text-[#cfe0ff]" strokeWidth={3} />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
