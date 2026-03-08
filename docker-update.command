#!/bin/sh
set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
cd "$SCRIPT_DIR"

mkdir -p data

docker compose down --remove-orphans
docker compose up -d --build

printf '\nUpdated Mendix RAG demo at http://localhost:3009\n'
