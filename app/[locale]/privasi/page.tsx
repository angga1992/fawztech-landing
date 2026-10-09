import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PrivacyPage from "../../components/PrivacyPage";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";

// Versi Indonesia: hanya di /privasi. /en/privasi → 404 (versi Inggris ada di /en/privacy).
export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return params.locale === "id" ? pageMetadata("id", "privacy") : {};
}

export default function PrivasiPage({ params }: { params: { locale: string } }) {
  if (params.locale !== "id") notFound();
  return <PrivacyPage t={getDictionary("id")} locale="id" />;
}
