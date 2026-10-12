#!/usr/bin/env bash
# Deploy landing ke VPS dan pasang nginx + certbot untuk fawztech.id. Pakai: scripts/deploy.sh [host-ssh=fawztech]
# SKIP_BUILD=1 → hanya konfigurasi. Stack internal (repo fawz-internal) harus sudah berjalan: ia memasang Docker,
# nginx, certbot, dan jaringan "fawz" di server.
set -euo pipefail
cd "$(dirname "$0")/.."
HOST=${1:-fawztech}
DIR=fawztech-landing
[ -f .env.deploy ] || { echo "Buat .env.deploy dari .env.docker.example dulu."; exit 1; }
envval() { grep -E "^$1=" .env.deploy | head -1 | cut -d= -f2- | sed -E 's/^"(.*)"$/\1/'; }
TAG=$(envval TAG); TAG=${TAG:-latest}
HOSTS=$(envval LANDING_HOSTS); HOSTS=${HOSTS:-fawztech.id www.fawztech.id}
PRIMARY=${HOSTS%% *}
ACME_EMAIL=$(envval ACME_EMAIL); ACME_EMAIL=${ACME_EMAIL:-contact@fawztech.id}
DFLAGS=""; for h in $HOSTS; do DFLAGS="$DFLAGS -d $h"; done

if [ "${SKIP_BUILD:-}" = "1" ]; then
  echo "== 1-2/4 dilewati (SKIP_BUILD=1)"
else
  echo "== 1/4 build image fawz-landing:$TAG"
  TAG=$TAG docker compose --env-file .env.deploy build landing
  echo "== 2/4 kirim image"
  docker save "fawz-landing:$TAG" | gzip -1 | ssh "$HOST" 'sg docker -c "docker load"'
fi

echo "== 3/4 kirim konfigurasi dan jalankan compose"
ssh "$HOST" "mkdir -p $DIR" && scp -q docker-compose.yml "$HOST:$DIR/" && scp -q .env.deploy "$HOST:$DIR/.env" && ssh "$HOST" "chmod 600 $DIR/.env"
ssh "$HOST" "cd $DIR && sg docker -c 'docker compose up -d --remove-orphans --wait --wait-timeout 180'"

echo "== 4/4 nginx + sertifikat ($HOSTS)"
scp -q deploy/nginx/fawztech.id.conf "$HOST:$DIR/nginx.conf"
ssh "$HOST" "set -e; sudo install -m 644 $DIR/nginx.conf /etc/nginx/sites-available/$PRIMARY && sudo ln -sf /etc/nginx/sites-available/$PRIMARY /etc/nginx/sites-enabled/$PRIMARY && sudo nginx -t -q && sudo systemctl reload-or-restart nginx
  # Konfigurasi dari repo hanya berisi blok HTTP; certbot selalu dijalankan agar blok HTTPS + redirect dipasang lagi.
  # --keep-until-expiring memakai ulang sertifikat yang masih berlaku (tanpa permintaan baru ke Let's Encrypt).
  sudo certbot --nginx -n --agree-tos -m '$ACME_EMAIL' --redirect --keep-until-expiring $DFLAGS || echo 'PERINGATAN: certbot gagal (periksa DNS); nginx tetap melayani HTTP. Ulangi: SKIP_BUILD=1 scripts/deploy.sh'"
ssh "$HOST" "cd $DIR && sg docker -c 'docker compose ps'"
