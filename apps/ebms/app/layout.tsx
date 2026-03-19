import type { ReactNode } from 'react';
import './global.css';
import { AppChrome } from '../features/layout/AppChrome';

export const metadata = {
  title: 'FlowFile',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
<<<<<<< Updated upstream
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-[#050b16] text-[#f5f7ff] antialiased">
        <div className="min-h-screen md:flex">
          <Sidebar />

          <div className="relative flex-1 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/backgroundImage.jpeg')" }}
            />

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,28,61,0.62)_0%,rgba(9,20,43,0.8)_38%,rgba(5,10,21,0.96)_100%)]" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(140,169,214,0.3),transparent_24%),radial-gradient(circle_at_73%_68%,rgba(113,140,189,0.22),transparent_30%),radial-gradient(circle_at_34%_42%,rgba(29,67,149,0.2),transparent_22%)]" />

            <main className="relative h-full min-h-screen overflow-y-auto px-5 py-6 md:h-screen md:px-10 md:py-9 xl:px-12 xl:py-10">
              {children}
            </main>
          </div>
        </div>
=======
    <html lang="en">
      <body className="min-h-screen text-[#f5f7ff] antialiased">
        <AppChrome>{children}</AppChrome>
>>>>>>> Stashed changes
      </body>
    </html>
  );
}
