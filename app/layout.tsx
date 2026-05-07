import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://nexvoid.id";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nexvoid — Solusi Software Custom untuk Bisnis Modern",
    template: "%s · Nexvoid",
  },
  description:
    "Nexvoid membangun mobile app, web app, ERP custom, dan integrasi AI dengan standar teknologi internasional. Bisnis lebih efisien dengan solusi software yang tepat.",
  keywords: [
    "software house Indonesia",
    "custom software development",
    "mobile app development",
    "web app development",
    "ERP custom",
    "UI UX design",
    "AI integration",
    "Nexvoid",
  ],
  authors: [{ name: "Nexvoid" }],
  creator: "Nexvoid",
  publisher: "Nexvoid",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: { "id-ID": "/", "en-US": "/en" },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "Nexvoid",
    title: "Nexvoid — Solusi Software Custom untuk Bisnis Modern",
    description:
      "Inovasi tanpa batas. Mobile, web, ERP, dan AI dirancang untuk efisiensi bisnis Anda.",
    images: [
      {
        url: "/nexvoid.png",
        width: 1200,
        height: 1200,
        alt: "Nexvoid",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexvoid — Solusi Software Custom",
    description:
      "Mobile, web, ERP, AI. Standar teknologi internasional untuk bisnis Anda.",
    images: ["/nexvoid.png"],
  },
  icons: {
    icon: "/nexvoid.png",
    shortcut: "/nexvoid.png",
    apple: "/nexvoid.png",
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#f5f1e8",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nexvoid",
  url: SITE_URL,
  logo: `${SITE_URL}/nexvoid.png`,
  description:
    "Software house yang membangun solusi mobile, web, ERP, dan AI untuk bisnis modern.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Asia Afrika No. 1",
    addressLocality: "Bandung",
    addressRegion: "Jawa Barat",
    addressCountry: "ID",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+62-22-4532324",
    contactType: "customer support",
    areaServed: "ID",
    availableLanguage: ["id", "en"],
  },
  sameAs: [],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Nexvoid",
  url: SITE_URL,
  inLanguage: "id-ID",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans bg-void-950 text-ink antialiased">
        {children}
        <Script
          id="ld-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Script
          id="ld-site"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
