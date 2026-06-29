---
json: {"title":"RSS feed","labels":["epic:public-content","priority:mvp","type:feature"],"milestone":"M3 — Public Content"}
---

RSS feed at /rss.xml with latest published articles.

## Acceptance criteria
- [ ] RSS includes title, excerpt, date, canonical link
- [ ] Drafts and soft-deleted excluded

## Dependencies
- #14

## Key files
- `src/app/(public)/rss.xml/route.ts`
