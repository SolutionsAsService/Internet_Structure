import localFont from 'next/font/local';
import Link from 'next/link';
import './globals.css';

const archivo = localFont({
  src: './fonts/Archivo-wdth-wght.woff2',
  variable: '--font-archivo',
  weight: '100 900',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata = {
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  title: { default: 'Internet Structure: who holds the internet up', template: '%s · Internet Structure' },
  description:
    'An atlas of the organisations that hold the internet up, from chip foundries and subsea cables to exchanges, carriers, DNS and the clouds, plus the history that built them.',
  openGraph: { type: 'website', siteName: 'Internet Structure' },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2efe7' },
    { media: '(prefers-color-scheme: dark)', color: '#121110' },
  ],
};

const NAV = [
  ['/atlas', 'Atlas'],
  ['/strata', 'Strata'],
  ['/history', 'History'],
  ['/how-it-works', 'How it works'],
  ['/about', 'About'],
];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <header className="site-header">
          <Link href="/" className="wordmark" aria-label="Internet Structure, home">
            <span className="wordmark-bar" aria-hidden="true" />
            Internet<b>Structure</b>
          </Link>
          <nav aria-label="Sections" className="site-nav">
            {NAV.map(([href, label]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
          </nav>
        </header>
        <div id="main">{children}</div>
        <footer className="site-footer">
          <div>
            <strong>Internet Structure</strong> is an open dataset and atlas. Every figure on this site is computed from the
            JSON files in the repository at build time.
          </div>
          <nav aria-label="Footer">
            {NAV.map(([href, label]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
            <Link href="/organisations">All organisations</Link>
            <a href="https://github.com/SolutionsAsService/Internet_Structure">Source on GitHub</a>
          </nav>
        </footer>
      </body>
    </html>
  );
}
