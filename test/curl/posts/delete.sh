#!/usr/bin/env bash

set -xe

: "${POST_ID:?Set POST_ID to the post ID to delete}"

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
base_url="${API_BASE_URL:-http://localhost:8080}"

curl -i -X DELETE "${base_url}/api/v1/posts/${POST_ID}" \
    -b "${script_dir}/../cookies.txt"
