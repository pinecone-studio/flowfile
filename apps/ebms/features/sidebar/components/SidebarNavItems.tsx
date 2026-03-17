import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@team-4/shadcn';
import Link from 'next/link';
import { SidebarItem } from '../../../lib/sidebar/sidebar.types';

type SidebarNavItemProps = {
  item: SidebarItem;
  isActive: boolean;
  tone: 'light' | 'dark';
};

export function SidebarNavItem({
  item,
  isActive,
  tone,
}: SidebarNavItemProps) {
  const Icon = item.icon;
  const isDark = tone === 'dark';

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={[
          'h-[36px] gap-[12px] rounded-[12px] px-[12px] text-[14px] leading-none',
          isDark
            ? 'text-[#737378] hover:bg-[#161616] hover:text-[#d1d1d6] data-[active=true]:bg-[#1d1d1d] data-[active=true]:text-[#f5f5f5]'
            : 'text-[#4b5563] hover:bg-white/75 hover:text-[#111827] data-[active=true]:bg-white data-[active=true]:text-[#111827] data-[active=true]:shadow-[0_1px_2px_rgba(15,23,42,0.08)]',
        ].join(' ')}
      >
        <Link href={item.href} aria-current={isActive ? 'page' : undefined}>
          <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
          <span className="truncate">{item.label}</span>
        </Link>
      </SidebarMenuButton>
      {item.badge ? (
        <SidebarMenuBadge
          className={[
            'right-[12px] top-1/2 h-[18px] min-w-[18px] -translate-y-1/2 rounded-[6px] px-[5px] text-[10px] font-medium',
            isDark
              ? 'bg-[#163b1f] text-[#6fdc84]'
              : 'bg-[#dff6e5] text-[#197a33]',
          ].join(' ')}
        >
          {item.badge}
        </SidebarMenuBadge>
      ) : null}
    </SidebarMenuItem>
  );
}
