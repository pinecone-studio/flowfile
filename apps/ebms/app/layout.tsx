<<<<<<< HEAD
import type { CSSProperties, ReactNode } from 'react';
import { SidebarInset, SidebarProvider } from '@team-4/shadcn';
=======
// import type { ReactNode } from 'react';
// import './global.css';
// import { AppHeader } from '../features/header/AppHeader';
// import { Sidebar } from '../features/sidebar/Sidebar';

// type RootLayoutProps = {
//   children: ReactNode;
// };

// export const metadata = {
//   title: 'FlowFile',
//   icons: {
//     icon: '/favicon.svg',
//   },
// };

// export default function RootLayout({ children }: RootLayoutProps) {
//   return (
//     <html lang="en">
//       <body className="bg-[#e7ecf7]">
//         <div className="min-h-screen bg-[#e7ecf7]">
//           <AppHeader />
//           <div className="flex min-h-[calc(100vh-50px)]">
//             <Sidebar></Sidebar>
//             <main className="flex-1 overflow-x-auto">{children}</main>
//           </div>
//         </div>
//       </body>
//     </html>
//   );
// }

import type { ReactNode } from 'react';
>>>>>>> d828d3c (ui: hide scrollbar in DocumentPanel)
import './global.css';
import { Sidebar } from '../features/sidebar/Sidebar';

export const metadata = {
  title: 'FlowFile',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
<<<<<<< HEAD
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
=======
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
>>>>>>> d828d3c (ui: hide scrollbar in DocumentPanel)
      </body>
    </html>
  );
}
