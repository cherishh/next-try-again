import { getAllPosts } from '@/lib/posts-api';
import Link from 'next/link';

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <header className='mb-8'>
        <h1 className='text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4'>Blog Posts</h1>
        <p className='text-lg text-gray-600 dark:text-gray-400'>Our experiences and thoughts</p>
      </header>

      {posts.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-gray-500 dark:text-gray-400'>No posts.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {posts.map(post => (
            <article
              key={post.slug}
              className='bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden'
            >
              {post.coverImage && (
                <div className='w-full h-48 bg-gray-200 dark:bg-gray-700'>
                  {/* 这里可以添加图片，目前只显示占位符 */}
                  <div className='w-full h-full flex items-center justify-center text-gray-400'>
                    📝 {post.type === 'article' ? 'Article' : post.type}
                  </div>
                </div>
              )}

              <div className='p-6'>
                <div className='flex items-center mb-2'>
                  <span className='px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full'>
                    {post.type === 'article' ? 'Article' : post.type}
                  </span>
                  {post.category && (
                    <span className='ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full'>
                      {post.category}
                    </span>
                  )}
                </div>

                <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2'>
                  <Link
                    href={`/posts/${post.slug}`}
                    className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                  >
                    {post.title}
                  </Link>
                </h2>

                <p className='text-gray-600 dark:text-gray-400 mb-4 line-clamp-3'>{post.description}</p>

                <div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
                  <div className='flex items-center space-x-4'>
                    {post.readTime && <span>⏱️ {post.readTime}</span>}
                    <span>📅 {post.publishDate}</span>
                  </div>
                </div>

                {post.author && (
                  <div className='mt-3 text-sm text-gray-600 dark:text-gray-400'>Author：{post.author}</div>
                )}

                {post.tags && post.tags.length > 0 && (
                  <div className='mt-3 flex flex-wrap gap-1'>
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className='px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded'
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className='px-2 py-1 text-gray-400 text-xs'>+{post.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
