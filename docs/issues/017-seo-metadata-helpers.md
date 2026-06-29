---
json: {"title":"SEO metadata helpers","labels":["epic:public-content","priority:mvp","type:feature"],"milestone":"M3 — Public Content"}
---

generateMetadata for articles with OG, Twitter, and canonical URLs.

## Acceptance criteria
- [ ] title and description from seoTitle/seoDescription or fallbacks
- [ ] Open Graph image from ogImage or coverImage
- [ ] canonical URL supported

## Dependencies
- #15

## Key files
- `src/lib/seo.ts`
