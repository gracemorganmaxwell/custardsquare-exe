---
json: {"title":"Search window","labels":["epic:desktop-apps","priority:mvp","type:feature"],"milestone":"M5 — Desktop Apps"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Filter published articles by title/excerpt. Client-side filter is fine for MVP.

## Done when
- [x] Typing filters the article list
- [x] Results link to article pages

## Depends on
- #14

## Likely files
- `src/components/windows/SearchWindow.tsx`
- `src/components/desktop/WindowManager.tsx`
- `src/lib/desktop-icons.ts`
- `src/components/desktop/StartMenu.tsx`
