import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PrivacyPage from "../../components/PrivacyPage";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";

// English version: only at /en/privacy. /privacy (Indonesian prefix) → 404.
export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return params.locale === "en" ? pageMetadata("en", "privacy") : {};
}

export default function PrivacyPageEn({ params }: { params: { locale: string } }) {
  if (params.locale !== "en") notFound();
  return <PrivacyPage t={getDictionary("en")} locale="en" />;
}
