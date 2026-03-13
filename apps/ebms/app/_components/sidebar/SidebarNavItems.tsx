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
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
        isActive
          ? 'bg-white font-medium text-slate-900 shadow-sm'
          : 'text-slate-600 hover:bg-white hover:text-slate-900',
      ].join(' ')}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}