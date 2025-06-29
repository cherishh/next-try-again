interface Other {
  name: string;
  msg: string;
}

function getOther({ name }: { name: string }): Promise<Other> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name,
        msg: 'hello world ' + Math.random(),
      });
    }, 2000);
  });
}

export default async function DeferredOther({ name }: { name: string }) {
  'use cache';

  const other: Other = await getOther({ name });
  return (
    <div>
      {other.name} - {other.msg}
    </div>
  );
}
