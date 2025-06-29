'use client';

import { LogInIcon, LogOutIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { signIn, signOut, useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function LoginBtn() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const handleLogin = async () => {
    await signIn.social({
      provider: 'github',
      callbackURL: '/',
    });
  };

  if (true) {
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
