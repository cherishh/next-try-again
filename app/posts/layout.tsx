import Link from 'next/link';

async function getPosts() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts')
    .then(res => res.json())
    .then(data => data);
  return posts;
}

export default async function PostLayout({ children }: { children: React.ReactNode }) {
  const posts = await getPosts();
  return (
    <>
      <div className='flex gap-2'>
        <ul className='list-disc pl-4'>
          {[...posts, { id: 'i-do-not-exist', title: 'Non-existent Post' }].map(post => {
            return (
              <li key={post.id} className='whitespace-nowrap'>
                <Link href={`/posts/${post.id}`} className='block py-1 text-blue-800 hover:text-blue-600'>
                  <div>{post.title.substring(0, 20)}</div>
                </Link>
              </li>
            );
          })}
        </ul>
        <hr />
        {children}
      </div>
    </>
  );
}
