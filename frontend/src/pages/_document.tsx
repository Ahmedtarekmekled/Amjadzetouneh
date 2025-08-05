import { Html, Head, Main, NextScript } from 'next/document';

export default function MyDocument() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#f59e0b" />
      </Head>
      <body className="font-body">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 