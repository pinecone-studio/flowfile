import Link from 'next/link';
import { SidebarItem } from '../lib/sidebar/sidebar.types';

type SidebarNavItemProps = {
  item: SidebarItem;
  isActive: boolean;
};

export function SidebarNavItem({
  item,
  isActive,
}: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={[
        'mx-0 flex h-[32px] items-center gap-3 rounded-none px-4 text-[14px] transition-colors',
        isActive
          ? 'bg-white font-medium text-[#111827]'
          : 'text-[#2f3440] hover:bg-white/80 hover:text-[#111827]',
      ].join(' ')}
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.7} />
      <span>{item.label}</span>
    </Link>
  );
}
