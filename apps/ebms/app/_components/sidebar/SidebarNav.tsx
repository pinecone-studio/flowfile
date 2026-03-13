'use client';

import { usePathname } from 'next/navigation';
import { isSidebarItemActive } from '../lib/sidebar/isSidebarItemActive';
import { sidebarItems } from '../lib/sidebar/sidebarItems';
import { SidebarNavItem } from './SidebarNavItems';

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-[2px] px-0 py-4">
      {sidebarItems.map((item) => (
        <SidebarNavItem
          key={item.href}
          item={item}
          isActive={isSidebarItemActive(pathname, item.href)}
        />
      ))}
    </nav>
  );
}
