import type { ReactNode } from 'react';
import './global.css';
import { Sidebar } from '../features/sidebar/Sidebar';

export const metadata = {
  title: 'FlowFile',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased overflow-hidden text-gray-200 min-h-screen relative">
        
        {/* Арын дэвсгэр зураг - Fixed, No Blur */}
        <div 
          className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/backgroundImage.png')" }} 
        />

        {/* Overlay - Зургийг текст уншихад амар болгож бага зэрэг бараан болгоно */}
        <div className="fixed inset-0 z-[-1] bg-black/20" />

        <div className="flex h-screen w-full relative z-10">
          {/* Sidebar - Одоо тогтмол өргөнтэй (260px) */}
          <Sidebar />

          {/* Main Content Area - Blur-гүй, тунгалаг контейнер */}
          <main className="relative flex-1 m-4 ml-0 overflow-hidden rounded-[32px]">
            <div className="h-full w-full overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
