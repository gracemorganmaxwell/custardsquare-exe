---
json: {"title":"Add CI: lint + typecheck","labels":["epic:foundation","priority:mvp","type:chore"],"milestone":"M1 — Foundation"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

One GitHub Actions workflow to catch broken builds before deploy.

## Done when
- [ ] Workflow runs on push to main
- [ ] `pnpm lint` passes
- [ ] `pnpm exec tsc --noEmit` passes

## Note
No test-suite theatre for MVP. Add Playwright smoke (#46) only when the desktop exists.

## Likely files
- `.github/workflows/ci.yml`
