'use client';

import {
  Sidebar as AppSidebar,
  SidebarContent,
  SidebarHeader,
} from '@team-4/shadcn';
import { usePathname } from 'next/navigation';
import { getSidebarTone, sidebarPanelClasses } from './components/sidebarTheme';
import { SidebarBrand } from './components/SidebarBrand';
import { SidebarNav } from './components/SidebarNav';

export function Sidebar() {
  const pathname = usePathname();
  const tone = getSidebarTone(pathname);

  return (
    <AppSidebar
      collapsible="none"
      className="h-screen w-[352px] shrink-0 rounded-none border-none bg-transparent"
    >
      <div
        className={[
          'flex h-screen flex-col rounded-r-[30px]',
          sidebarPanelClasses[tone],
        ].join(' ')}
      >
        <SidebarHeader className="px-[16px] pb-0 pt-[18px]">
          <SidebarBrand tone={tone} />
        </SidebarHeader>
        <SidebarContent className="px-[16px] pb-[18px] pt-[18px]">
          <SidebarNav tone={tone} />
        </SidebarContent>
      </div>
    </AppSidebar>
  );
}
