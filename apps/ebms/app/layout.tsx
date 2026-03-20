import type { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import './global.css';
import { AppChrome } from '../features/layout/AppChrome';

export const metadata = {
  title: 'FlowFile',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" data-scroll-behavior="smooth">
        <body className="min-h-screen text-[#f5f7ff] antialiased">
          <AppChrome>{children}</AppChrome>
        </body>
      </html>
    </ClerkProvider>
  );
}
