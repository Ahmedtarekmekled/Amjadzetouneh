import { Html, Head, Main, NextScript } from 'next/document';
import { FULL_IMAGE_URLS } from '@/config/constants';

export default function MyDocument() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href={FULL_IMAGE_URLS.FAVICON_ICO} />
        <link rel="manifest" href={`${FULL_IMAGE_URLS.BASE_URL}/manifest.json`} />
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