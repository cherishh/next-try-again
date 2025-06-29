'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/shared/mode-toggle';
import LoginBtn from './login-btn';

export function NavLink() {
  const pathname = usePathname();
  console.log(pathname, 'pathname');

  return (
    <nav className='flex-1 flex items-center justify-between'>
      <div className='flex-1'>
        <div className='flex items-center gap-1 mr-8'>
          <div className='w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>R</span>
          </div>
          <span className='font-bold text-lg'>Raphael AI</span>
        </div>
        <Link className={`link ${pathname === '/' ? 'font-bold' : ''}`} href='/'>
          Home
        </Link>{' '}
        <Link className={`link ${pathname === '/posts' ? 'font-bold' : ''}`} href='/posts'>
          Gallery
        </Link>{' '}
      </div>
      <div>
        <ThemeToggle /> <LoginBtn />
      </div>
    </nav>
  );
}
