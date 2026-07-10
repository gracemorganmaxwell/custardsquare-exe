---
json: {"title":"SEO metadata helpers","labels":["epic:public-content","priority:mvp","type:feature"],"milestone":"M3 — Public Content"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

generateMetadata for articles with OG, Twitter, and canonical URLs.

## Done when
- [x] title and description from seoTitle/seoDescription or fallbacks
- [x] Open Graph image from ogImage or coverImage
- [x] canonical URL supported

## Depends on
- #15

## Likely files
- `src/lib/seo.ts`
