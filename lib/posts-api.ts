export async function getPost(id: string) {
  const post = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    cache: 'force-cache',
  }).then(res => res.json());
  return post;
}
