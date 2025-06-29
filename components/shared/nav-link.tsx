'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/shared/mode-toggle';
import LoginBtn from './login-btn';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function NavLink() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className='w-full max-w-7xl mx-auto'>
      <nav className='flex items-center justify-between h-12 cursor-pointer'>
        {/* Left: Logo + Brand */}
        <div className='flex items-center gap-2' onClick={() => router.push('/')}>
          <div className='w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>B</span>
          </div>
          <span className='text-sm text-muted-foreground'>Blur Background AI</span>
        </div>

        {/* Center: Navigation Links */}
        <div className='flex-1 flex items-center justify-center'>
          <div className='flex items-center gap-1'>
            <Link href='/'>
              <Button variant='link' size='sm' className='text-sm'>
                Home
              </Button>
            </Link>
            <Link href='/posts'>
              <Button variant='link' size='sm' className='text-sm'>
                Posts
              </Button>
            </Link>
          </div>
        </div>

        {/* Right: Login/Upgrade/Theme */}
        <div className='flex items-center gap-2'>
          <Link href='/login'>
            <Button variant='outline' size='sm'>
              Login
            </Button>
          </Link>
          <Button
            size='sm'
            className='bg-purple-600 hover:bg-purple-700'
            onClick={() => {
              toast('Coming Soon', {
                description: 'Stay tuned for updates!',
              });
            }}
          >
            Upgrade
          </Button>
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
