const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Verifikasi token Cloudflare Turnstile.
 * Bila TURNSTILE_SECRET_KEY kosong, verifikasi dilewati (dev/staging) dan mengembalikan true.
 */
export async function verifyTurnstile(
  token: string,
  ip: string,
  opts: { secret?: string; fetchImpl?: typeof fetch } = {}
): Promise<boolean> {
  const secret = opts.secret ?? process.env.TURNSTILE_SECRET_KEY ?? "";
  if (!secret) return true;
  if (!token) return false;
  const f = opts.fetchImpl ?? fetch;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);
    const res = await f(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return false;
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}
