

'use client';

import React from 'react';
import {
  LayoutGrid,
  Users,
  FileText,
  Building2,
  BarChart3,
  Settings,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive?: boolean;
}

const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isActive,
}: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 w-full
        ${
          isActive
            ? 'bg-blue-600/10 text-blue-400 shadow-[inset_0_0_15px_rgba(37,99,235,0.1)]'
            : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
        }
      `}
    >
      <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
      <span className="text-[14px] font-medium">{label}</span>
    </Link>
  );
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-[260px] shrink-0 flex-col bg-transparent md:flex border-r border-white/5">
      {/* User Profile Section */}
      <div className="flex items-center gap-3 p-8">
        <div className="relative h-10 w-10 shrink-0">
          <img
            src="https://i.pravatar.cc/100?u=admin"
            className="rounded-lg object-cover border border-white/10"
            alt="User"
          />
          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#051124] bg-green-500" />
        </div>
        <div className="overflow-hidden">
          <p className="truncate text-sm font-semibold text-white">
            Narantsatsralt.B
          </p>
          <p className="truncate text-[10px] text-gray-500 font-medium">
            Narantsatsralt@nest.edu.mn
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-4">
        <SidebarItem
          icon={LayoutGrid}
          label="Dashboard"
          href="/dashboard"
          isActive={pathname === '/dashboard'}
        />
        <SidebarItem
          icon={Users}
          label="Employees"
          href="/employees"
          isActive={pathname === '/employees'}
        />
        <SidebarItem
          icon={FileText}
          label="Documents"
          href="/documents"
          isActive={pathname === '/documents' || pathname === '/'}
        />
        <SidebarItem
          icon={Building2}
          label="Departments"
          href="/departments"
          isActive={pathname === '/departments'}
        />

        <div className="my-6 h-[1px] w-full bg-white/5 mx-4" />

        <SidebarItem
          icon={BarChart3}
          label="Reports"
          href="/reports"
          isActive={pathname === '/reports'}
        />
        <SidebarItem
          icon={Settings}
          label="Settings"
          href="/settings"
          isActive={pathname === '/settings'}
        />
      </nav>
    </aside>
  );
}
