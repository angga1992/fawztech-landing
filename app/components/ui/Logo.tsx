// Logo dari berkas SVG handoff. Warna di dalam SVG tetap; file diganti sesuai latar.
// "auto": terang secara default, berganti ke versi on-dark saat <html data-theme="dark">.
// "dark": selalu versi on-dark (footer, latar navy).
export default function Logo({
  variant = "auto",
  height = 32,
  className = "",
}: {
  variant?: "auto" | "dark";
  height?: number;
  className?: string;
}) {
  const width = Math.round((272.6 / 48) * height);
  if (variant === "dark") {
    return (
      <img
        src="/svg/fawz-tech-logo-primary-on-dark.svg"
        alt="Fawz Tech"
        width={width}
        height={height}
        className={className}
      />
    );
  }
  return (
    <>
      <img
        src="/svg/fawz-tech-logo-primary.svg"
        alt="Fawz Tech"
        width={width}
        height={height}
        className={`logo-light ${className}`.trim()}
      />
      <img
        src="/svg/fawz-tech-logo-primary-on-dark.svg"
        alt="Fawz Tech"
        width={width}
        height={height}
        className={`logo-dark ${className}`.trim()}
      />
    </>
  );
}
