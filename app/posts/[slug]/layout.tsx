export default function PostLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>im a post layout</h1>
      {children}
    </div>
  );
}
