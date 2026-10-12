# syntax=docker/dockerfile:1
# Landing page Fawz Tech. Build: docker compose build (lihat docker-compose.yml). Variabel NEXT_PUBLIC_* dan SITE_URL
# dibakar saat build (halaman statis), jadi diteruskan sebagai build arg. Rahasia (LEADS_API_TOKEN,
# TURNSTILE_SECRET_KEY) hanya saat runtime.
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG SITE_URL
ARG NEXT_PUBLIC_CONTACT_EMAIL
ARG NEXT_PUBLIC_CONTACT_PHONE
ARG NEXT_PUBLIC_WA_NUMBER
ARG NEXT_PUBLIC_INSTAGRAM
ARG NEXT_PUBLIC_LINKEDIN
ARG NEXT_PUBLIC_REPLY_DAYS
ARG NEXT_PUBLIC_PORTFOLIO_CLIENTS
ARG NEXT_PUBLIC_PLAUSIBLE_DOMAIN
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV SITE_URL=$SITE_URL \
    NEXT_PUBLIC_CONTACT_EMAIL=$NEXT_PUBLIC_CONTACT_EMAIL \
    NEXT_PUBLIC_CONTACT_PHONE=$NEXT_PUBLIC_CONTACT_PHONE \
    NEXT_PUBLIC_WA_NUMBER=$NEXT_PUBLIC_WA_NUMBER \
    NEXT_PUBLIC_INSTAGRAM=$NEXT_PUBLIC_INSTAGRAM \
    NEXT_PUBLIC_LINKEDIN=$NEXT_PUBLIC_LINKEDIN \
    NEXT_PUBLIC_REPLY_DAYS=$NEXT_PUBLIC_REPLY_DAYS \
    NEXT_PUBLIC_PORTFOLIO_CLIENTS=$NEXT_PUBLIC_PORTFOLIO_CLIENTS \
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN=$NEXT_PUBLIC_PLAUSIBLE_DOMAIN \
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY \
    NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY \
    NEXT_OUTPUT=standalone NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
RUN groupadd -r app && useradd -r -g app -d /app app
# InlineSvg membaca public/ lewat process.cwd(), jadi public ikut di samping server.js.
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:3000/robots.txt').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
