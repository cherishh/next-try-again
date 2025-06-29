import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { NavLink } from '@/components/shared/nav-link';
import { Toaster } from '@/components/ui/sonner';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Raphael AI - Free Unlimited AI Image Generator',
  description: 'Create stunning AI-generated images in seconds with our free unlimited AI image generator powered by FLUX. No registration required.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='h-full' suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' ||
                      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className='pl-2 pr-2'>
          <div className='p-2 flex gap-2 text-lg'>
            <NavLink />
          </div>
          <hr />
        </div>

        <div className='p-2'>{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
