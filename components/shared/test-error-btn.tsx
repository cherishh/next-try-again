'use client';

import { Button } from '@/components/ui/button';

export const TestErrorButton = () => {
  return (
    <Button
      onClick={() => {
        throw new Error('test error');
      }}
    >
      test error
    </Button>
  );
};
