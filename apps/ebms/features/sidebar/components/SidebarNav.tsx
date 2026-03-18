// 'use client';
'use client';
import { usePathname } from 'next/navigation';
import { isSidebarItemActive } from '../../../lib/sidebar/isSidebarItemActive';
import { sidebarItems } from '../../../lib/sidebar/sidebarItems';
import { SidebarNavItems } from './SidebarNavItems';


export function SidebarNav({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 py-4">
      {sidebarItems.map((item) => (
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


// export function SidebarNav() {
//   const pathname = usePathname();

//   return (
//     <nav className="flex flex-col gap-[2px] px-0 py-4">
//       {sidebarItems.map((item) => (
//         <SidebarNavItem
//           key={item.href}
//           item={item}
//           isActive={isSidebarItemActive(pathname, item.href)}
//         />
//       ))}
//     </nav>
//   );
// }