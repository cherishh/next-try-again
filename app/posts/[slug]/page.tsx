import { getPost } from '@/lib/posts-api';
import { notFound } from 'next/navigation';
import MDXContent from '@/components/shared/mdx-content';

export default async function PostComponent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className='max-w-4xl mx-auto px-4 py-8'>
      {/* 文章头部信息 */}
      <header className='mb-8'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex-1'>
            <h1 className='text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2'>{post.title}</h1>
            <p className='text-lg text-gray-600 dark:text-gray-400 mb-4'>{post.description}</p>
          </div>
        </div>

        {/* 文章元数据 */}
        <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {post.type && (
              <div>
                <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>类型</span>
                <p className='text-gray-900 dark:text-gray-100 capitalize'>
                  {post.type === 'article' ? '文章' : post.type}
                </p>
              </div>
            )}
            {post.readTime && (
              <div>
                <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>阅读时长</span>
                <p className='text-gray-900 dark:text-gray-100'>{post.readTime}</p>
              </div>
            )}
            {post.author && (
              <div>
                <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>作者</span>
                <p className='text-gray-900 dark:text-gray-100'>{post.author}</p>
              </div>
            )}
            {post.publishDate && (
              <div>
                <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>发布日期</span>
                <p className='text-gray-900 dark:text-gray-100'>{post.publishDate}</p>
              </div>
            )}
          </div>

          {post.category && (
            <div className='mt-4'>
              <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>分类</span>
              <p className='text-gray-900 dark:text-gray-100'>{post.category}</p>
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className='mt-4'>
              <span className='text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2'>标签</span>
              <div className='flex flex-wrap gap-2'>
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className='px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* MDX 内容 */}
      <div className='prose prose-lg max-w-none dark:prose-invert'>
        <MDXContent content={post.content} />
      </div>
    </article>
  );
}
