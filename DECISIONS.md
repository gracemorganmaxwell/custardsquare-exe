# Design decisions

Technical design choices for **custardsquare.exe**. Add a new entry whenever stack, architecture, libraries, APIs, hosting, data models, or significant patterns change.

## Entry format

Each entry should include:

- **Date** — `YYYY-MM-DD` for new decisions; `pre-existing` for history seeded from the repo
- **Decision** — one sentence
- **Context / problem**
- **Options considered**
- **Chosen option**
- **Rationale**
- **Trade-offs / consequences**

---

## pre-existing — Content first, desktop second, magic third

- **Decision:** Ship the CMS content system before the nostalgic desktop shell, and defer “magic” extras until both work.
- **Context / problem:** Solo-admin personal site; easy to overbuild the Win9x UI before there is anything to publish.
- **Options considered:** Desktop-first prototype; CMS-only blog; staged philosophy (content → desktop → magic).
- **Chosen option:** Content first → desktop second → magic third.
- **Rationale:** Grace publishes everything; the desktop is discovery, the CMS is the durable brain.
- **Trade-offs / consequences:** Some desktop apps stay placeholders until collections exist (Notes, Projects V2).

## pre-existing — Public face is a Win95/98 desktop over a real CMS

- **Decision:** The homepage is a nostalgic Windows 95/98-style desktop that surfaces CMS content.
- **Context / problem:** Need a distinctive personal site without abandoning reliable content tooling.
- **Options considered:** Plain blog; SPA portfolio; desktop shell over Payload.
- **Chosen option:** Dreamy Win9x desktop UI backed by Payload.
- **Rationale:** Matches the “second brain disguised as a desktop” product identity.
- **Trade-offs / consequences:** Custom chrome and accessibility work; not a generic marketing template.

## pre-existing — Stack: Next.js App Router + Payload 3 + TypeScript + pnpm

- **Decision:** Use Next.js App Router, Payload CMS 3, TypeScript, and pnpm.
- **Context / problem:** Need a modern full-stack CMS site deployable on Vercel.
- **Options considered:** Separate CMS host; older Payload/Next combos; npm/yarn.
- **Chosen option:** Next + Payload 3 + TypeScript + pnpm.
- **Rationale:** Official Payload 3 + Next integration; typed codebase; fast local installs.
- **Trade-offs / consequences:** Coupled frontend/admin deploy; Payload learning curve.

## pre-existing — Neon Postgres via Vercel adapter

- **Decision:** Persist Payload data in Neon Postgres through `@payloadcms/db-vercel-postgres`.
- **Context / problem:** Need managed Postgres that fits Vercel serverless.
- **Options considered:** Mongo (docker leftover), self-hosted Postgres, Neon + Vercel adapter.
- **Chosen option:** Neon via the Vercel Postgres adapter.
- **Rationale:** Serverless-friendly, hosted, matches Vercel workflow.
- **Trade-offs / consequences:** Cold starts / connection limits; local Docker Mongo is not the source of truth.

## pre-existing — Vercel Blob for media

- **Decision:** Store Media uploads in Vercel Blob (`@payloadcms/storage-vercel-blob`), with local disk fallback when the token is absent.
- **Context / problem:** Serverless has no durable writable disk for uploads.
- **Options considered:** Local-only media; S3; Vercel Blob.
- **Chosen option:** Vercel Blob in production; local fallback for dev without a token.
- **Rationale:** Native Vercel Storage integration; simple token setup.
- **Trade-offs / consequences:** Production uploads fail without `BLOB_READ_WRITE_TOKEN`.

## pre-existing — Host on Vercel; canonical domain custardsq.app

- **Decision:** Deploy on Vercel with canonical site URL `https://custardsq.app`.
- **Context / problem:** Need HTTPS hosting aligned with Neon/Blob and Next.
- **Options considered:** Cloudflare Pages, self-host, Vercel.
- **Chosen option:** Vercel + `custardsq.app`.
- **Rationale:** Fits Payload/Next/Blob stack; preview envs for PRs.
- **Trade-offs / consequences:** Vendor lock-in to Vercel’s runtime and env model.

## pre-existing — MVP CMS schema: Users, Media, Articles + SiteSettings

- **Decision:** MVP Payload collections are Users, Media, and Articles; site copy lives in one `site-settings` global.
- **Context / problem:** Need enough schema to publish without inventing unused collections.
- **Options considered:** Many collections up front (Notes, Projects, Credits, Tags); minimal schema.
- **Chosen option:** Users / Media / Articles + SiteSettings global.
- **Rationale:** Content first with the smallest schema that ships articles and site identity.
- **Trade-offs / consequences:** Notes/Projects deferred to V2; Credits are not a collection.

## pre-existing — Credits live in SiteSettings, not a Credits collection

- **Decision:** Credits are SiteSettings text (issue #11 closed into #10).
- **Context / problem:** Attribution text does not need its own collection CRUD.
- **Options considered:** Credits collection; SiteSettings field.
- **Chosen option:** SiteSettings text.
- **Rationale:** Solo admin; one place for site-wide copy.
- **Trade-offs / consequences:** No per-credit documents or versioning beyond the global.

## pre-existing — Soft-delete cancelled for MVP

- **Decision:** Do not implement soft-delete; use drafts/publish and hard delete (#12 deferred).
- **Context / problem:** Undo-after-delete is nice but not launch-critical for a solo admin.
- **Options considered:** Soft-delete fields + restore UI; drafts + hard delete.
- **Chosen option:** Drafts/publish; hard delete; soft-delete only if needed later.
- **Rationale:** Less schema and admin workflow complexity.
- **Trade-offs / consequences:** Accidental deletes are harder to reverse.

## pre-existing — Hardcoded shell vs CMS-owned content

- **Decision:** Desktop chrome (icons, wallpaper, terminal toy, decorative login) stays in code; About, Resume, Skills, Credits, socials, and Articles come from CMS (with code defaults when empty).
- **Context / problem:** Not everything belongs in Payload; the shell should stay shippable without CMS rows.
- **Options considered:** Put icon layout in CMS; hardcode everything; split shell vs content.
- **Chosen option:** Hardcoded shell + CMS content with fallbacks.
- **Rationale:** Matches “content first / desktop second”; avoids CMS for pure UX toys.
- **Trade-offs / consequences:** Shell changes need deploys; content edits do not.

## pre-existing — Notes and Projects placeholders until V2

- **Decision:** Notes and Projects desktop apps ship as coming-soon placeholders until V2 collections (#038 / #050 / #051).
- **Context / problem:** Desktop icons should open safely before collections exist.
- **Options considered:** Hide icons; empty windows; friendly placeholders; full CMS now.
- **Chosen option:** Coming-soon placeholders (Projects later partially superseded by hardcoded shortcuts — see 2026-07-22).
- **Rationale:** Icons can appear on the desktop without blocking on schema.
- **Trade-offs / consequences:** Placeholder copy until real data paths exist.

## pre-existing — Desktop window state is Zustand in-memory

- **Decision:** Open windows, focus, and positions live in Zustand; persisted layout is V2 (#055).
- **Context / problem:** Need window manager state without premature persistence.
- **Options considered:** React state only; URL state; Zustand; localStorage now.
- **Chosen option:** Zustand in-memory for MVP.
- **Rationale:** Simple, enough for a session; persist is optional polish.
- **Trade-offs / consequences:** Refresh resets window layout.

---

## 2026-07-22 — Hardcoded Projects window shortcuts (before CMS Projects)

- **Decision:** Ship a hardcoded Projects window listing three external portfolio shortcuts (rain check, Refined K-9, Blue Rose Nails) with blurbs, instead of waiting for Payload Projects (#051).
- **Context / problem:** Live client/personal project URLs exist now; CMS Projects collection is still V2. The Projects app was a coming-soon placeholder.
- **Options considered:** Keep coming soon until #051; add desktop icons only; hardcode an in-window folder of browser shortcuts; build full CMS Projects now.
- **Chosen option:** Hardcoded list in `src/lib/project-links.ts`, rendered by `ProjectsWindow` as browser-icon links that open in a new tab; status bar shows the selected blurb.
- **Rationale:** Simplest path that surfaces real work today without inventing a collection. Matches the existing GitHub desktop `href` pattern for external links.
- **Trade-offs / consequences:** Adding/editing projects requires a code change until #051 migrates this list into Payload. Notes remains coming soon. Stack blurbs follow the public repos (Refined K-9 is Vite + React on Cloudflare, not RedwoodSDK).
