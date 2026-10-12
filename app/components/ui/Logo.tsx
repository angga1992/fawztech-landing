// Logo dari berkas SVG handoff. Warna di dalam SVG tetap; file diganti sesuai latar.
// "auto": terang secara default, berganti ke versi on-dark saat <html data-theme="dark">.
// "dark": selalu versi on-dark (footer, latar navy).
export default function Logo({
  variant = "auto",
  height = 32,
  className = "",
  mark = false,
}: {
  variant?: "auto" | "dark";
  height?: number;
  className?: string;
  /** Hanya tanda F (untuk ruang sempit, panduan desain §2). */
  mark?: boolean;
}) {
  const width = mark ? height : Math.round((272.6 / 48) * height);
  const light = mark ? "/svg/fawz-tech-mark.svg" : "/svg/fawz-tech-logo-primary.svg";
  const dark = mark ? "/svg/fawz-tech-mark-on-dark.svg" : "/svg/fawz-tech-logo-primary-on-dark.svg";
  if (variant === "dark") {
    return (
      <img src={dark} alt="Fawz Tech" width={width} height={height} className={className} />
    );
  }
  return (
    <>
      <img src={light} alt="Fawz Tech" width={width} height={height} className={`logo-light ${className}`.trim()} />
      <img src={dark} alt="Fawz Tech" width={width} height={height} className={`logo-dark ${className}`.trim()} />
    </>
  );
}
