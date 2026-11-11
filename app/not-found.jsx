import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="wrap">
      <header className="page-head">
        <p className="kicker">404</p>
        <h1>No route to host</h1>
        <p className="lede">That page is not in the atlas. Try <Link href="/organisations">every organisation, A to Z</Link>, or go <Link href="/">home</Link>.</p>
      </header>
    </main>
  );
}
