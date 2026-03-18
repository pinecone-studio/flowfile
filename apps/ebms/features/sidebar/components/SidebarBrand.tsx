import Image from 'next/image';
import { Columns2 } from 'lucide-react';
import type { SidebarTone } from '../sidebarTheme';

type SidebarBrandProps = {
  tone: SidebarTone;
};

const brandToneClasses: Record<
  SidebarTone,
  { ring: string; name: string; email: string; button: string }
> = {
  light: {
    ring: 'ring-[#eef2f8]',
    name: 'text-[#111827]',
    email: 'text-[#6b7280]',
    button: 'text-[#334155] hover:bg-[#e3e9f3]',
  },
  dark: {
    ring: 'ring-[#101010]',
    name: 'text-[#f5f5f5]',
    email: 'text-[#727277]',
    button: 'text-[#f5f5f5] hover:bg-[#171717]',
  },
};

export function SidebarBrand({ tone }: SidebarBrandProps) {
  const toneClasses = brandToneClasses[tone];

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
              toneClasses.ring,
            ].join(' ')}
          />
        </div>

        <div className="min-w-0">
          <p
            className={[
              'truncate text-[15px] font-medium leading-[1.2] tracking-[-0.01em]',
              toneClasses.name,
            ].join(' ')}
          >
            Narantsatsralt.B
          </p>
          <p
            className={[
              'truncate pt-[4px] text-[12px] leading-none',
              toneClasses.email,
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
          toneClasses.button,
        ].join(' ')}
      >
        <Columns2 className="h-[18px] w-[18px]" strokeWidth={1.9} />
      </button>
    </div>
  );
}
