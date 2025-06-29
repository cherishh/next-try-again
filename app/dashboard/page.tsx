'use client';

import { useSession } from '@/lib/auth-client';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
export default function Dashboard() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  if (!user) {
    toast.error('Please login to access this page');
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <Button onClick={() => redirect('/')}>home</Button>
      </div>
    );
  }

  return (
    <div className='m-4'>
      <h2>Dashboard</h2>
    </div>
  );
}
