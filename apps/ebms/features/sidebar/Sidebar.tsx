'use client';

import { usePathname } from 'next/navigation';
import {
  Building2,
  ChartBar,
  ClipboardList,
  FileText,
  LayoutGrid,
  PenSquare,
  Settings,
  Users,
} from 'lucide-react';
import { sidebarUser } from '../showcase/showcase.data';
import { matchesPath } from './components/MatchesPath';
import { NavButton, NavItem } from './components/NavButton';


export function Sidebar() {
  const pathname = usePathname();
  const isDocuments = pathname.startsWith('/documents');
  const isActions = pathname.startsWith('/actions');
  const isEmployees = pathname === '/' || pathname.startsWith('/employees');

  const primaryItems: NavItem[] = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutGrid,
      active: matchesPath(pathname, '/dashboard'),
    },
    {
      href: '/employees',
      label: 'Employees',
      icon: Users,
      active: matchesPath(pathname, '/employees'),
    },
    {
      href: '/documents',
      label: 'Documents',
      icon: FileText,
      active: matchesPath(pathname, '/documents'),
      badge: '6',
    },
    isDocuments
      ? {
          href: '/departments',
          label: 'Departments',
          icon: Building2,
          active: matchesPath(pathname, '/departments'),
        }
      : {
          href: '/actions',
          label: isActions ? 'Action' : 'Actions',
          icon: ClipboardList,
          active: matchesPath(pathname, '/actions'),
          badge: isActions ? '4+ New Actions' : undefined,
        },
  ];

  const secondaryItems: NavItem[] = isEmployees
    ? [
        {
          href: '/reports',
          label: 'Reports',
          icon: ChartBar,
          active: matchesPath(pathname, '/reports'),
        },
        {
          href: '/settings',
          label: 'Settings',
          icon: Settings,
          active: matchesPath(pathname, '/settings'),
        },
      ]
    : [
        {
          href: '/reports',
          label: 'Reports',
          icon: ChartBar,
          active: matchesPath(pathname, '/reports'),
        },
        {
          href: '/sign',
          label: 'Sign Screen',
          icon: PenSquare,
          active: matchesPath(pathname, '/sign'),
        },
      ];



  return (
    <aside className="w-full shrink-0 border-b border-r border-white/5 bg-[linear-gradient(180deg,rgba(10,20,43,0.98)_0%,rgba(7,15,33,0.98)_55%,rgba(4,9,20,1)_100%)] md:h-screen md:w-[350px] md:border-b-0">
      <div className="flex h-full flex-col px-4 pb-6 pt-5 md:px-4 md:pb-7 md:pt-6">
        <div className="flex items-center gap-4 px-2">
          <div className="relative h-[46px] w-[46px] shrink-0 overflow-hidden rounded-[12px]">
            <img
              src={sidebarUser.avatar}
              alt={sidebarUser.name}
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0b1731] bg-[#26cd45]" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[23px] font-medium tracking-[-0.02em] text-white">
              {sidebarUser.name}
            </p>
            <p className="truncate text-[14px] text-[#cfd8eb]">{sidebarUser.email}</p>
          </div>
        </div>

        <nav className="mt-12 flex flex-col gap-2">
          {primaryItems.map((item) => (
            <NavButton key={`${item.href}-${item.label}`} item={item} />
          ))}
        </nav>

        <div className="mx-4 my-6 h-px bg-[#1d3869]" />

        <nav className="flex flex-col gap-2">
          {secondaryItems.map((item) => (
            <NavButton key={`${item.href}-${item.label}`} item={item} />
          ))}
        </nav>

        {/* <nav className="mt-10 flex flex-col gap-2 pt-10 md:mt-auto">
          {footerItems.map((item) => (
            <NavButton key={`${item.href}-${item.label}`} item={item} />
          ))}
        </nav> */}
      </div>
    </aside>
  );
}
