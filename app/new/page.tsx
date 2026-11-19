import NewRequestForm from '@/components/NewRequestForm';

export default function NewRequest() {
  return (
    <main>
      <header className="top">
        <h1>Suggest a change</h1>
        <p>Small, specific ideas are most likely to get built live today.</p>
      </header>
      <NewRequestForm />
    </main>
  );
}
