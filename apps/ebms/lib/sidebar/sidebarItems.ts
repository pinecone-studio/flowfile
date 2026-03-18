import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  Briefcase,
  Calendar,
  ClipboardCheck,
} from 'lucide-react';
import { SidebarItem } from './sidebar.types';

export const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Documents', href: '/documents', icon: FileText },
  { label: 'Employees', href: '/employees', icon: Users },
  { label: 'Jobs', href: '/jobs', icon: Briefcase },
  { label: 'Schedule', href: '/schedule', icon: Calendar },
  { label: 'Approvals', href: '/approvals', icon: ClipboardCheck },
  { label: 'Settings', href: '/settings', icon: Settings },
];
