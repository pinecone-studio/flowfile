'use client';

import {
  Sidebar as AppSidebar,
  SidebarContent,
  SidebarHeader,
} from '@team-4/shadcn';
import { usePathname } from 'next/navigation';
import { SidebarBrand } from './components/SidebarBrand';
import { SidebarNav } from './components/SidebarNav';

export function Sidebar() {
  const pathname = usePathname();
  const isDocumentsView =
    pathname === '/documents' || pathname.startsWith('/documents/');

  return (
    <AppSidebar
      collapsible="none"
      className="h-screen w-[352px] shrink-0 rounded-none border-none bg-transparent"
    >
      <div
        className={[
          'flex h-screen flex-col rounded-r-[30px]',
          isDocumentsView
            ? 'border-r border-[#1b1b1b] bg-[#101010]'
            : 'border-r border-[#d6dde8] bg-sidebar',
        ].join(' ')}
      >
        <SidebarHeader className="px-[16px] pb-0 pt-[18px]">
          <SidebarBrand tone={isDocumentsView ? 'dark' : 'light'} />
        </SidebarHeader>
        <SidebarContent className="px-[16px] pb-[18px] pt-[18px]">
          <SidebarNav tone={isDocumentsView ? 'dark' : 'light'} />
        </SidebarContent>
      </div>
    </AppSidebar>
  );
}
