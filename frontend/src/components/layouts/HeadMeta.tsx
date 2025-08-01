import Head from "next/head";
import { useEffect, useState } from "react";
import { Settings } from "@/services/settingsService";

interface HeadMetaProps {
  settings: Settings | null;
}

const HeadMeta: React.FC<HeadMetaProps> = ({ settings }) => {
  const [faviconUrl, setFaviconUrl] = useState("/favicon.ico");
  const [faviconType, setFaviconType] = useState("image/x-icon");

  useEffect(() => {
    if (settings?.branding.favicon) {
      const timestamp = new Date().getTime();
      const url = `${settings.branding.favicon}?v=${timestamp}`;
      setFaviconUrl(url);

      // Force browser to reload favicon
      const link = (document.querySelector("link[rel*='icon']") ||
        document.createElement("link")) as HTMLLinkElement;
      link.type = faviconType;
      link.rel = "shortcut icon";
      link.href = url;
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  }, [settings?.branding.favicon, faviconType]);

  return (
    <Head>
      <link rel="icon" type={faviconType} href={faviconUrl} sizes="any" />
      <link rel="shortcut icon" type={faviconType} href={faviconUrl} />
      {/* Add apple touch icon for iOS devices */}
      <link rel="apple-touch-icon" type={faviconType} href={faviconUrl} />
      {/* Add SVG favicon support */}
      {faviconType === "image/svg+xml" && (
        <link rel="mask-icon" href={faviconUrl} color="#000000" />
      )}
      {/* Add manifest icon for PWA */}
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
};

export default HeadMeta;
