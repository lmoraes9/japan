import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Noto_Serif_JP } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoSerifJp = Noto_Serif_JP({
  variable: '--font-noto-serif-jp',
  weight: ['400', '600'],
  subsets: ['latin'],
  preload: false,
});

export const metadata: Metadata = {
  title: 'Japão 2026',
  description: 'Roteiro de viagem · 18 nov – 3 dez 2026 · Priscila & Leonardo',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Japão 2026',
  },
  icons: {
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f5f2' },
    { media: '(prefers-color-scheme: dark)', color: '#101014' },
  ],
};

const themeScript = `
try {
  var raw = localStorage.getItem('japao2026:settings');
  var theme = raw ? (JSON.parse(raw).state || {}).theme : 'auto';
  var dark = theme === 'dark' || (theme !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  if (dark) document.documentElement.classList.add('dark');
} catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSerifJp.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
