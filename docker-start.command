#!/bin/sh
set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
cd "$SCRIPT_DIR"

mkdir -p data

docker compose up -d --build

printf '\nStarted Mendix RAG demo at http://localhost:3009\n'
