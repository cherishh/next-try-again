function getPerson({ name }: { name: string }) {
  return {
    name,
    randomNumber: Math.random(),
  };
}

export default async function NormalPerson({ name }: { name: string }) {
  const person = await getPerson({ name });
  return (
    <div>
      {person.name} - {person.randomNumber}
    </div>
  );
}
