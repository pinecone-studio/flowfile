'use client';

import { usePathname } from "next/navigation";
import { SidebarNavItems } from "./SidebarNavItems";
import { isSidebarItemActive } from "@/apps/ebms/lib/sidebar/isSidebarItemActive";
import { sidebarItems } from "../../../lib/sidebar/sidebarItems"; // Энийг нэмэв
import { SidebarItem } from "../../../lib/sidebar/sidebar.types"; // Энийг нэмэв

export function SidebarNav({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 py-4">
      {sidebarItems.map((item: SidebarItem) => ( // item: SidebarItem гэж төрлийг нь заав
        <SidebarNavItems
          key={item.href}
          item={item}
          isCollapsed={isCollapsed}
          isActive={isSidebarItemActive(pathname, item.href)}
        />
      ))}
    </nav>
  );
}