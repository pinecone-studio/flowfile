import type { ReactNode } from 'react';
import './global.css';
import { AppHeader } from './_components/header/AppHeader';
import { Sidebar } from './_components/sidebar/Sidebar';

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
    <html lang="en">
      <body className="bg-[#e7ecf7]">
        <div className="min-h-screen bg-[#e7ecf7]">
          <AppHeader />
          <div className="flex min-h-[calc(100vh-50px)]">
            <Sidebar />
            <main className="flex-1 overflow-x-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
