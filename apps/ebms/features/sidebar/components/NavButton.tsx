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
    item.badge === '4'
      ? 'rounded-[10px] bg-[#2870f0] px-[11px] py-[3px] text-[14px]'
      : item.badge?.includes('Waiting')
        ? 'rounded-[10px] bg-[#2870f0] px-[11px] py-[5px] text-[12px]'
        : item.badge?.includes('New Actions')
          ? 'rounded-[10px] bg-[#2870f0] px-[10px] py-[5px] text-[12px]'
          : 'rounded-[10px] bg-[#22478a] px-2 py-1 text-[14px]';

  return (
    <Link
      href={item.href}
      className={`flex min-h-[48px] items-center gap-3 rounded-[14px] px-4 text-[16px] font-medium transition ${
        item.active
          ? 'bg-[#1d4385] text-white shadow-[0_18px_32px_rgba(7,22,54,0.28)]'
          : 'text-[#d5dbee] hover:bg-white/[0.06] hover:text-white'
      }`}
    >
      <Icon className="h-5 w-5 shrink-0" strokeWidth={1.9} />
      <span className="flex-1">{item.label}</span>
      {item.badge ? (
        <span className={`${badgeClass} font-medium text-white`}>{item.badge}</span>
      ) : null}
    </Link>
  );
}
