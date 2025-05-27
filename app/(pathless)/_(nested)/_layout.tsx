function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='mt-2'>
      <h2>this nested layout cant not show</h2>
      <div>{children}</div>
    </div>
  );
}

export default Layout;
