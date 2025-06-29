import { MDXRemote } from 'next-mdx-remote/rsc';

interface MDXContentProps {
  content: string;
}

const components = {
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className='text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{children}</h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className='text-2xl font-semibold mb-3 mt-6 text-gray-800 dark:text-gray-200'>{children}</h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className='text-xl font-medium mb-2 mt-4 text-gray-700 dark:text-gray-300'>{children}</h3>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className='mb-4 text-gray-600 dark:text-gray-400 leading-relaxed'>{children}</p>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className='list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400'>{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className='list-decimal list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400'>{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => <li className='mb-1'>{children}</li>,
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className='border-l-4 border-blue-500 pl-4 my-4 italic text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 py-2 rounded-r'>
      {children}
    </blockquote>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className='font-semibold text-gray-800 dark:text-gray-200'>{children}</strong>
  ),
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <a
      href={href}
      className='text-blue-600 dark:text-blue-400 hover:underline'
      target='_blank'
      rel='noopener noreferrer'
    >
      {children}
    </a>
  ),
  code: ({ children }: { children: React.ReactNode }) => (
    <code className='bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-red-600 dark:text-red-400'>
      {children}
    </code>
  ),
  hr: () => <hr className='my-8 border-gray-300 dark:border-gray-600' />,
};

export default function MDXContent({ content }: MDXContentProps) {
  return (
    <div className='prose prose-gray max-w-none dark:prose-invert'>
      <MDXRemote source={content} components={components} />
    </div>
  );
}
