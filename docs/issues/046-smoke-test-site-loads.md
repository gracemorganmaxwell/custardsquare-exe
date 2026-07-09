---
json: {"title":"Smoke test: site loads","labels":["epic:launch","priority:mvp","type:chore"],"milestone":"M7 — Launch Polish"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

One Playwright test proving `/` and `/articles` load. Not full E2E coverage.

## Done when
- [ ] Test passes: homepage loads
- [ ] Test passes: articles index loads

## Likely files
- `tests/e2e/smoke.spec.ts`
