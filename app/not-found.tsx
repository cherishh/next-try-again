import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] text-center'>
      <h2 className='text-2xl font-bold mb-4'>404</h2>
      <p className='text-muted-foreground mb-6'>Page not found</p>
      <Link
        href='/'
        className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
      >
        Back to home
      </Link>
    </div>
  );
}
