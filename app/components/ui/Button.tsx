import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "amber" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center min-h-[44px] px-5 py-[13px] rounded-md border text-label " +
  "no-underline cursor-pointer transition-colors duration-150 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  // Tombol utama di latar terang: navy, hover navy-500. Di tema gelap token action menjadi amber.
  primary: "bg-action text-on-action border-transparent hover:bg-navy-500",
  // Tombol utama di atas navy: amber dengan teks navy-900. Hover amber-400 (satu langkah terang, panduan desain §7).
  amber: "bg-amber-500 text-on-accent border-transparent hover:bg-[var(--fawz-amber-400)]",
  secondary: "bg-transparent text-ink border-line-strong hover:bg-surface-sunken",
  // Di atas navy (konteks .theme-dark): outline terang, teks terang. Sama dengan secondary, dipertahankan untuk kejelasan.
  ghost: "bg-transparent text-ink border-line-strong hover:bg-surface-raised",
};

type Common = { variant?: ButtonVariant; className?: string; children: ReactNode };
type AsLink = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;
type AsButton = Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export default function Button(props: AsLink | AsButton) {
  const { variant = "primary", className = "", children } = props;
  const cls = `${base} ${variants[variant]} ${className}`.trim();

  if (props.href !== undefined) {
    const { href, variant: _v, className: _c, children: _ch, ...rest } = props;
    const internal = href.startsWith("/") && !href.startsWith("//");
    if (internal) {
      return (
        <Link href={href} className={cls} {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }

  const { variant: _v, className: _c, children: _ch, type = "button", ...rest } = props;
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
