interface Person {
  name: string;
  randomNumber: number;
}

function getPerson({ name }: { name: string }): Promise<Person> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name,
        randomNumber: Math.random(),
      });
    }, 1000);
  });
}

export default async function DeferredPerson({ name }: { name: string }) {
  const person: Person = await getPerson({ name });
  return (
    <div>
      {person.name} - {person.randomNumber}
    </div>
  );
}
