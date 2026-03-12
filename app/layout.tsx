import type { Metadata } from 'next';
import { Outfit, Space_Grotesk } from 'next/font/google';
import './globals.css';
import QueryProvider from '../providers/QueryProvider';
import AuthProvider from '../providers/AuthProvider';
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Obliq CRM',
  description: 'Obliq CRM dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${spaceGrotesk.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
