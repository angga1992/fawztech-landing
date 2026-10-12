#!/usr/bin/env bash
# Uji E2E lokal landing ↔ internal lewat Docker Compose kedua repo (../fawz-internal harus ada).
# Bangun kedua image, jalankan db + internal + landing di jaringan "fawz", kirim prospek lewat landing,
# pastikan tersimpan di PostgreSQL internal, lalu bersihkan. Pakai: scripts/e2e-leads.sh [--keep]
set -euo pipefail
cd "$(dirname "$0")/.."
INTERNAL=${INTERNAL_DIR:-../fawz-internal}
KEEP=${1:-}
TMP=$(mktemp -d)
TOKEN=$(openssl rand -hex 24)

cat > "$TMP/internal.env" <<ENV
TAG=e2e
APP_URL=http://localhost:3300
POSTGRES_PASSWORD=e2e-$(openssl rand -hex 8)
APP_SECRET=$(openssl rand -hex 32)
LEADS_API_TOKEN=$TOKEN
ENV
cat > "$TMP/landing.env" <<ENV
TAG=e2e
SITE_URL=http://localhost:3200
LEADS_API_TOKEN=$TOKEN
NEXT_PUBLIC_CONTACT_EMAIL=contact@fawztech.id
NEXT_PUBLIC_CONTACT_PHONE="+62 821-1238-7670"
NEXT_PUBLIC_WA_NUMBER="+62 821-1238-7670"
NEXT_PUBLIC_REPLY_DAYS=2
NEXT_PUBLIC_PORTFOLIO_CLIENTS=all
ENV
printf 'services:\n  internal:\n    ports: ["127.0.0.1:3300:3100"]\n' > "$TMP/internal.ports.yml"
printf 'services:\n  landing:\n    ports: ["127.0.0.1:3200:3000"]\n' > "$TMP/landing.ports.yml"

ci() { docker compose -p fawz-e2e --project-directory "$INTERNAL" --env-file "$TMP/internal.env" -f "$INTERNAL/docker-compose.yml" -f "$TMP/internal.ports.yml" "$@"; }
cl() { docker compose -p fawz-e2e-landing --env-file "$TMP/landing.env" -f docker-compose.yml -f "$TMP/landing.ports.yml" "$@"; }
cleanup() { if [ "$KEEP" != "--keep" ]; then cl down -v --remove-orphans >/dev/null 2>&1 || true; ci down -v --remove-orphans >/dev/null 2>&1 || true; rm -rf "$TMP"; fi; }
trap cleanup EXIT

docker network inspect fawz >/dev/null 2>&1 || docker network create fawz >/dev/null
echo "== internal: build + up"; ci up -d --build --wait --wait-timeout 300
echo "== seed";               ci exec -T -e SEED_FOUNDERS="Admin E2E:admin@e2e.local" -e SEED_PASSWORD="e2e-ganti-saya-segera" internal npm run --silent db:seed | tail -1
echo "== landing: build + up"; cl up -d --build --wait --wait-timeout 300

pass=0; fail=0
check() { if eval "$2"; then echo "  ok   $1"; pass=$((pass+1)); else echo "  GAGAL $1"; fail=$((fail+1)); fi; }
psql() { ci exec -T db psql -U fawz -d fawz_internal -tA -c "$1" | tr -d '[:space:]'; }

echo "== kesehatan"
check "internal /health 200" '[ "$(curl -s -o /dev/null -w %{http_code} http://127.0.0.1:3300/health)" = 200 ]'
check "landing / 200" '[ "$(curl -s -o /dev/null -w %{http_code} -H "x-country-code: ID" http://127.0.0.1:3200/)" = 200 ]'
check "landing /en 200" '[ "$(curl -s -o /dev/null -w %{http_code} http://127.0.0.1:3200/en)" = 200 ]'
check "portofolio tampil (env build)" 'curl -s -H "x-country-code: ID" http://127.0.0.1:3200/ | grep -q "id=\"portofolio\""'
check "internal API menolak tanpa token (401)" '[ "$(curl -s -o /dev/null -w %{http_code} -X POST -H "Content-Type: application/json" -d "{}" http://127.0.0.1:3300/api/public/leads)" = 401 ]'

echo "== kirim prospek lewat landing"
STORY="E2E $(date +%s): proses PO masih manual di spreadsheet."
PAYLOAD='{"nama":"Budi E2E","kontak":"0812-3456-7890","bisnis":"PT Uji Coba","kebutuhan":["web","mobile"],"cerita":"'"$STORY"'","setuju":true,"website":"","turnstile_token":"","utm_source":"e2e","utm_medium":"script","utm_campaign":"compose","page_url":"http://localhost:3200/","referrer":"","locale":"id"}'
RES=$(curl -s -w '\n%{http_code}' -X POST -H "Content-Type: application/json" -d "$PAYLOAD" http://127.0.0.1:3200/api/leads)
CODE=$(echo "$RES" | tail -1); BODY=$(echo "$RES" | head -1); ID=$(echo "$BODY" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')
echo "  landing → $CODE $BODY"
check "landing 201 dengan id" '[ "$CODE" = 201 ] && [ -n "$ID" ]'

echo "== verifikasi di database internal"
Q="'$ID'"
check "lead tersimpan dengan id dari internal" '[ "$(psql "select count(*) from leads where id=$Q and story='"'"'$STORY'"'"'")" = 1 ]'
check "customer prospek CUST-0001" '[ "$(psql "select c.code from customers c join leads l on l.customer_id=c.id where l.id=$Q")" = CUST-0001 ]'
check "WhatsApp dinormalkan 62…" '[ "$(psql "select ct.whatsapp from contacts ct join leads l on l.contact_id=ct.id where l.id=$Q")" = 6281234567890 ]'
check "kebutuhan web,mobile" '[ "$(psql "select array_to_string(needs,'"'"','"'"') from leads where id=$Q")" = "web,mobile" ]'
check "UTM + privacy_version" '[ "$(psql "select utm_source||'"'"'|'"'"'||coalesce(privacy_version,'"'"''"'"') from leads where id=$Q")" = "e2e|2026-10-09" ]'
check "notifikasi founder" '[ "$(psql "select count(*) from notifications")" -ge 1 ]'
check "email founder dicatat (tanpa SMTP → logged)" '[ "$(psql "select count(*) from message_logs where status='"'"'logged'"'"'")" -ge 1 ]'

echo "== idempotensi dan validasi"
RES2=$(curl -s -w '\n%{http_code}' -X POST -H "Content-Type: application/json" -d "$PAYLOAD" http://127.0.0.1:3200/api/leads)
check "kiriman identik → id sama, tidak dobel" '[ "$(echo "$RES2" | tail -1)" = 201 ] && echo "$RES2" | head -1 | grep -q "$ID" && [ "$(psql "select count(*) from leads")" = 1 ]'
BAD=${PAYLOAD/0812-3456-7890/bukan-kontak}
check "kontak tidak valid → 422" '[ "$(curl -s -o /dev/null -w %{http_code} -X POST -H "Content-Type: application/json" -d "$BAD" http://127.0.0.1:3200/api/leads)" = 422 ]'

echo; echo "HASIL: $pass lulus, $fail gagal"; [ "$fail" = 0 ]
