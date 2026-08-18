# Design decisions

## 2026-08-18 — Projects live in Site Settings, not a collection

**Decision:** List portfolio sites in a Site Settings array with bundled defaults, and render them in the desktop Projects window.

**Context / problem:** Projects was a coming-soon placeholder. Four live sites needed to appear (Delta Rootz Rock Radio, Refined K-9, Blue Rose Nails and Beauty, Walkies Quest) without waiting on a V2 case-study collection.

**Options considered:**
1. Payload `projects` collection with drafts, slugs, and seed documents.
2. Site Settings array + code defaults (same pattern as Skills and social links).
3. Hardcoded frontend list only.

**Chosen option:** Option 2.

**Rationale:** Skills already owns “list shown in a desktop window, CMS-editable, fallback when empty.” A collection is the right fit for later case-study pages (issue 051), not for external live-site links. Empty CMS arrays fall back to `DEFAULT_PROJECTS`, so existing Site Settings pick up the four sites without a seed script.

**Trade-offs / consequences:** Adding or editing projects does not require a code deploy once Site Settings is saved. Richer case studies (drafts, SEO, per-project pages) still need a collection later. If Site Settings is saved with an incomplete custom list, that list replaces the bundled defaults.

## 2026-08-18 — Project stories are a textarea on the same array

**Decision:** Each project has a `story` textarea shown in a pane under the Projects list. Click a row to read it; Visit site opens the live URL.

**Context / problem:** The list-only window had nowhere to tell the story of each live site.

**Options considered:**
1. Payload collection with rich-text case studies (issue 051).
2. Lexical rich text on the Site Settings array (same editor as Resume).
3. Plain textarea + Win95 story pane on the existing projects array.

**Chosen option:** Option 3.

**Rationale:** Stories are a few paragraphs, not article pages. Skills/summary already use textareas. Empty CMS `story` falls back to the bundled copy for that URL so existing Site Settings still show a story.

**Trade-offs / consequences:** No headings/links inside a story until a later collection. Edit copy in Site Settings → Projects window.

## 2026-08-18 — Allow 127.0.0.1 as a Next.js dev origin

**Decision:** Set `allowedDevOrigins` to `127.0.0.1` and `localhost` in `next.config.ts`.

**Context / problem:** Cursor's preview hits `http://localhost:3000` or `http://127.0.0.1:3000`. Next 16 blocks cross-origin dev assets when the Host header does not match the listen hostname, which left the Simple Browser with a refused or broken page.

**Options considered:**
1. Tell reviewers to use only `localhost` and IPv4 happy-eyeballs.
2. Allow both `localhost` and `127.0.0.1` as dev origins.
3. Disable the origin check (not supported as a public flag).

**Chosen option:** Option 2.

**Rationale:** Same machine, two names for loopback. Allowing both unblocks Cloud Agent / Simple Browser preview without exposing extra hosts.

**Trade-offs / consequences:** Any process that can reach the local dev server as 127.0.0.1 can load Next's dev assets. That is already true for `localhost` during `pnpm dev`.
