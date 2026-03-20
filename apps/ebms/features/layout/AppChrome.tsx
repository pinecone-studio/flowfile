'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '../sidebar/Sidebar';

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSignPage = pathname.startsWith('/sign');

  if (isSignPage) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050b16]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55"
          style={{ backgroundImage: "url('/bg.png')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,31,64,0.88)_0%,rgba(7,14,27,0.95)_100%)]" />
        <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
          {children}
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen md:flex">
      <Sidebar />

      <div className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
          style={{ backgroundImage: "url('/bg.png')" }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,41,83,0.58)_0%,rgba(12,24,47,0.78)_42%,rgba(5,10,21,0.94)_100%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(159,186,227,0.38),transparent_24%),radial-gradient(circle_at_66%_62%,rgba(124,151,198,0.28),transparent_26%),radial-gradient(circle_at_28%_30%,rgba(41,78,155,0.18),transparent_20%)]" />

        <main className="relative h-full min-h-screen overflow-y-auto px-4 py-6 md:h-screen md:px-8 md:py-8 xl:px-10 xl:py-9">
          {children}
        </main>
      </div>
    </div>
  );
}
