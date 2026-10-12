import type { Metadata } from "next";
import About from "../components/About";
import Catalogue from "../components/Catalogue";
import Contact from "../components/Contact";
import Engage from "../components/Engage";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Mission from "../components/Mission";
import Portfolio from "../components/Portfolio";
import Problem from "../components/Problem";
import Process from "../components/Process";
import Services from "../components/Services";
import Values from "../components/Values";
import Vision from "../components/Vision";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, headerDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return isLocale(params.locale) ? pageMetadata(params.locale, "home") : {};
}

// Urutan seksi mengikuti alur company profile final (LANDING-BRIEF §2, Oktober 2026).
// Testimoni dan Tim sengaja tidak ada (slide-nya dihapus dari profile final).
export default function Page({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "id") as Locale;
  const t = getDictionary(locale);
  return (
    <>
      <Header t={headerDictionary(t)} locale={locale} routeKey="home" />
      <main id="utama">
        <Hero t={t} />
        <About t={t} />
        <Problem t={t} />
        <Vision t={t} />
        <Mission t={t} />
        <Values t={t} />
        <Services t={t} />
        <Process t={t} />
        <Catalogue t={t} />
        {/* Dirender hanya untuk klien yang sudah mengizinkan (NEXT_PUBLIC_PORTFOLIO_CLIENTS). */}
        <Portfolio t={t} />
        <Engage t={t} />
        <Contact t={t} locale={locale} />
      </main>
      <Footer t={t} locale={locale} />
    </>
  );
}
