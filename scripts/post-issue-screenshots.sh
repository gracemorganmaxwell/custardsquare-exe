#!/usr/bin/env bash
set -euo pipefail

REPO="gracemorganmaxwell/custardsquare-exe"
BASE="https://raw.githubusercontent.com/${REPO}/main/docs/screenshots/issues"

post() {
  local num="$1"
  local title="$2"
  local file="$3"
  local route="$4"

  gh issue comment "$num" --body "$(cat <<EOF
## Screenshot — ${title}

**Viewport:** 1280×800 · **Route:** \`${route}\`

![${title}](${BASE}/${file})

_Screenshot in [\`docs/screenshots/issues/${file}\`](https://github.com/${REPO}/blob/main/docs/screenshots/issues/${file}). Regenerate with \`node scripts/capture-issue-screenshots.mjs\` while \`pnpm dev\` is running._
EOF
)"
  echo "Commented on #${num}"
}

post 14 "Articles index" "issue-014-articles-index.png" "/articles"
post 15 "Article detail page" "issue-015-article-detail.png" "/articles/why-i-built-custardsquareexe"
post 16 "Rich text rendering + TOC" "issue-016-article-toc.png" "/articles/why-i-built-custardsquareexe"
post 21 "Design tokens + win95.css" "issue-021-design-tokens.png" "/ (Start window chrome)"
post 22 "Boot screen" "issue-022-boot-screen.png" "/ (boot sequence)"
post 23 "Start screen" "issue-023-start-screen.png" "/ (after boot)"
post 24 "Desktop shell + wallpaper" "issue-024-desktop-shell.png" "/ (after Start)"
post 25 "Desktop icons + keyboard nav" "issue-025-desktop-icons.png" "/ (after Start)"

echo "Done."
