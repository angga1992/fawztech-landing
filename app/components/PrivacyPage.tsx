import { Fragment } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Eyebrow from "./ui/Eyebrow";
import type { Locale } from "@/lib/i18n/config";
import { fill, headerDictionary, type Dictionary } from "@/lib/i18n/dictionary";
import { formatDate } from "@/lib/i18n/format";
import { LEAD_RETENTION_MONTHS, PRIVACY_POLICY_VERSION } from "@/lib/privacy";
import { isPlaceholder, site } from "@/lib/site";

// CATATAN: teks kebijakan (content/id.ts dan content/en.ts) adalah kerangka dan BELUM ditinjau penasihat hukum.
// Tinjau sebelum tayang publik, lalu naikkan PRIVACY_POLICY_VERSION di lib/privacy.ts.

const h2 = "mt-10 text-display-md";
const pCls = "mt-3 text-body text-ink-muted";
const ulCls = "mt-3 list-disc pl-5 text-body text-ink-muted space-y-1";

function Paragraph({ text }: { text: string }) {
  const filled = fill(text, { name: site.name, address: site.address, months: LEAD_RETENTION_MONTHS });
  const parts = filled.split("{email}");
  return (
    <p className={pCls}>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 ? (
            isPlaceholder(site.email) ? (
              <span>{site.email}</span>
            ) : (
              <a href={`mailto:${site.email}`} className="text-link underline underline-offset-2">
                {site.email}
              </a>
            )
          ) : null}
        </Fragment>
      ))}
    </p>
  );
}

export default function PrivacyPage({ t, locale }: { t: Dictionary; locale: Locale }) {
  const p = t.privacy;
  return (
    <>
      <Header t={headerDictionary(t)} locale={locale} routeKey="privacy" />
      <main id="utama" className="py-12 lg:py-16">
        <div className="mx-auto max-w-[760px] px-4 md:px-8">
          <Eyebrow>{p.eyebrow}</Eyebrow>
          <h1 className="mt-2 text-display-lg-sm sm:text-display-lg">{p.h1}</h1>
          <p className={pCls}>{fill(p.version, { date: formatDate(PRIVACY_POLICY_VERSION, locale) })}</p>
          {p.sections.map((s) => (
            <Fragment key={s.h2}>
              <h2 className={h2}>{s.h2}</h2>
              {s.blocks.map((b, i) =>
                "ul" in b ? (
                  <ul key={i} className={ulCls}>
                    {b.ul.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <Paragraph key={i} text={b.p} />
                )
              )}
            </Fragment>
          ))}
        </div>
      </main>
      <Footer t={t} locale={locale} />
    </>
  );
}
