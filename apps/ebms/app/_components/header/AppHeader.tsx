import Image from 'next/image';
import { ChevronsUpDown, SunMedium } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export function AppHeader() {
  return (
    <header className="flex h-[50px] items-center justify-between border-b border-[#cdd4e2] bg-white px-5">
      <div className="flex items-center gap-4">
        <BrandLogo className="h-[31px] w-[20px]" />

        <button
          type="button"
          className="flex h-[32px] items-center gap-2 rounded-[5px] border border-[#c7ccd6] bg-[#f5f4ef] px-3 text-[14px] font-medium text-[#111827]"
        >
          <span>HR Management</span>
          <ChevronsUpDown className="h-4 w-4 text-[#111827]" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Theme settings"
          className="text-[#111827]"
        >
          <SunMedium className="h-5 w-5" strokeWidth={1.8} />
        </button>

        <button
          type="button"
          aria-label="Open profile"
          className="overflow-hidden rounded-full"
        >
          <Image
            src="/pro5.png"
            alt="Profile"
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}
