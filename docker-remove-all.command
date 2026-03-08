#!/bin/sh
set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
cd "$SCRIPT_DIR"

docker compose down --remove-orphans
rm -f ./data/app.db ./data/*.db-shm ./data/*.db-wal

printf '\nRemoved containers and deleted local database files.\n'
