import Link from 'next/link';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>this is a group routes layout</h1>
      <ul className='flex gap-4'>
        <li>
          <Link href='/route-a'>route-a</Link>
        </li>
        <li>
          <Link href='/route-b'>route-b</Link>
        </li>
      </ul>
      <hr />
      {children}
    </div>
  );
}

export default Layout;
