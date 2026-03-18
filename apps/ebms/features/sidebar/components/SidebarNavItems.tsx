import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@team-4/shadcn';
import Link from 'next/link';
import { SidebarItem } from '../../../lib/sidebar/sidebar.types';
import type { SidebarTone } from './sidebarTheme';

type SidebarNavItemProps = {
  item: SidebarItem;
  isActive: boolean;
  tone: SidebarTone;
};

const navItemToneClasses: Record<
  SidebarTone,
  { button: string; badge: string }
> = {
  light: {
    button:
      'text-[#4b5563] hover:bg-white/75 hover:text-[#111827] data-[active=true]:bg-white data-[active=true]:text-[#111827] data-[active=true]:shadow-[0_1px_2px_rgba(15,23,42,0.08)]',
    badge: 'bg-[#dff6e5] text-[#197a33]',
  },
  dark: {
    button:
      'text-[#737378] hover:bg-[#161616] hover:text-[#d1d1d6] data-[active=true]:bg-[#1d1d1d] data-[active=true]:text-[#f5f5f5]',
    badge: 'bg-[#163b1f] text-[#6fdc84]',
  },
};

export function SidebarNavItem({ item, isActive, tone }: SidebarNavItemProps) {
  const Icon = item.icon;
  const toneClasses = navItemToneClasses[tone];

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={[
          'h-[36px] gap-[12px] rounded-[12px] px-[12px] text-[14px] leading-none',
          toneClasses.button,
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
            toneClasses.badge,
          ].join(' ')}
        >
          {item.badge}
        </SidebarMenuBadge>
      ) : null}
    </SidebarMenuItem>
  );
}
