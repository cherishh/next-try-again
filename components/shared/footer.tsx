'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export default function Footer() {
  return (
    <footer className='bg-card/30 border-t'>
      <div className='max-w-6xl mx-auto px-4 py-12'>
        <div className='grid md:grid-cols-4 gap-8'>
          {/* Brand Section */}
          <div className='md:col-span-2'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center'>
                <span className='text-white font-bold text-lg'>B</span>
              </div>
              <span className='font-bold text-xl'>Blur Background AI</span>
            </div>
            <p className='text-muted-foreground mb-4 max-w-md'>
              Blur Background AI: Make beautiful blurred backgrounds for free. No registration, no limits.
            </p>
            <div className='text-sm text-muted-foreground'>© 2025 • Blur Background AI All rights reserved.</div>
          </div>

          {/* About Links */}
          <div>
            <h3 className='font-semibold mb-4'>About</h3>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>
                <Button variant='link' size='sm' className='hover:text-foreground transition-colors'>
                  <Link href='/posts' className='hover:text-foreground transition-colors'>
                    blog
                  </Link>
                </Button>
              </li>
              <li>
                <Link href='/pricing' className='hover:text-foreground transition-colors'>
                  <Button variant='link' size='sm' className='hover:text-foreground transition-colors'>
                    Pricing
                  </Button>
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools Links */}
          <div>
            <h3 className='font-semibold mb-4'>Tools</h3>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>
                <Button
                  onClick={() => {
                    toast('coming soon');
                  }}
                  variant='link'
                  size='sm'
                  className='hover:text-foreground transition-colors'
                >
                  Expand Image
                </Button>
              </li>
              <li>
                <Button
                  onClick={() => {
                    toast('coming soon');
                  }}
                  variant='link'
                  size='sm'
                  className='hover:text-foreground transition-colors'
                >
                  Face Swap
                </Button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-border mt-8 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='flex gap-6 text-sm text-muted-foreground'>
              <Link href='/privacy' className='hover:text-foreground transition-colors'>
                Privacy Policy
              </Link>
              <Link href='/tos' className='hover:text-foreground transition-colors'>
                Terms of Service
              </Link>
            </div>

            <div className='text-sm text-muted-foreground'>
              Made with ❤️ by{' '}
              <Link href='https://Tuxi.dev' className='hover:text-foreground transition-colors'>
                Tuxi.dev
              </Link>{' '}
              and AI
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
