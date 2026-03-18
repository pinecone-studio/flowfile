export type SidebarTone = 'light' | 'dark';

export const sidebarPanelClasses: Record<SidebarTone, string> = {
  light: 'border-r border-[#d6dde8] bg-sidebar',
  dark: 'border-r border-[#1b1b1b] bg-[#101010]',
};

export function getSidebarTone(pathname: string): SidebarTone {
  if (pathname === '/documents' || pathname.startsWith('/documents/')) {
    return 'dark';
  }

  return 'light';
}
