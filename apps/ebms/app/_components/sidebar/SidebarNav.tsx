'use client';

import { usePathname } from 'next/navigation';
import { sidebarItems } from '../lib/sidebar/sidebarItems';
import { SidebarNavItem } from './SidebarNavItems';
import { isSidebarItemActive } from '../lib/sidebar/isSidebarItemActive';


export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3">
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