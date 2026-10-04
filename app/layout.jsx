import './globals.css';

export const metadata = {
  title: 'Internet Structure Atlas',
  description: 'An interactive map of internet infrastructure and its connections.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
