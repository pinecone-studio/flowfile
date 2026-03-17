'use client';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarSeparator,
} from '@team-4/shadcn';
import { usePathname } from 'next/navigation';
import { isSidebarItemActive } from '../../../lib/sidebar/isSidebarItemActive';
import {
  sidebarFooterItems,
  sidebarSections,
} from '../../../lib/sidebar/sidebarItems';
import { SidebarNavItem } from './SidebarNavItems';

type SidebarNavProps = {
  tone: 'light' | 'dark';
};

export function SidebarNav({ tone }: SidebarNavProps) {
  const pathname = usePathname();
  const isDark = tone === 'dark';

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <nav aria-label="Sidebar navigation" className="flex flex-col gap-[18px]">
        {sidebarSections.map((section, index) => (
          <SidebarGroup key={section.key} className="p-0">
            {index > 0 ? (
              <SidebarSeparator
                className={[
                  'mx-[10px] mb-[18px]',
                  isDark ? 'bg-[#262626]' : 'bg-[#d7dee8]',
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
  );
}
