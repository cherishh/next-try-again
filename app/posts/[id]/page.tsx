import Link from 'next/link';

async function getPost(id: string) {
  const post = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then(res => res.json());
  return post;
}

export default async function PostComponent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  return (
    <div className='space-y-2'>
      <h4 className='text-xl font-bold underline'>{post.title}</h4>
      <div className='text-sm'>{post.body}</div>
      <Link href={`/posts/${post.id}/deep`} className='block py-1 text-blue-800 hover:text-blue-600'>
        Deep View
      </Link>
    </div>
  );
}
