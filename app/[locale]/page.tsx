import type { Metadata } from "next";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Problem from "../components/Problem";
import Process from "../components/Process";
import Services from "../components/Services";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, headerDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return isLocale(params.locale) ? pageMetadata(params.locale, "home") : {};
}

export default function Page({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "id") as Locale;
  const t = getDictionary(locale);
  return (
    <>
      <Header t={headerDictionary(t)} locale={locale} routeKey="home" />
      <main id="utama">
        <Hero t={t} />
        <Problem t={t} />
        <Services t={t} />
        <Process t={t} />
        {/* #cerita (portofolio dan testimoni): tambahkan di sini setelah ada data klien nyata dan izin. */}
        <Contact t={t} locale={locale} />
      </main>
      <Footer t={t} locale={locale} />
    </>
  );
}
