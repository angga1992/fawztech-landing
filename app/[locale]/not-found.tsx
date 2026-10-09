import { headers } from "next/headers";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Button from "../components/ui/Button";
import Eyebrow from "../components/ui/Eyebrow";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, headerDictionary } from "@/lib/i18n/dictionary";
import { pathFor } from "@/lib/i18n/routes";

// not-found tidak menerima params; locale dibaca dari header x-locale yang dipasang middleware.
export default function NotFound() {
  const h = headers().get("x-locale");
  const locale: Locale = isLocale(h) ? h : "id";
  const t = getDictionary(locale);
  return (
    <>
      <Header t={headerDictionary(t)} locale={locale} routeKey="home" />
      <main id="utama" className="py-12 lg:py-16">
        <div className="mx-auto max-w-content px-4 md:px-8">
          <Eyebrow>404</Eyebrow>
          <h1 className="mt-2 text-display-lg-sm sm:text-display-lg">{t.notFound.h1}</h1>
          <p className="mt-3 text-body text-ink-muted">{t.notFound.text}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href={pathFor("id", "home")} variant={locale === "id" ? "primary" : "secondary"} hrefLang="id">
              {t.notFound.homeId}
            </Button>
            <Button href={pathFor("en", "home")} variant={locale === "en" ? "primary" : "secondary"} hrefLang="en">
              {t.notFound.homeEn}
            </Button>
          </div>
        </div>
      </main>
      <Footer t={t} locale={locale} />
    </>
  );
}
