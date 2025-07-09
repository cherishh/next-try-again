'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/shared/mode-toggle';
import LoginBtn from './login-btn';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Icon from '@/public/android-chrome-192x192.png';
import Image from 'next/image';

export function NavLink() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className='w-full max-w-7xl mx-auto'>
      <nav className='flex items-center justify-between h-12 relative'>
        {/* Left: Logo + Brand */}
        <div className='flex items-center gap-2 cursor-pointer' onClick={() => router.push('/')}>
          <Image src={Icon} alt='Brand Icon' width={26} height={26} className='rounded-md' />
          <span className='text-sm text-muted-foreground hidden sm:block'>Blur Background AI</span>
          <span className='text-sm text-muted-foreground sm:hidden'>Blur Background AI</span>
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className='hidden md:flex flex-1 items-center justify-center'>
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

        {/* Desktop Right Side - Hidden on mobile */}
        <div className='hidden md:flex items-center gap-2'>
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
          <LoginBtn />
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button - Only visible on mobile */}
        <div className='md:hidden'>
          <Button variant='ghost' size='sm' onClick={toggleMobileMenu} className='p-2' aria-label='Toggle mobile menu'>
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu - Only visible when open */}
      {isMobileMenuOpen && (
        <div className='md:hidden absolute top-12 left-0 right-0 bg-background border border-border rounded-md shadow-lg z-50 mx-4 mt-2'>
          <div className='flex flex-col p-4 gap-2'>
            {/* Navigation Links */}
            <Link href='/' onClick={closeMobileMenu}>
              <Button variant='ghost' size='sm' className='w-full justify-start text-sm'>
                Home
              </Button>
            </Link>
            <Link href='/posts' onClick={closeMobileMenu}>
              <Button variant='ghost' size='sm' className='w-full justify-start text-sm'>
                Posts
              </Button>
            </Link>

            {/* Divider */}
            <div className='border-t border-border my-2'></div>

            {/* Action Buttons - In a row with normal width */}
            <div className='flex items-center gap-2'>
              <Button
                size='sm'
                className='bg-purple-600 hover:bg-purple-700'
                onClick={() => {
                  closeMobileMenu();
                  toast('Coming Soon', {
                    description: 'Stay tuned for updates!',
                  });
                }}
              >
                Upgrade
              </Button>

              <LoginBtn />

              <ThemeToggle />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && <div className='md:hidden fixed inset-0 bg-black/20 z-40' onClick={closeMobileMenu} />}
    </div>
  );
}
