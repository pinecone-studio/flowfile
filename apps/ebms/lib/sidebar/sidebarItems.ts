import {
  BarChart3,
  Building2,
  Calendar,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';
import type { SidebarItem } from './sidebar.types';

export const sidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Employees',
    href: '/',
    icon: Users,
  },
  {
    label: 'Departments',
    href: '/departments',
    icon: Building2,
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: BarChart3,
  },
  {
    label: 'Documents',
    href: '/documents',
    icon: FileText,
  },
  {
    label: 'Calendar',
    href: '/calendar',
    icon: Calendar,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];
