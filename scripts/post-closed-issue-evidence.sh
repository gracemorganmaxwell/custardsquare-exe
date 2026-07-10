#!/usr/bin/env bash
# Reopen closed tickets with ticked ACs + visual evidence comments.
# Run after evidence screenshots are on main (raw.githubusercontent.com URLs).
set -euo pipefail

REPO="gracemorganmaxwell/custardsquare-exe"
BASE="https://raw.githubusercontent.com/${REPO}/main/docs/screenshots/foundation"

post_issue() {
  local num="$1"
  local title="$2"
  local body="$3"
  local comment="$4"

  gh issue reopen "$num" 2>/dev/null || true
  gh issue edit "$num" --title "$title" --body "$body"
  gh issue comment "$num" --body "$comment"
  echo "Updated #${num}"
}

post_issue 16 "Rich text rendering + TOC" "$(cat <<'EOF'
> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Lexical to React renderer with table of contents for headings.

## Acceptance criteria
- [x] Headings, lists, code blocks render correctly
- [x] TOC generated from h2/h3
- [x] Readable typography on article pages

## Dependencies
- #15

## Key files
- `src/components/article/ArticleBody.tsx`
- `src/components/article/ArticleTableOfContents.tsx`
- `src/lib/lexical-headings.ts`

## Visual evidence
See comment below. Re-run: `pnpm verify-issue-016` then `node scripts/capture-issue-016-evidence.mjs`.
EOF
)" "$(cat <<EOF
## Visual evidence — acceptance criteria verified

### AC1 — Headings, lists, code blocks render correctly
![AC1](${BASE}/issue-016-ac1-rich-text.png)

### AC2 — TOC generated from h2/h3
![AC2](${BASE}/issue-016-ac2-toc.png)

### AC3 — Readable typography on article pages
![AC3](${BASE}/issue-016-ac3-typography.png)

**Verify:** \`pnpm verify-issue-016\` · **Live:** https://custardsq.app/articles/why-i-built-custardsquareexe
EOF
)"

post_issue 17 "SEO metadata helpers" "$(cat <<'EOF'
> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

generateMetadata for articles with OG, Twitter, and canonical URLs.

## Acceptance criteria
- [x] title and description from seoTitle/seoDescription or fallbacks
- [x] Open Graph image from ogImage or coverImage
- [x] canonical URL supported

## Dependencies
- #15

## Key files
- `src/lib/seo.ts`

## Visual evidence
See comment below. Re-run: `pnpm verify-issue-017` then `node scripts/capture-issue-017-evidence.mjs`.
EOF
)" "$(cat <<EOF
## Visual evidence — acceptance criteria verified

### AC1 — title and description fallbacks
![AC1](${BASE}/issue-017-ac1-metadata.png)

### AC2 — Open Graph + Twitter helpers
![AC2](${BASE}/issue-017-ac2-og-twitter.png)

### AC3 — canonical URL on article pages
![AC3](${BASE}/issue-017-ac3-article-page.png)

**Verify:** \`pnpm verify-issue-017\`
EOF
)"

post_issue 19 "Sitemap + robots.txt" "$(cat <<'EOF'
> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Dynamic sitemap and robots.txt for public routes.

## Acceptance criteria
- [x] Sitemap includes articles and static public routes
- [x] Drafts excluded
- [x] robots.txt allows indexing of public content

## Dependencies
- #14

## Key files
- `src/app/(frontend)/sitemap.ts`
- `src/app/robots.ts`

## Visual evidence
See comment below. Re-run: `pnpm verify-issue-019` then `node scripts/capture-issue-019-evidence.mjs`.
EOF
)" "$(cat <<EOF
## Visual evidence — acceptance criteria verified

### AC1 — sitemap.xml includes static routes + published articles
![AC1](${BASE}/issue-019-ac1-sitemap.png)

### AC2 — drafts excluded from sitemap
![AC2](${BASE}/issue-019-ac2-drafts-excluded.png)

### AC3 — robots.txt allows public indexing
![AC3](${BASE}/issue-019-ac3-robots.png)

**Fix:** moved \`robots.ts\` to \`src/app/robots.ts\` so Next.js serves \`/robots.txt\`.

**Verify:** \`pnpm verify-issue-019\` · **Live:** https://custardsq.app/sitemap.xml · https://custardsq.app/robots.txt
EOF
)"

post_issue 21 "Design tokens + win95.css" "$(cat <<'EOF'
> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Win95 colours and bevel CSS — the visual foundation for the desktop.

## Acceptance criteria
- [x] CSS variables for grey, pink/purple accent, title bar colours
- [x] Raised/inset border utilities work

## Key files
- `src/styles/win95.css`

## Visual evidence
See comment below. Re-run: `pnpm verify-issue-021` then `node scripts/capture-issue-021-evidence.mjs`.
EOF
)" "$(cat <<EOF
## Visual evidence — acceptance criteria verified

### AC1 — CSS variables (grey, dream accent, title bar)
![AC1](${BASE}/issue-021-ac1-tokens.png)

### AC2 — Raised/inset border utilities on login window
![AC2](${BASE}/issue-021-ac2-bevel-utilities.png)

**Verify:** \`pnpm verify-issue-021\`
EOF
)"

post_issue 22 "Boot screen + reduced motion" "$(cat <<'EOF'
> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Short boot when entering the site. Skip animation if prefers-reduced-motion.

## Acceptance criteria
- [x] Shows custardsquare.exe startup lines
- [x] Continues to desktop/login
- [x] Reduced motion skips typing animation

## Key files
- `src/components/desktop/BootScreen.tsx`

## Visual evidence
See comment below. Re-run: `pnpm verify-issue-022` then `node scripts/capture-issue-022-evidence.mjs`.
EOF
)" "$(cat <<EOF
## Visual evidence — acceptance criteria verified

### AC1 — Startup lines on boot screen
![AC1](${BASE}/issue-022-ac1-boot-screen.png)

### AC2 — Continues to login after boot
![AC2](${BASE}/issue-022-ac2-login-after-boot.png)

### AC3 — Reduced motion skips typing animation
![AC3](${BASE}/issue-022-ac3-reduced-motion.png) · [code](${BASE}/issue-022-ac3-reduced-motion-code.png)

**Verify:** \`pnpm verify-issue-022\`
EOF
)"

post_issue 48 "Connect custom domain + HTTPS" "$(cat <<'EOF'
> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Point domain DNS to Vercel and verify HTTPS.

## Acceptance criteria
- [x] Custom domain resolves
- [x] HTTPS works
- [x] NEXT_PUBLIC_SITE_URL updated

## Dependencies
- #4

## Visual evidence
See comment below. Re-run: `pnpm verify-issue-048` then `node scripts/capture-issue-048-evidence.mjs`.
EOF
)" "$(cat <<EOF
## Visual evidence — acceptance criteria verified

### AC1 — custardsq.app resolves
![AC1](${BASE}/issue-048-ac1-domain-homepage.png)

### AC2 — HTTPS works
![AC2](${BASE}/issue-048-ac2-https.png)

### AC3 — NEXT_PUBLIC_SITE_URL documented
![AC3](${BASE}/issue-048-ac3-site-url.png)

**Verify:** \`pnpm verify-issue-048\` · **Live:** https://custardsq.app
EOF
)"

# #18 RSS is V2 — not implemented; reopen without false evidence
gh issue reopen 18 2>/dev/null || true
gh issue edit 18 --title "V2: RSS feed" --remove-milestone --add-label "priority:v2" --body "$(cat <<'EOF'
> V2 — not in MVP scope.

RSS feed at `/rss.xml` with latest published articles.

## Acceptance criteria
- [ ] RSS includes title, excerpt, date, canonical link
- [ ] Drafts and soft-deleted excluded

## Dependencies
- #14

## Key files
- `src/app/(frontend)/rss.xml/route.ts`

**Note:** Closed prematurely without implementation. Reopened as V2 backlog — no evidence until built.
EOF
)"
gh issue comment 18 --body "$(cat <<'EOF'
Reopened as **V2 backlog** — RSS was never implemented for MVP. No visual evidence until `/rss.xml` ships.
EOF
)"

echo "Done."
