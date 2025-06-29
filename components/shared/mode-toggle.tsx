'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 确保组件挂载后检查当前主题状态
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    checkTheme();

    // 监听主题变化
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  function toggleTheme() {
    if (
      document.documentElement.classList.contains('dark') ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  }

  return (
    <Button variant='outline' size='icon' type='button' onClick={toggleTheme}>
      <SunIcon className='size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
      <MoonIcon className='absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
