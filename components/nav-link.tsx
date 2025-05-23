'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function NavLink() {
  const pathname = usePathname();
  console.log(pathname, 'pathname');

  return (
    <nav>
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
      <Link
        className={`link ${pathname === '/this-route-does-not-exist' ? 'font-bold' : ''}`}
        href='/this-route-does-not-exist'
      >
        This Route Does Not Exist
      </Link>
    </nav>
  );
}
