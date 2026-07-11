import { execSync } from 'node:child_process'
import { mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO = 'gracemorganmaxwell/custardsquare-exe'
const DOCS_DIR = path.resolve(__dirname, '../docs/issues')

/** @type {Array<{ id: string; title: string; milestone: string | null; labels: string[]; summary: string; acceptance: string[]; deps?: string[]; files?: string[] }>} */
const issues = [
  // Epic 1 — Foundation
  {
    id: '001',
    title: 'Initialise Next.js + Payload project',
    milestone: 'M1 — Foundation',
    labels: ['epic:foundation', 'priority:mvp', 'type:feature'],
    summary: 'Set up custardsquare.exe on Next.js App Router with Payload CMS 3.',
    acceptance: [
      'Project runs locally with pnpm dev',
      'TypeScript strict mode enabled',
      'Payload admin route exists at /admin',
      'Basic homepage renders',
    ],
    files: ['src/payload.config.ts', 'src/app/(payload)/'],
  },
  {
    id: '002',
    title: 'Configure Neon Postgres via Vercel adapter',
    milestone: 'M1 — Foundation',
    labels: ['epic:foundation', 'priority:mvp', 'type:chore'],
    summary: 'Connect Payload to Neon Postgres using @payloadcms/db-vercel-postgres.',
    acceptance: [
      'DATABASE_URL works locally',
      'Payload can create and read content',
      'Production env vars documented in .env.example',
    ],
    deps: ['#1'],
    files: ['src/payload.config.ts', '.env.example'],
  },
  {
    id: '003',
    title: 'Configure Vercel Blob media storage',
    milestone: 'M1 — Foundation',
    labels: ['epic:foundation', 'priority:mvp', 'type:chore'],
    summary: 'Enable Vercel Blob for Media uploads with clientUploads for Vercel 4.5MB limit.',
    acceptance: [
      'Media collection uses Blob adapter',
      'BLOB_READ_WRITE_TOKEN documented',
      'Admin can upload image in dev when token is set',
    ],
    deps: ['#2'],
    files: ['src/payload.config.ts', 'src/collections/Media.ts'],
  },
  {
    id: '004',
    title: 'Deploy to Vercel with preview envs',
    milestone: 'M1 — Foundation',
    labels: ['epic:foundation', 'priority:mvp', 'type:chore'],
    summary: 'Connect GitHub repo to Vercel and configure production/preview environment variables.',
    acceptance: [
      'Production deploy succeeds',
      'Preview deploys work on PRs',
      'DATABASE_URL, PAYLOAD_SECRET, BLOB_READ_WRITE_TOKEN, NEXT_PUBLIC_SITE_URL set',
    ],
    deps: ['#2', '#3'],
  },
  {
    id: '005',
    title: 'Add CI: lint + typecheck',
    milestone: 'M1 — Foundation',
    labels: ['epic:foundation', 'priority:mvp', 'type:chore'],
    summary: 'One GitHub Actions workflow to catch broken builds before deploy.',
    acceptance: [
      'Workflow runs on push to main',
      '`pnpm lint` passes',
      '`pnpm exec tsc --noEmit` passes',
    ],
    note: 'No test-suite theatre for MVP. Add Playwright smoke (#46) only when the desktop exists.',
    files: ['.github/workflows/ci.yml'],
  },
  // Epic 2 — CMS
  {
    id: '006',
    title: 'Users collection + admin-only access',
    milestone: 'M2 — CMS Schema',
    labels: ['epic:cms', 'priority:mvp', 'type:feature'],
    summary: 'Configure Users collection with admin role for MVP (Grace only).',
    acceptance: [
      'Admin can log in at /admin',
      'Public registration disabled',
      'Role field supports admin',
    ],
    files: ['src/collections/Users.ts'],
  },
  {
    id: '007',
    title: 'Articles collection with versions/drafts/autosave',
    milestone: 'M2 — CMS Schema',
    labels: ['epic:cms', 'priority:mvp', 'type:feature'],
    summary: 'Long-form Articles collection with maturity labels, slug, reading time, and versioning.',
    acceptance: [
      'Admin can create and save draft article',
      'Admin can publish article',
      'Versions are created on save',
      'Slug auto-generated from title',
    ],
    deps: ['#6'],
    files: ['src/collections/Articles.ts', 'src/lib/slugify.ts', 'src/lib/readingTime.ts'],
  },
  {
    id: '008',
    title: 'V2: Tags on articles',
    milestone: null,
    labels: ['epic:cms', 'priority:v2', 'type:feature'],
    summary: 'Optional tags when you have enough articles to group. Not needed for launch.',
    acceptance: [
      'Admin can add tags and assign them to articles',
      'Tags show on article pages',
    ],
    deps: ['#7'],
    files: ['src/collections/Tags.ts'],
  },
  {
    id: '009',
    title: 'Media collection + alt text',
    milestone: 'M2 — CMS Schema',
    labels: ['epic:cms', 'priority:mvp', 'type:feature'],
    summary: 'Extend Media with altText, caption, credit, and sourceUrl fields.',
    acceptance: [
      'Admin can upload image',
      'Alt text is required',
      'Image URL served from Blob in production',
    ],
    deps: ['#3'],
    files: ['src/collections/Media.ts'],
  },
  {
    id: '010',
    title: 'SiteSettings global',
    milestone: 'M2 — CMS Schema',
    labels: ['epic:cms', 'priority:mvp', 'type:feature'],
    summary:
      'One Payload global for site-wide values. Start small now; add about/skills/resume fields when those windows are built.',
    acceptance: [
      'Admin can edit site title, description, default OG image, and favicon',
      'Social links (label + URL) are editable',
      'Frontend reads settings; only logged-in admin can update',
      'Credits for icons/assets live here as simple text or a short list — no separate Credits collection',
      'About window fields (name, bio, portrait) live here — see #32',
      'Resume window fields (body, pdf) live here — see #34',
    ],
    files: ['src/globals/SiteSettings.ts'],
  },
  {
    id: '011',
    title: 'Credits collection',
    milestone: 'M2 — CMS Schema',
    labels: ['epic:cms', 'priority:mvp', 'type:feature'],
    summary: 'Cancelled — credits live in SiteSettings (#10) instead of a separate collection.',
    acceptance: ['Folded into #10 SiteSettings'],
    files: ['src/globals/SiteSettings.ts'],
  },
  {
    id: '012',
    title: 'Soft delete fields + restore workflow',
    milestone: 'M2 — CMS Schema',
    labels: ['epic:cms', 'priority:mvp', 'type:feature'],
    summary:
      'Cancelled for MVP. Solo admin can use drafts. Hard delete is fine until undo becomes a real need.',
    acceptance: ['Use article status draft/published instead'],
    deps: ['#7'],
  },
  {
    id: '013',
    title: 'Public access control helpers',
    milestone: 'M2 — CMS Schema',
    labels: ['epic:cms', 'priority:mvp', 'type:feature'],
    summary: 'Shared access helpers ensuring only published, non-deleted content is public.',
    acceptance: [
      'publishedOnly read access on Articles',
      'Drafts never returned in public Local API queries',
      'No draft data in frontend static bundles',
    ],
    deps: ['#12'],
    files: ['src/lib/access.ts'],
  },
  // Epic 3 — Public Content
  {
    id: '014',
    title: 'Article index page',
    milestone: 'M3 — Public Content',
    labels: ['epic:public-content', 'priority:mvp', 'type:feature'],
    summary: 'Build /articles listing published articles with title, excerpt, date, tags.',
    acceptance: [
      'Only published articles show',
      'Draft and soft-deleted excluded',
      'Page works on mobile',
    ],
    deps: ['#13'],
    files: ['src/app/(public)/articles/page.tsx'],
  },
  {
    id: '015',
    title: 'Article detail page',
    milestone: 'M3 — Public Content',
    labels: ['epic:public-content', 'priority:mvp', 'type:feature'],
    summary: 'Build /articles/[slug] with full article body and metadata.',
    acceptance: [
      'Article body renders from Lexical rich text',
      'Drafts return 404',
      'Soft-deleted content returns 404',
    ],
    deps: ['#14'],
    files: ['src/app/(public)/articles/[slug]/page.tsx'],
  },
  {
    id: '016',
    title: 'Rich text rendering + TOC',
    milestone: 'M3 — Public Content',
    labels: ['epic:public-content', 'priority:mvp', 'type:feature'],
    summary: 'Lexical to React renderer with table of contents for headings.',
    acceptance: [
      'Headings, lists, code blocks render correctly',
      'TOC generated from h2/h3',
      'Readable typography on article pages',
    ],
    deps: ['#15'],
    files: ['src/components/article/ArticleBody.tsx'],
  },
  {
    id: '017',
    title: 'SEO metadata helpers',
    milestone: 'M3 — Public Content',
    labels: ['epic:public-content', 'priority:mvp', 'type:feature'],
    summary: 'generateMetadata for articles with OG, Twitter, and canonical URLs.',
    acceptance: [
      'title and description from seoTitle/seoDescription or fallbacks',
      'Open Graph image from ogImage or coverImage',
      'canonical URL supported',
    ],
    deps: ['#15'],
    files: ['src/lib/seo.ts'],
  },
  {
    id: '018',
    title: 'V2: RSS feed',
    milestone: null,
    labels: ['epic:public-content', 'priority:v2', 'type:feature'],
    summary: 'Optional `/rss.xml` for RSS readers. The site works fine without it.',
    acceptance: [
      'Feed lists published articles with title, excerpt, date, and link',
      'Drafts excluded',
    ],
    deps: ['#14'],
    files: ['src/app/(frontend)/rss.xml/route.ts'],
  },
  {
    id: '019',
    title: 'Sitemap + robots.txt',
    milestone: 'M3 — Public Content',
    labels: ['epic:public-content', 'priority:mvp', 'type:feature'],
    summary: 'Dynamic sitemap and robots.txt for public routes.',
    acceptance: [
      'Sitemap includes articles and static public routes',
      'Drafts excluded',
      'robots.txt allows indexing of public content',
    ],
    deps: ['#14'],
    files: ['src/app/(public)/sitemap.ts', 'src/app/(public)/robots.ts'],
  },
  {
    id: '020',
    title: 'V2: Preview drafts in browser',
    milestone: null,
    labels: ['epic:public-content', 'priority:v2', 'type:feature'],
    summary:
      'Only if previewing outside `/admin` matters. For solo publishing, the admin editor is enough.',
    acceptance: [
      'Logged-in admin can view a draft at a preview URL',
      'Preview is noindex',
      'Visitors cannot see drafts',
    ],
    deps: ['#15'],
    files: ['src/app/(frontend)/preview/[slug]/page.tsx'],
  },
  // Epic 4 — Desktop UI
  {
    id: '021',
    title: 'Design tokens + win95.css',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'Win95 colours and bevel CSS — the visual foundation for the desktop.',
    acceptance: [
      'CSS variables for grey, pink/purple accent, title bar colours',
      'Raised/inset border utilities work',
    ],
    files: ['src/styles/win95.css'],
  },
  {
    id: '022',
    title: 'Boot screen + reduced motion',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'Short boot when entering the site. Skip animation if prefers-reduced-motion.',
    acceptance: [
      'Shows custardsquare.exe startup lines',
      'Continues to desktop/login',
      'Reduced motion skips typing animation',
    ],
    files: ['src/components/desktop/BootScreen.tsx'],
  },
  {
    id: '023',
    title: 'Decorative login screen',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'Fake visitor login — cosmetic only. Click through to the desktop. Not real auth.',
    acceptance: [
      'Submitting the form enters the desktop',
      'Separate from `/admin` Payload login',
    ],
    files: ['src/components/desktop/DesktopExperience.tsx'],
  },
  {
    id: '024',
    title: 'Desktop shell + wallpaper',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'Full-screen desktop with dream vaporwave wallpaper. CSS gradient is fine for MVP.',
    acceptance: [
      'Desktop fills the viewport',
      'Area ready for icons and windows',
    ],
    files: ['src/components/desktop/DesktopShell.tsx'],
  },
  {
    id: '025',
    title: 'Desktop icons + keyboard nav',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'Desktop icons that open apps. Click and Enter both work.',
    acceptance: [
      'Icons use assets from `public/icons/`',
      'Click or Enter opens the app window',
    ],
    files: ['src/components/desktop/DesktopIcon.tsx'],
  },
  {
    id: '026',
    title: 'Desktop UI state (Zustand)',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'In-memory state for open windows and focus. Saving layout to localStorage is V2 (#55).',
    acceptance: [
      'Track which windows are open',
      'Active window focus works',
    ],
    files: ['src/lib/desktopStore.ts'],
  },
  {
    id: '027',
    title: 'Window manager + WinWindow',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'Basic draggable windows with title bar. Open, close, minimize. Good enough beats perfect.',
    acceptance: [
      'Windows open and close',
      'Active/inactive title bar styles',
      'Draggable on desktop',
    ],
    files: [
      'src/components/desktop/WindowManager.tsx',
      'src/components/ui95/WinWindow.tsx',
    ],
  },
  {
    id: '028',
    title: 'Taskbar + clock',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'Win95 taskbar with open-window buttons and a clock.',
    acceptance: [
      'Clock shows local time',
      'Open windows appear in the taskbar',
      'Clicking taskbar button focuses/restores window',
    ],
    files: ['src/components/desktop/Taskbar.tsx'],
  },
  {
    id: '029',
    title: 'Start menu navigation',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'Start button opens a menu of apps and links.',
    acceptance: [
      'Start button toggles menu',
      'Menu items open windows or routes',
    ],
    files: ['src/components/desktop/StartMenu.tsx'],
  },
  {
    id: '030',
    title: 'Shutdown dialog',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'Fun Shut Down dialog — log off, restart, go outside, cancel.',
    acceptance: [
      'Log off returns to login/boot',
      'Cancel closes dialog',
    ],
    files: ['src/components/desktop/ShutdownDialog.tsx'],
  },
  // Epic 5 — Desktop Apps
  {
    id: '031',
    title: 'Articles window',
    milestone: 'M5 — Desktop Apps',
    labels: ['epic:desktop-apps', 'priority:mvp', 'type:feature'],
    summary: 'Desktop app listing published articles with a link to the full page.',
    acceptance: [
      'Published articles appear in a list',
      'Click opens `/articles/[slug]` or shows preview',
    ],
    deps: ['#14', '#27'],
    files: ['src/components/windows/ArticlesWindow.tsx'],
  },
  {
    id: '032',
    title: 'About window',
    milestone: 'M5 — Desktop Apps',
    labels: ['epic:desktop-apps', 'priority:mvp', 'type:feature'],
    summary:
      'About Grace — name, bio, and portrait editable in SiteSettings. LinkedIn from social links.',
    acceptance: [
      'About text renders in a window',
      'Links work',
      'Admin can edit About name, bio, and portrait in SiteSettings',
    ],
    deps: ['#10'],
    files: [
      'src/components/windows/AboutWindow.tsx',
      'src/globals/SiteSettings.ts',
      'public/brand/about-portrait.png',
    ],
  },
  {
    id: '033',
    title: 'Skills window',
    milestone: 'M5 — Desktop Apps',
    labels: ['epic:desktop-apps', 'priority:mvp', 'type:feature'],
    summary: 'Skills as a simple System Properties-style panel. Plain grouped text is fine.',
    acceptance: ['Skills content from SiteSettings renders', 'Readable on desktop and mobile'],
    deps: ['#10'],
    files: ['src/components/windows/SkillsWindow.tsx'],
  },
  {
    id: '034',
    title: 'Resume window',
    milestone: 'M5 — Desktop Apps',
    labels: ['epic:desktop-apps', 'priority:mvp', 'type:feature'],
    summary:
      'Notepad-style resume from SiteSettings (seeded from gracie-resume-jul26.pdf). Monospace text + PDF download.',
    acceptance: [
      'Resume text renders',
      'Link to download or plain text view',
      'Admin can edit resume body and optional PDF in SiteSettings',
    ],
    deps: ['#10'],
    files: [
      'src/components/windows/ResumeWindow.tsx',
      'src/globals/SiteSettings.ts',
      'src/lib/default-resume.ts',
      'public/brand/gracie-resume-jul26.pdf',
    ],
  },
  {
    id: '035',
    title: 'Credits window',
    milestone: 'M5 — Desktop Apps',
    labels: ['epic:desktop-apps', 'priority:mvp', 'type:feature'],
    summary: 'Show credits from SiteSettings (aconfuseddragon icons + Microsoft disclaimer).',
    acceptance: [
      'Credits display in a window',
      'Optional plain `/credits` page for mobile',
    ],
    deps: ['#10'],
    files: ['src/components/windows/CreditsWindow.tsx'],
  },
  {
    id: '036',
    title: 'Search window',
    milestone: 'M5 — Desktop Apps',
    labels: ['epic:desktop-apps', 'priority:mvp', 'type:feature'],
    summary: 'Filter published articles by title/excerpt. Client-side filter is fine for MVP.',
    acceptance: [
      'Typing filters the article list',
      'Results link to article pages',
    ],
    deps: ['#14'],
    files: ['src/components/windows/SearchWindow.tsx'],
  },
  {
    id: '037',
    title: 'Terminal window (fun)',
    milestone: 'M5 — Desktop Apps',
    labels: ['epic:desktop-apps', 'priority:mvp', 'type:feature'],
    summary: 'Cosmetic terminal with a handful of commands (`help`, `open`, `articles`). Flavour, not a real shell.',
    acceptance: [
      '`help` lists commands',
      '`open articles` opens Articles window',
    ],
    files: ['src/components/windows/TerminalWindow.tsx'],
  },
  {
    id: '038',
    title: 'Notes + Projects placeholders',
    milestone: 'M5 — Desktop Apps',
    labels: ['epic:desktop-apps', 'priority:mvp', 'type:feature'],
    summary: '"Coming soon" windows until V2 collections exist. Icons can still appear on desktop.',
    acceptance: [
      'Windows open without errors',
      'Friendly coming-soon message shown',
    ],
    files: ['src/components/windows/NotesWindow.tsx', 'src/components/windows/ProjectsWindow.tsx'],
  },
  // Epic 6 — Responsive & A11y
  {
    id: '039',
    title: 'Mobile app grid',
    milestone: 'M6 — Responsive & A11y',
    labels: ['epic:a11y-responsive', 'priority:mvp', 'type:feature'],
    summary: 'On small screens, show an app grid instead of a tiny draggable desktop.',
    acceptance: [
      'Mobile layout is usable',
      'Tapping an app opens it full-screen',
    ],
    files: ['src/components/desktop/DesktopShell.tsx'],
  },
  {
    id: '040',
    title: 'Mobile full-screen panels',
    milestone: 'M6 — Responsive & A11y',
    labels: ['epic:a11y-responsive', 'priority:mvp', 'type:feature'],
    summary: 'Windows become full-screen panels on mobile. No dragging.',
    acceptance: ['Close button always visible', 'Drag disabled on small screens'],
    deps: ['#39'],
  },
  {
    id: '041',
    title: 'Keyboard basics',
    milestone: 'M6 — Responsive & A11y',
    labels: ['epic:a11y-responsive', 'priority:mvp', 'type:feature'],
    summary: 'Tab, Enter, Escape — build this into M4 as you go, not as a separate rewrite.',
    acceptance: [
      'Interactive elements are keyboard reachable',
      'Escape closes menus and dialogs',
    ],
  },
  {
    id: '042',
    title: 'Skip link + window labels',
    milestone: 'M6 — Responsive & A11y',
    labels: ['epic:a11y-responsive', 'priority:mvp', 'type:feature'],
    summary: 'Skip to content link and sensible labels on windows/dialogs.',
    acceptance: [
      'Skip link bypasses decorative chrome',
      'Windows have accessible names',
    ],
  },
  {
    id: '043',
    title: 'Reduced motion',
    milestone: 'M6 — Responsive & A11y',
    labels: ['epic:a11y-responsive', 'priority:mvp', 'type:feature'],
    summary: 'Respect prefers-reduced-motion for boot and window animations.',
    acceptance: [
      'Boot animation simplifies or skips',
      'No essential content hidden behind animation',
    ],
    deps: ['#22'],
  },
  // Epic 7 — Launch Polish
  {
    id: '044',
    title: 'Win95-themed 404 page',
    milestone: 'M7 — Launch Polish',
    labels: ['epic:launch', 'priority:mvp', 'type:feature'],
    summary: 'On-brand 404 with a clear way back home.',
    acceptance: ['404 matches Win95 vibe', 'Link home works'],
    files: ['src/app/(frontend)/not-found.tsx'],
  },
  {
    id: '045',
    title: 'Performance sanity check',
    milestone: 'M7 — Launch Polish',
    labels: ['epic:launch', 'priority:mvp', 'type:chore'],
    summary: 'Quick pass on images and icons before launch. Fix obvious problems only.',
    acceptance: [
      'Article images use reasonable sizes',
      'No major layout shift on homepage or articles',
    ],
  },
  {
    id: '046',
    title: 'Smoke test: site loads',
    milestone: 'M7 — Launch Polish',
    labels: ['epic:launch', 'priority:mvp', 'type:chore'],
    summary: 'One Playwright test proving `/` and `/articles` load. Not full E2E coverage.',
    acceptance: [
      'Test passes: homepage loads',
      'Test passes: articles index loads',
    ],
    files: ['tests/e2e/smoke.spec.ts'],
  },
  {
    id: '047',
    title: 'Launch content checklist',
    milestone: 'M8 — Launch',
    labels: ['epic:launch', 'priority:mvp', 'type:chore'],
    summary: 'Content task, not code. Publish enough that the site feels alive.',
    acceptance: [
      '3+ published articles',
      'About copy written in SiteSettings',
      'Favicon and default OG image set',
      'Icon credits noted',
    ],
  },
  {
    id: '048',
    title: 'Connect custom domain + HTTPS',
    milestone: 'M8 — Launch',
    labels: ['epic:launch', 'priority:mvp', 'type:chore'],
    summary: 'Point domain DNS to Vercel and verify HTTPS.',
    acceptance: ['Custom domain resolves', 'HTTPS works', 'NEXT_PUBLIC_SITE_URL updated'],
    deps: ['#4'],
  },
  {
    id: '049',
    title: 'Archive learning-journey-os',
    milestone: 'M8 — Launch',
    labels: ['epic:launch', 'priority:mvp', 'type:chore'],
    summary: 'Archive the old repo and point its README at custardsquare.exe.',
    acceptance: [
      'learning-journey-os archived on GitHub',
      'README links to custardsquare-exe',
    ],
  },
  // V2 — only if the MVP is live and you want more
  {
    id: '050',
    title: 'V2: Notes collection + window',
    milestone: null,
    labels: ['epic:cms', 'priority:v2', 'type:feature'],
    summary: 'Shorter informal notes — separate from long-form articles.',
    acceptance: ['Notes in Payload', 'Notes window shows published notes'],
  },
  {
    id: '051',
    title: 'V2: Projects collection + window',
    milestone: null,
    labels: ['epic:desktop-apps', 'priority:v2', 'type:feature'],
    summary: 'Project case studies with links. When you have projects worth showcasing.',
    acceptance: ['Projects in Payload', 'Projects window lists them'],
  },
  {
    id: '052',
    title: 'V2: Article series',
    milestone: null,
    labels: ['epic:cms', 'priority:v2', 'type:feature'],
    summary: 'Group related articles into a series. Only when you have multi-part writing.',
    acceptance: ['Series links multiple articles', 'Shown on article pages'],
  },
  {
    id: '053',
    title: 'V2: Better search',
    milestone: null,
    labels: ['epic:desktop-apps', 'priority:v2', 'type:feature'],
    summary: 'Upgrade search when client-side filter feels too limited (Pagefind or similar).',
    acceptance: ['Search covers all public content types'],
  },
  {
    id: '054',
    title: 'V2: Guestbook',
    milestone: null,
    labels: ['epic:launch', 'priority:v2', 'type:feature'],
    summary: 'Public guestbook with moderation. Only if you want visitor messages.',
    acceptance: ['Submissions held for moderation', 'Spam protection'],
  },
  {
    id: '055',
    title: 'V2: Save desktop layout',
    milestone: null,
    labels: ['epic:desktop-ui', 'priority:v2', 'type:feature'],
    summary: 'Remember icon positions and window layout in localStorage.',
    acceptance: ['Layout persists across visits', 'Reset option in Start menu'],
  },
  {
    id: '056',
    title: 'V2: Theme switcher',
    milestone: null,
    labels: ['epic:desktop-ui', 'priority:v2', 'type:feature'],
    summary: 'Toggle dreamy vs classic grey Win95. Fun, not required.',
    acceptance: ['Theme toggle works', 'Preference persists'],
  },
  {
    id: '057',
    title: 'V2: Sketchpad gallery',
    milestone: null,
    labels: ['epic:desktop-apps', 'priority:v2', 'type:feature'],
    summary: 'Gallery window for sketches/doodles from Media.',
    acceptance: ['Gallery shows uploaded images with alt text'],
  },
  {
    id: '058',
    title: 'Brand favicons + desktop wallpaper tile',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary:
      'Wire brand assets: frontend favicon, Payload admin favicon, and a pixel Windows-flag tile over the existing vaporwave desktop wallpaper.',
    acceptance: [
      'Frontend uses `custardsq-favicon` (SiteSettings favicon still overrides when set)',
      'Desktop wallpaper keeps the hazy vaporwave gradient with the flag layered on top (single ornament, not tiled)',
      'Payload admin uses `cms-favicon`',
    ],
    files: [
      'public/brand/custardsq-favicon.png',
      'public/brand/cms-favicon.png',
      'public/brand/desktop-background.png',
      'src/lib/seo.ts',
      'src/styles/desktop.css',
      'src/payload.config.ts',
    ],
  },
  {
    id: '059',
    title: 'custardsquare OS identity + one signature toy',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary:
      'Lean into the named OS brand (wallpaper caption already says custardsquare OS) and ship one signature toy peers use on Win9x portfolios — without a full OS sim.',
    acceptance: [
      'OS identity shows in at least two chrome surfaces (e.g. wallpaper caption + About/shutdown/boot copy)',
      'One signature toy ships (prefer Terminal #37 or a tiny sticky-notes flavour)',
      'Toy is discoverable from Start menu or desktop icon',
    ],
    note: 'Peers: andresmit.co.za, 98-portfolio, willos-98. Soft frame + sharp controls stays the brand. Do not copy 98.js.org scope.',
    deps: ['#27', '#29', '#30'],
    files: [
      'src/components/desktop/DesktopShell.tsx',
      'src/components/desktop/ShutdownDialog.tsx',
      'src/components/desktop/BootScreen.tsx',
      'src/components/windows/TerminalWindow.tsx',
    ],
  },
]

const GUIDING_PRINCIPLE =
  'Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.'

function formatBody(issue) {
  const lines = [`> ${issue.principle || GUIDING_PRINCIPLE}`, '', issue.summary, '', '## Done when']
  lines.push(...issue.acceptance.map((item) => `- [ ] ${item}`))
  if (issue.note) {
    lines.push('', '## Note', issue.note)
  }
  if (issue.deps?.length) {
    lines.push('', '## Depends on', ...issue.deps.map((d) => `- ${d}`))
  }
  if (issue.files?.length) {
    lines.push('', '## Likely files', ...issue.files.map((f) => `- \`${f}\``))
  }
  return lines.join('\n')
}

function syncOpenIssues() {
  const toClose = [
    {
      number: 11,
      reason:
        'Merged into #10. Credits belong in SiteSettings (a simple list or rich text), not a separate collection.',
    },
    {
      number: 12,
      reason:
        'Deferred — solo admin can use drafts and hard delete. Reopen as V2 only if delete-without-undo becomes a real problem.',
    },
    {
      number: 18,
      reason:
        'Deferred to V2. Articles work fine on the web; RSS is optional nicety, not launch-critical.',
    },
  ]

  for (const { number, reason } of toClose) {
    execSync(
      `gh issue close ${number} --repo ${REPO} --comment "${reason.replace(/"/g, '\\"')}"`,
      { stdio: 'inherit' },
    )
  }

  const skip = new Set([11, 12, 18])
  const openOnGithub = new Set(
    JSON.parse(
      execSync(`gh issue list --repo ${REPO} --state open --limit 100 --json number`, {
        encoding: 'utf8',
      }),
    ).map((i) => i.number),
  )

  for (const issue of issues) {
    const number = parseInt(issue.id, 10)
    if (skip.has(number) || !openOnGithub.has(number)) {
      continue
    }

    const bodyPath = path.join(DOCS_DIR, `_sync-body-${issue.id}.md`)
    writeFileSync(bodyPath, formatBody(issue))

    const args = [
      'gh',
      'issue',
      'edit',
      String(number),
      '--repo',
      REPO,
      '--title',
      issue.title,
      '--body-file',
      bodyPath,
    ]

    for (const label of issue.labels) {
      args.push('--add-label', label)
    }

    if (issue.labels.includes('priority:v2')) {
      args.push('--remove-label', 'priority:mvp')
    }

    if (issue.milestone) {
      args.push('--milestone', issue.milestone)
    } else {
      args.push('--remove-milestone')
    }

    execSync(args.map((a) => (a.includes(' ') ? `"${a.replace(/"/g, '\\"')}"` : a)).join(' '), {
      stdio: 'inherit',
    })

    unlinkSync(bodyPath)

    console.log(`Updated #${number}: ${issue.title}`)
  }
}

function writeDocs() {
  mkdirSync(DOCS_DIR, { recursive: true })
  for (const issue of issues) {
    const slug = issue.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const filename = `${issue.id}-${slug}.md`
    const meta = {
      title: issue.title,
      labels: issue.labels,
      milestone: issue.milestone,
    }
    const content = `---\njson: ${JSON.stringify(meta)}\n---\n\n${formatBody(issue)}\n`
    writeFileSync(path.join(DOCS_DIR, filename), content)

    // Remove stale docs when an issue title (and slug) changes.
    const prefix = `${issue.id}-`
    for (const existing of readdirSync(DOCS_DIR)) {
      if (existing.startsWith(prefix) && existing !== filename && existing.endsWith('.md')) {
        unlinkSync(path.join(DOCS_DIR, existing))
      }
    }
  }
  writeFileSync(
    path.join(DOCS_DIR, 'README.md'),
    `# GitHub Issues Manifest

This folder contains one markdown file per GitHub issue for **custardsquare.exe**.

## Guiding principle

Solo-admin site. **Content first → desktop second → magic third.** Ship the simplest version that works.

## Usage

\`\`\`bash
node scripts/github-issues.mjs --docs   # regenerate docs/issues/*.md
node scripts/github-issues.mjs --sync   # push open issue text to GitHub
node scripts/github-issues.mjs --create # create missing GitHub issues
\`\`\`

Each file is named \`NNN-slug.md\` and includes YAML frontmatter with title, labels, and milestone.

## Issue count

- **MVP issues:** 001–049 (${issues.filter((i) => i.labels.includes('priority:mvp')).length})
- **V2 issues:** 050–057+ (${issues.filter((i) => i.labels.includes('priority:v2')).length})
`,
  )
}

function createIssues() {
  const existing = execSync(`gh issue list --repo ${REPO} --limit 200 --json title`, {
    encoding: 'utf8',
  })
  const existingTitles = new Set(JSON.parse(existing).map((i) => i.title))

  for (const issue of issues) {
    if (existingTitles.has(issue.title)) {
      console.log(`Skip (exists): ${issue.title}`)
      continue
    }
    const bodyFile = path.join(
      DOCS_DIR,
      `${issue.id}-${issue.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')}.md`,
    )
    const labelArgs = issue.labels.flatMap((l) => ['--label', l])
    const milestoneArg = issue.milestone ? ['--milestone', issue.milestone] : []
    execSync(
      [
        'gh',
        'issue',
        'create',
        '--repo',
        REPO,
        '--title',
        issue.title,
        '--body-file',
        bodyFile,
        ...labelArgs,
        ...milestoneArg,
      ]
        .map((a) => (a.includes(' ') ? `"${a.replace(/"/g, '\\"')}"` : a))
        .join(' '),
      { stdio: 'inherit' },
    )
    console.log(`Created: ${issue.title}`)
  }
}

const args = process.argv.slice(2)
writeDocs()
if (args.includes('--sync')) {
  syncOpenIssues()
} else if (args.includes('--create')) {
  createIssues()
} else if (!args.includes('--docs')) {
  console.log('Wrote docs/issues/*.md')
  console.log('  --sync   update open GitHub issues from manifest')
  console.log('  --create create missing GitHub issues')
}
