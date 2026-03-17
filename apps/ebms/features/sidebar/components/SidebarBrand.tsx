import Image from 'next/image';
import { Columns2 } from 'lucide-react';

type SidebarBrandProps = {
  tone: 'light' | 'dark';
};

export function SidebarBrand({ tone }: SidebarBrandProps) {
  const isDark = tone === 'dark';

  return (
    <div className="flex items-start justify-between px-[8px] pb-[22px]">
      <div className="flex min-w-0 items-center gap-[12px]">
        <div className="relative shrink-0">
          <Image
            src="/pro5.png"
            alt="Narantsatsralt.B"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <span
            className={[
              'absolute right-0 bottom-0 h-[8px] w-[8px] rounded-full bg-[#21c45d] ring-2',
              isDark ? 'ring-[#101010]' : 'ring-[#eef2f8]',
            ].join(' ')}
          />
        </div>

        <div className="min-w-0">
          <p
            className={[
              'truncate text-[15px] font-medium leading-[1.2] tracking-[-0.01em]',
              isDark ? 'text-[#f5f5f5]' : 'text-[#111827]',
            ].join(' ')}
          >
            Narantsatsralt.B
          </p>
          <p
            className={[
              'truncate pt-[4px] text-[12px] leading-none',
              isDark ? 'text-[#727277]' : 'text-[#6b7280]',
            ].join(' ')}
          >
            Narantsatsralt@gmail.com
          </p>
        </div>
      </div>

      <button
        type="button"
        aria-label="Collapse sidebar"
        className={[
          'mt-[1px] flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] transition-colors',
          isDark
            ? 'text-[#f5f5f5] hover:bg-[#171717]'
            : 'text-[#334155] hover:bg-[#e3e9f3]',
        ].join(' ')}
      >
        <Columns2 className="h-[18px] w-[18px]" strokeWidth={1.9} />
      </button>
    </div>
  );
}
