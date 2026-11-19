import Board from '@/components/Board';

export default function Home() {
  return (
    <>
      <main>
        <header className="top">
          <h1>📥 Feedback Inbox</h1>
          <a className="btn pinned" href="/new">Suggest an idea</a>
          <p>Tell us what to change about this app. Upvote the ideas you like. An AI software factory builds the top ones live.</p>
        </header>
        <Board />
      </main>
      <footer className="site-footer">Built live at Louisville Startup Week</footer>
    </>
  );
}
