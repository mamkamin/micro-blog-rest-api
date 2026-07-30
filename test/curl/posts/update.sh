#!/usr/bin/env bash

set -xe

: "${POST_ID:?Set POST_ID to the post ID to update}"

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
base_url="${API_BASE_URL:-http://localhost:8080}"

curl -i -X PATCH "${base_url}/api/v1/posts/${POST_ID}" \
    -H "Content-Type: application/json" \
    -b "${script_dir}/../cookies.txt" \
    -d '{ "body": "My updated test post" }'
