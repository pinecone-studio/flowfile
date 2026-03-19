import { LucideIcon } from "lucide-react";
import Link from "next/link";


export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  badge?: string;
}

export function NavButton({ item }: { item: NavItem }) {
  const Icon = item.icon;
  const badgeClass =
    item.badge === '6'
      ? 'rounded-[8px] bg-[#22478a] px-2 py-1 text-[14px]'
      : 'rounded-[9px] bg-[#3d78d7] px-3 py-1 text-[14px]';

  return (
    <Link
      href={item.href}
      className={`flex min-h-[50px] items-center gap-4 rounded-[14px] px-4 text-[17px] font-medium transition ${
        item.active
          ? 'bg-[#1d3f81] text-white shadow-[0_14px_30px_rgba(7,22,54,0.28)]'
          : 'text-[#d5dbee] hover:bg-white/[0.06] hover:text-white'
      }`}
    >
      <Icon className="h-6 w-6 shrink-0" strokeWidth={1.9} />
      <span className="flex-1">{item.label}</span>
      {item.badge ? (
        <span className={`${badgeClass} font-medium text-white`}>{item.badge}</span>
      ) : null}
    </Link>
  );
}