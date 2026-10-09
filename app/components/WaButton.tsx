"use client";

import Button, { type ButtonVariant } from "./ui/Button";

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string> }) => void;
  }
}

export default function WaButton({
  href,
  label,
  variant = "ghost",
  className = "",
}: {
  href: string;
  label: string;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <Button
      href={href}
      variant={variant}
      target="_blank"
      rel="noopener"
      className={className}
      onClick={() => window.plausible?.("whatsapp_click")}
    >
      {label}
    </Button>
  );
}
