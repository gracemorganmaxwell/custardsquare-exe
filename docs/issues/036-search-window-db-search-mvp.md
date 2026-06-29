---
json: {"title":"Search window (DB search MVP)","labels":["epic:desktop-apps","priority:mvp","type:feature"],"milestone":"M5 — Desktop Apps"}
---

Site search by title, excerpt, tags, topics via Postgres query.

## Acceptance criteria
- [ ] Search returns matching published articles
- [ ] Results link to article pages
- [ ] Empty state exists

## Dependencies
- #14

## Key files
- `src/components/windows/SearchWindow.tsx`
- `src/lib/search.ts`
