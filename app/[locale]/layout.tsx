import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "../globals.css";
import colors from "@/public/brand/colors.json";
import { LOCALES, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { absoluteUrl, instagramUrl, isPlaceholder, placeholderKeys, site } from "@/lib/site";

const missing = placeholderKeys();
const g = globalThis as { __fawzWarned?: boolean };
if (missing.length > 0 && !g.__fawzWarned) {
  g.__fawzWarned = true;
  console.warn(
    `[fawz] Nilai berikut masih placeholder: ${missing.join(", ")}. Isi lewat .env.local (lihat .env.example).`
  );
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

// Metadata dasar; title/description/canonical/OG per halaman ada di lib/i18n/metadata.ts.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Fawz Tech", template: "%s | Fawz Tech" },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: colors.palette["navy-700"],
  width: "device-width",
  initialScale: 1,
};

function orgJsonLd(locale: "id" | "en") {
  const t = getDictionary(locale);
  const sameAs: string[] = [];
  if (!isPlaceholder(site.instagram)) sameAs.push(instagramUrl(site.instagram));
  if (!isPlaceholder(site.linkedin)) sameAs.push(site.linkedin);
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    description: t.meta.orgDescription,
    url: site.url,
    logo: absoluteUrl("/svg/fawz-tech-logo-primary.svg"),
    inLanguage: locale,
    address: { "@type": "PostalAddress", streetAddress: site.address, addressCountry: "ID" },
  };
  if (!isPlaceholder(site.email)) ld.email = site.email;
  if (site.waNumber) ld.telephone = `+${site.waNumber}`;
  if (sameAs.length) ld.sameAs = sameAs;
  return ld;
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Jangan melempar notFound() di sini: saat Next merender pohon not-found, layout dipanggil tanpa params.
  // Locale tak dikenal sudah dicegat middleware (rewrite ke /id/… → catch-all → 404).
  const locale = isLocale(params.locale) ? params.locale : "id";
  const t = getDictionary(locale);
  return (
    <html lang={locale}>
      <head>
        {/* Hanya Plus Jakarta Sans 400 dan 800 yang di-preload (brief §7). Berat lain dan JetBrains Mono dimuat saat dipakai. */}
        <link rel="preload" href="/fonts/plus-jakarta-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/plus-jakarta-sans-latin-800-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <a className="skip" href="#utama">
          {t.skipLink}
        </a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd(locale)) }} />
        {site.plausibleDomain ? (
          <Script defer data-domain={site.plausibleDomain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
        ) : null}
      </body>
    </html>
  );
}
