async function User({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;
  return (
    <div className='p-2'>
      <pre>USER ID: {id}</pre>
    </div>
  );
}

export default User;
