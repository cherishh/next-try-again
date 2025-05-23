import Link from 'next/link';

async function getPost(id: string) {
  const post = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then(res => res.json());
  return post;
}

export default async function PostDeepComponent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  return (
    <div className='p-2 space-y-2'>
      <Link href='/posts' className='block py-1 text-blue-800 hover:text-blue-600'>
        ← All Posts
      </Link>
      <h4 className='text-xl font-bold underline'>{post.title}</h4>
      <div className='text-sm'>{post.body}</div>
    </div>
  );
}
