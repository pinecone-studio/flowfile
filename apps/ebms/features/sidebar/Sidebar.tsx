'use client';

import { usePathname } from 'next/navigation';
import {
  ClipboardCheck,
  FileText,
  LayoutGrid,
  Logs,
  Users,
} from 'lucide-react';
import { sidebarUser } from '../flowfile/flowfile.data';
import { matchesPath } from './components/MatchesPath';
import { NavButton, NavItem } from './components/NavButton';
import FlowFileLogo from './components/FlowFileLogo';

const primaryItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutGrid,
  },
  {
    href: '/employees',
    label: 'Employees',
    icon: Users,
  },
  {
    href: '/documents',
    label: 'Documents',
    icon: FileText,
    badge: '4',
  },
];

const secondaryItems: NavItem[] = [
  {
    href: '/audit-log',
    label: 'Audit Log',
    icon: Logs,
  },
  {
    href: '/approval',
    label: 'Approval',
    icon: ClipboardCheck,
  },
];


export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-b border-white/5 bg-[linear-gradient(180deg,#122448_0%,#0d1c3c_52%,#081226_100%)] md:h-screen md:w-[269px] md:border-b-0 md:border-r md:border-r-white/5">
      <div className="flex h-full flex-col px-4 pb-5 pt-5 md:px-4 md:pb-6 md:pt-6">
        <div className="flex items-center gap-3 px-2">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[12px]">
            <img
              src={sidebarUser.avatar}
              alt={sidebarUser.name}
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-0 right-0 h-[10px] w-[10px] rounded-full border-2 border-[#102042] bg-[#26cd45]" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[16px] font-medium tracking-[-0.02em] text-white">
              {sidebarUser.name}
            </p>
            <p className="truncate text-[16px] leading-5 text-[#cfd8eb]">
              {sidebarUser.email}
            </p>
          </div>
        </div>

        <nav className="mt-12 flex flex-col gap-2">
          {primaryItems.map((item) => (
            <NavButton
              key={item.href}
              item={{ ...item, active: matchesPath(pathname, item.href) }}
            />
          ))}
        </nav>

        <div className="mx-3 my-6 h-px bg-[#2a477b]" />

        <nav className="flex flex-col gap-2">
          {secondaryItems.map((item) => (
            <NavButton
              key={item.href}
              item={{ ...item, active: matchesPath(pathname, item.href) }}
            />
          ))}
        </nav>

        <div className="mt-8 md:mt-auto">
          <div className="flex items-center gap-3 px-3 py-2 text-[#cfd7eb]">
            <FlowFileLogo />
            <span className="text-[16px] font-medium tracking-[-0.02em]">
              FlowFile EPAS
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
