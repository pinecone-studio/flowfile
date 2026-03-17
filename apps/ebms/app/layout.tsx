import type { CSSProperties, ReactNode } from 'react';
import { SidebarInset, SidebarProvider } from '@team-4/shadcn';
import './global.css';
import { Sidebar } from '../features/sidebar/Sidebar';

type RootLayoutProps = {
  children: ReactNode;
};

export const metadata = {
  title: 'FlowFile',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden bg-[#f7f8fb] text-[#111827]">
        <SidebarProvider
          className="h-screen bg-[#f7f8fb]"
          style={{ '--sidebar-width': '22rem' } as CSSProperties}
        >
          <Sidebar />
          <SidebarInset className="min-w-0 overflow-y-auto overflow-x-hidden bg-[#f7f8fb]">
            {children}
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
