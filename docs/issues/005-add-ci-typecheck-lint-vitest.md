---
json: {"title":"Add CI: typecheck + lint + Vitest","labels":["epic:foundation","priority:mvp","type:chore"],"milestone":"M1 — Foundation"}
---

GitHub Actions workflow for lint, typecheck, and unit tests on push/PR.

## Acceptance criteria
- [ ] CI runs on push to main and on pull requests
- [ ] pnpm lint passes
- [ ] pnpm test:int passes

## Key files
- `.github/workflows/ci.yml`
