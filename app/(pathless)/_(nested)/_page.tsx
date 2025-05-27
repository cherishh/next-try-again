function Page() {
  return (
    <div>
      this is page
      <div>
        代码中需要注销掉 route，否则 vercel 上 build会失败。
        <br />
        但是 route 不能注销，否则会报错。
      </div>
    </div>
  );
}

export default Page;
