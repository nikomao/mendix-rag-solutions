#!/bin/sh
set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
cd "$SCRIPT_DIR"

PURGE_DATA="${1:-}"

docker compose down --remove-orphans

if [ "$PURGE_DATA" = "--purge-data" ]; then
  rm -f ./data/app.db ./data/*.db-shm ./data/*.db-wal
  printf '\nRemoved containers and deleted local database files.\n'
else
  printf '\nRemoved containers and kept local data in ./data.\n'
fi
