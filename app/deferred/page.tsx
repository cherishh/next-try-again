import { Suspense } from 'react';
import NormalPerson from './normal-person';
import DeferredPerson from './deferred-person';
import DeferredOther from './deferred-other';
import { Counter } from './counter';

export default function Deferred() {
  return (
    <div className='p-2'>
      <div data-testid='regular-person'>
        <NormalPerson name='John Doe' />
      </div>
      <Suspense fallback={<div>Loading person...</div>}>
        <div data-testid='deferred-person'>
          <DeferredPerson name='Xi Wang' />
        </div>
      </Suspense>
      <Suspense fallback={<div>Loading stuff...</div>}>
        <DeferredOther name='Xi Li' />
      </Suspense>
      <Counter />
    </div>
  );
}

export const dynamic = 'force-dynamic';
