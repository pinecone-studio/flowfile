
import Link from 'next/link';
import { SidebarItem } from '../../../lib/sidebar/sidebar.types';

type SidebarNavItemProps = {
  item: SidebarItem;
  isActive: boolean;
  isCollapsed: boolean;
};

export function SidebarNavItems({
  item,
  isActive,
  isCollapsed,
}: SidebarNavItemProps) {
  const Icon = item.icon;
  // Label шалгалтыг тусад нь хувьсагчид авснаар JSX доторх complexity-г бууруулна
  const showBadge = !isCollapsed && item.label === 'Documents';

  return (
    <Link
      href={item.href}
      className={`
        mx-2 flex h-10 items-center gap-3 rounded-lg px-3 transition-all
        ${
          isActive
            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        }
      `}
    >
      <Icon
        className={`h-5 w-5 shrink-0 ${isActive ? 'text-blue-600' : ''}`}
        strokeWidth={2}
      />

      {!isCollapsed && (
        <div className="flex w-full items-center justify-between">
          <span className="text-sm font-medium">{item.label}</span>
          {showBadge && (
            <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
              6
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
