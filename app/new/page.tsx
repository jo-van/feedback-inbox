import NewRequestForm from '@/components/NewRequestForm';

export default function NewRequest() {
  return (
    <main>
      <header className="top">
        <h1>Suggest a change</h1>
        <p>This app is a suggestion box for itself: tell it what to change, and a factory builds it. Small, specific ideas are most likely to get built live today.</p>
        <p className="hint">Try: a button, a color, a label, a sort order, a message. Something you&apos;d notice on your phone.</p>
      </header>
      <NewRequestForm />
    </main>
  );
}
