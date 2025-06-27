import { getUserById } from '@/lib/db/queries/select';

async function User() {
  const user = await getUserById(1);
  return (
    <div className='p-2'>
      <h1>User</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

export default User;
