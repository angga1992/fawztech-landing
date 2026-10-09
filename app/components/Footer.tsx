import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { pathFor } from "@/lib/i18n/routes";
import { instagramUrl, isPlaceholder, site } from "@/lib/site";
import { buildWaLink } from "@/lib/wa";
import Logo from "./ui/Logo";

export default function Footer({ t, locale }: { t: Dictionary; locale: Locale }) {
  const year = new Date().getFullYear();
  const link = "text-link underline underline-offset-2 hover:text-ink";
  const phoneHref = site.waNumber ? buildWaLink(site.waNumber, "") : null;

  return (
    <footer className="theme-dark bg-navy-900 text-ink-muted border-t border-line py-8 text-body-sm">
      <div className="mx-auto max-w-content px-4 md:px-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Logo variant="dark" height={28} />
        <span>{site.address}</span>

        {isPlaceholder(site.email) ? (
          <span>{site.email}</span>
        ) : (
          <a href={`mailto:${site.email}`} className={link}>
            {site.email}
          </a>
        )}

        {phoneHref ? (
          <a href={phoneHref} className={link} target="_blank" rel="noopener">
            {site.phone}
          </a>
        ) : (
          <span>{site.phone}</span>
        )}

        {isPlaceholder(site.instagram) ? (
          <span>{site.instagram}</span>
        ) : (
          <a href={instagramUrl(site.instagram)} className={link} target="_blank" rel="noopener">
            {site.instagram}
          </a>
        )}

        {isPlaceholder(site.linkedin) ? (
          <span>{site.linkedin}</span>
        ) : (
          <a href={site.linkedin} className={link} target="_blank" rel="noopener">
            LinkedIn
          </a>
        )}

        <a href={pathFor(locale, "privacy")} className={link}>
          {t.footer.privacyLabel}
        </a>
        <span>
          © {year} {t.footer.copyright}
        </span>
      </div>
    </footer>
  );
}
