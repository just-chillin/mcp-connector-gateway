#!/bin/bash
# Containers on Cloudflare have no persistent disk, so the session made by
# `--login` on your own machine is shipped in as a gzipped tarball (base64).
set -euo pipefail
dest=/home/pwuser/.linkedin-mcp
if [[ -n "${LINKEDIN_SESSION_B64:-}" ]]; then
  echo "$LINKEDIN_SESSION_B64" | base64 -d | tar -xz -C "$dest"
  unset LINKEDIN_SESSION_B64
else
  echo "LINKEDIN_SESSION_B64 not set: tool calls will fail with no session" >&2
fi
exec "$@"
