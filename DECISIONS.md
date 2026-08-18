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
