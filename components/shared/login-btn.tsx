'use client';

import { LogInIcon, LogOutIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { signIn, signOut, getSession } from '@/lib/auth-client';
import { User } from 'better-auth';
import { useRouter } from 'next/navigation';

export default function LoginBtn() {
  const router = useRouter();
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      console.log(session, 'session');
      setUser(session?.data?.user);
    };
    fetchUser();
  }, []);

  const handleLogin = async () => {
    await signIn.social({
      provider: 'github',
      callbackURL: '/dashboard',
    });
  };

  if (!user) {
    return (
      <Button variant='outline' size='icon' type='button' onClick={handleLogin}>
        <LogInIcon className='size-4 scale-100' />
        <span className='sr-only'>login</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={async () => {
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push('/'); // redirect to login page
              setUser(undefined);
            },
          },
        });
      }}
      type='button'
      size='icon'
      variant='destructive'
    >
      <LogOutIcon className='size-4 scale-100' />
      <span className='sr-only'>logout</span>
    </Button>
  );
}
