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
        <Link className={`link ${pathname === '/' ? 'font-bold' : ''}`} href='/'>
          Home
        </Link>{' '}
        <Link className={`link ${pathname === '/user' ? 'font-bold' : ''}`} href='/user'>
          User
        </Link>{' '}
        <Link className={`link ${pathname === '/posts' ? 'font-bold' : ''}`} href='/posts'>
          Posts
        </Link>{' '}
        <Link className={`link ${pathname === '/route-group' ? 'font-bold' : ''}`} href='/route-a'>
          Pathless Layout
        </Link>{' '}
        <Link className={`link ${pathname === '/deferred' ? 'font-bold' : ''}`} href='/deferred'>
          Deferred
        </Link>{' '}
        <Link className={`link ${pathname === '/llm' ? 'font-bold' : ''}`} href='/llm'>
          LLM
        </Link>{' '}
        <Link className={`link ${pathname === '/dashboard' ? 'font-bold' : ''}`} href='/dashboard'>
          Dashboard
        </Link>{' '}
        <Link
          className={`link ${pathname === '/this-route-does-not-exist' ? 'font-bold' : ''}`}
          href='/this-route-does-not-exist'
        >
          404
        </Link>
      </div>
      <div>
        <ThemeToggle /> <LoginBtn />
      </div>
    </nav>
  );
}
