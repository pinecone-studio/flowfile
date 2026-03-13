import type { ReactNode } from 'react';
import './global.css';
import { Sidebar } from './_components/sidebar/Sidebar';

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-slate-50">
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
