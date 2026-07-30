#!/usr/bin/env bash

set -xe

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
base_url="${API_BASE_URL:-http://localhost:8080}"

curl -i -X POST "${base_url}/api/v1/users" \
    -H "Content-Type: application/json" \
    -d "{ \"username\": \"foo\", \"email\": \"foo@example.com\", \"password\": \"abcd1234\" }"