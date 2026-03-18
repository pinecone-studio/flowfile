import {
  BarChart3,
  Building2,
  FileText,
  LayoutGrid,
  Settings,
  Users,
} from 'lucide-react';
import type { SidebarItem, SidebarSection } from './sidebar.types';

const primarySidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
  },
  {
    label: 'Employees',
    href: '/',
    icon: Users,
  },
  {
    label: 'Documents',
    href: '/documents',
    icon: FileText,
    badge: '6',
  },
  {
    label: 'Departments',
    href: '/departments',
    icon: Building2,
  },
];

const utilitySidebarItems: SidebarItem[] = [
  {
    label: 'Reports',
    href: '/reports',
    icon: BarChart3,
  },
  {
    label: 'Settings',
    href: '/sign',
    icon: Settings,
  },
];

export const sidebarSections: SidebarSection[] = [
  {
    key: 'primary',
    items: primarySidebarItems,
  },
  {
    key: 'utility',
    items: utilitySidebarItems,
  },
];

export const sidebarFooterItems = utilitySidebarItems;
