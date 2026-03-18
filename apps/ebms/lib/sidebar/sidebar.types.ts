import type { LucideIcon } from 'lucide-react';

export type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export type SidebarSection = {
  key: string;
  items: SidebarItem[];
};
