// 'use client';
'use client';
<<<<<<< HEAD

import { SidebarGroup, SidebarMenu, SidebarSeparator } from '@team-4/shadcn';
import { usePathname } from 'next/navigation';
import { isSidebarItemActive } from '../../../lib/sidebar/isSidebarItemActive';
import {
  sidebarFooterItems,
  sidebarSections,
} from '../../../lib/sidebar/sidebarItems';
import type { SidebarTone } from './sidebarTheme';
import { SidebarNavItem } from './SidebarNavItems';

type SidebarNavProps = {
  tone: SidebarTone;
};

const separatorToneClasses: Record<SidebarTone, string> = {
  light: 'bg-[#d7dee8]',
  dark: 'bg-[#262626]',
};

export function SidebarNav({ tone }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <nav aria-label="Sidebar navigation" className="flex flex-col gap-[18px]">
        {sidebarSections.map((section, index) => (
          <SidebarGroup key={section.key} className="p-0">
            {index > 0 ? (
              <SidebarSeparator
                className={[
                  'mx-[10px] mb-[18px]',
                  separatorToneClasses[tone],
                ].join(' ')}
              />
            ) : null}

            <SidebarMenu className="gap-[6px]">
              {section.items.map((item) => (
                <SidebarNavItem
                  key={`${section.key}-${item.href}`}
                  item={item}
                  isActive={isSidebarItemActive(pathname, item.href)}
                  tone={tone}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </nav>

      <nav
        aria-label="Sidebar quick access"
        className="mt-auto flex flex-col gap-[6px] pt-[18px]"
      >
        <SidebarMenu className="gap-[6px]">
          {sidebarFooterItems.map((item) => (
            <SidebarNavItem
              key={`footer-${item.href}`}
              item={item}
              isActive={isSidebarItemActive(pathname, item.href)}
              tone={tone}
            />
          ))}
        </SidebarMenu>
      </nav>
    </div>
=======
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
>>>>>>> d828d3c (ui: hide scrollbar in DocumentPanel)
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