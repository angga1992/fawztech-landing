import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { pathFor } from "@/lib/i18n/routes";
import { messagesFor } from "@/lib/leads/messages";
import { site } from "@/lib/site";
import { buildWaLink } from "@/lib/wa";
import Eyebrow from "./ui/Eyebrow";
import LeadForm from "./LeadForm";
import WaButton from "./WaButton";

export default function Contact({ t, locale }: { t: Dictionary; locale: Locale }) {
  const c = t.contact;
  const wa = buildWaLink(site.waNumber, c.whatsappPrefill);
  return (
    <section id="kontak" className="theme-dark bg-navy-900 text-ink py-14 lg:py-[72px]">
      <div className="mx-auto max-w-content px-4 md:px-8 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16 items-start">
        <div>
          <Eyebrow tone="dark">{c.eyebrow}</Eyebrow>
          <h2 className="mt-2 text-display-lg-sm sm:text-display-lg">{c.h2}</h2>
          <p className="mt-3 text-headline text-ink-muted">{c.sub}</p>
          {wa ? (
            <p className="mt-6">
              <WaButton href={wa} label={c.whatsappLabel} />
            </p>
          ) : null}
        </div>
        <LeadForm
          t={c.form}
          messages={messagesFor(locale)}
          locale={locale}
          privacyHref={pathFor(locale, "privacy")}
          whatsappHref={wa}
        />
      </div>
    </section>
  );
}
