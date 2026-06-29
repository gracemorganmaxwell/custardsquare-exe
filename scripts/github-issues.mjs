import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
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
    title: 'Add CI: typecheck + lint + Vitest',
    milestone: 'M1 — Foundation',
    labels: ['epic:foundation', 'priority:mvp', 'type:chore'],
    summary: 'GitHub Actions workflow for lint, typecheck, and unit tests on push/PR.',
    acceptance: [
      'CI runs on push to main and on pull requests',
      'pnpm lint passes',
      'pnpm test:int passes',
    ],
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
    title: 'Topics + Tags collections',
    milestone: 'M2 — CMS Schema',
    labels: ['epic:cms', 'priority:mvp', 'type:feature'],
    summary: 'Folder-like Topics and flexible Tags linked to Articles.',
    acceptance: [
      'Admin can create topics and tags',
      'Admin can assign topics/tags to articles',
      'Public article page will display topics/tags',
    ],
    deps: ['#7'],
    files: ['src/collections/Topics.ts', 'src/collections/Tags.ts'],
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
    summary: 'Global settings for boot lines, about, skills, resume, social links, wallpaper.',
    acceptance: [
      'Admin can edit site title and description',
      'Boot message lines configurable',
      'About, skills, resume content editable',
      'Contact/social links stored here',
    ],
    files: ['src/globals/SiteSettings.ts'],
  },
  {
    id: '011',
    title: 'Credits collection',
    milestone: 'M2 — CMS Schema',
    labels: ['epic:cms', 'priority:mvp', 'type:feature'],
    summary: 'Asset and inspiration credits including aconfuseddragon icon packs.',
    acceptance: [
      'Admin can add credit entries',
      'Credit types: icon, font, inspiration, library, image, sound',
      'Display order supported',
    ],
    files: ['src/collections/Credits.ts'],
  },
  {
    id: '012',
    title: 'Soft delete fields + restore workflow',
    milestone: 'M2 — CMS Schema',
    labels: ['epic:cms', 'priority:mvp', 'type:feature'],
    summary: 'Add softDeletedAt, deletedReason, restoredAt to Articles and filter publicly.',
    acceptance: [
      'Soft-deleted articles hidden from public queries',
      'Admin can view soft-deleted articles',
      'Admin can restore article to draft',
    ],
    deps: ['#7'],
    files: ['src/collections/Articles.ts', 'src/lib/access.ts'],
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
    title: 'RSS feed',
    milestone: 'M3 — Public Content',
    labels: ['epic:public-content', 'priority:mvp', 'type:feature'],
    summary: 'RSS feed at /rss.xml with latest published articles.',
    acceptance: [
      'RSS includes title, excerpt, date, canonical link',
      'Drafts and soft-deleted excluded',
    ],
    deps: ['#14'],
    files: ['src/app/(public)/rss.xml/route.ts'],
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
    title: 'Draft preview route (admin-gated)',
    milestone: 'M3 — Public Content',
    labels: ['epic:public-content', 'priority:mvp', 'type:feature'],
    summary: 'Protected /preview/[slug] route for admin draft preview.',
    acceptance: [
      'Unauthenticated visitors cannot view drafts',
      'Admin can preview draft article',
      'Preview not indexed (noindex)',
    ],
    deps: ['#15'],
    files: ['src/app/preview/[slug]/page.tsx'],
  },
  // Epic 4 — Desktop UI
  {
    id: '021',
    title: 'Design tokens + win95.css',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'Win95 bevel tokens, dream pink/purple palette, global CSS utilities.',
    acceptance: [
      'CSS custom properties for win-grey, dream-pink, title-active colours',
      'Bevel border utilities for raised/inset panels',
    ],
    files: ['src/styles/win95.css', 'src/styles/globals.css'],
  },
  {
    id: '022',
    title: 'Boot screen + reduced motion',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'Boot sequence with typing animation; skip when prefers-reduced-motion.',
    acceptance: [
      'Displays Starting custardsquare.exe... lines',
      'Transitions to desktop/login',
      'Reduced motion skips animation',
    ],
    files: ['src/components/desktop/BootScreen.tsx'],
  },
  {
    id: '023',
    title: 'Decorative login screen',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'Fake public login (visitor/password) — not real auth.',
    acceptance: [
      'Login form is decorative only',
      'Submit enters desktop',
      'Separate from /admin Payload login',
    ],
    files: ['src/components/desktop/LoginScreen.tsx'],
  },
  {
    id: '024',
    title: 'Desktop shell + wallpaper',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'Full-screen desktop with hazy pink/purple vaporwave wallpaper.',
    acceptance: [
      'Desktop fills viewport',
      'Wallpaper from CSS gradient or SiteSettings image',
      'Icon grid area ready',
    ],
    files: ['src/components/desktop/DesktopShell.tsx', 'src/styles/desktop.css'],
  },
  {
    id: '025',
    title: 'Desktop icons + keyboard nav',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'Clickable desktop icons with select, double-click open, Enter key, focus ring.',
    acceptance: [
      'Icons render with aconfuseddragon assets',
      'Keyboard focus and Enter opens app',
      'Double-click opens window',
    ],
    files: ['src/components/desktop/DesktopIcon.tsx'],
  },
  {
    id: '026',
    title: 'Zustand desktop store + persistence',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'Window state store with localStorage for safe UI prefs only.',
    acceptance: [
      'openWindows, activeWindowId, minimized/maximized tracked',
      'theme, soundEnabled, windowPositions persist',
      'No CMS/session data in localStorage',
    ],
    files: ['src/lib/desktopStore.ts'],
  },
  {
    id: '027',
    title: 'Window manager + WinWindow',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'Draggable, resizable windows with title bar, focus, z-index.',
    acceptance: [
      'Windows open, close, minimize, maximize',
      'Active/inactive title bar states',
      'Draggable title bar on desktop',
    ],
    files: ['src/components/desktop/WindowManager.tsx', 'src/components/ui95/WinWindow.tsx'],
  },
  {
    id: '028',
    title: 'Taskbar + clock + system tray',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'Win95 taskbar with open window buttons and live local clock.',
    acceptance: [
      'Clock updates every minute',
      'Open windows appear in taskbar',
      'Minimized windows restore from taskbar',
    ],
    files: ['src/components/desktop/Taskbar.tsx', 'src/components/desktop/Clock.tsx'],
  },
  {
    id: '029',
    title: 'Start menu navigation',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'Start button opens hierarchical menu linking to apps and routes.',
    acceptance: [
      'Start button toggles menu',
      'Menu items open windows and close menu',
      'Keyboard navigation works',
    ],
    files: ['src/components/desktop/StartMenu.tsx'],
  },
  {
    id: '030',
    title: 'Shutdown dialog flow',
    milestone: 'M4 — Desktop Shell',
    labels: ['epic:desktop-ui', 'priority:mvp', 'type:feature'],
    summary: 'Shut Down modal with log off, restart, go outside, cancel options.',
    acceptance: [
      'Log off returns to boot/login',
      'Restart replays boot sequence',
      'Go outside shows wholesome message',
      'Cancel closes dialog',
    ],
    files: ['src/components/desktop/ShutdownDialog.tsx'],
  },
  // Epic 5 — Desktop Apps
  {
    id: '031',
    title: 'Articles window + preview pane',
    milestone: 'M5 — Desktop Apps',
    labels: ['epic:desktop-apps', 'priority:mvp', 'type:feature'],
    summary: 'Desktop app to browse articles with preview and link to full page.',
    acceptance: [
      'Published articles appear in list',
      'Preview opens in window',
      'Link to /articles/[slug] for full reading',
    ],
    deps: ['#14', '#27'],
    files: ['src/components/windows/ArticlesWindow.tsx'],
  },
  {
    id: '032',
    title: 'About window',
    milestone: 'M5 — Desktop Apps',
    labels: ['epic:desktop-apps', 'priority:mvp', 'type:feature'],
    summary: 'About Grace content from SiteSettings global.',
    acceptance: ['About content renders', 'Links work', 'Mobile fallback to /about route'],
    deps: ['#10'],
    files: ['src/components/windows/AboutWindow.tsx'],
  },
  {
    id: '033',
    title: 'Skills window (System Properties tabs)',
    milestone: 'M5 — Desktop Apps',
    labels: ['epic:desktop-apps', 'priority:mvp', 'type:feature'],
    summary: 'Skills displayed as Control Panel > System Properties with tabs.',
    acceptance: ['Skills grouped by category tabs', 'Keyboard accessible tabs'],
    deps: ['#10'],
    files: ['src/components/windows/SkillsWindow.tsx'],
  },
  {
    id: '034',
    title: 'Resume.txt Notepad window',
    milestone: 'M5 — Desktop Apps',
    labels: ['epic:desktop-apps', 'priority:mvp', 'type:feature'],
    summary: 'Monospace Notepad-style resume from SiteSettings.',
    acceptance: ['Resume text renders', 'Last updated date shown'],
    deps: ['#10'],
    files: ['src/components/windows/ResumeWindow.tsx'],
  },
  {
    id: '035',
    title: 'Credits window + /credits page',
    milestone: 'M5 — Desktop Apps',
    labels: ['epic:desktop-apps', 'priority:mvp', 'type:feature'],
    summary: 'Credits for aconfuseddragon icons with license note and Microsoft disclaimer.',
    acceptance: [
      'aconfuseddragon credited with itch.io links',
      'Not affiliated with Microsoft note included',
      'Credits page at /credits',
    ],
    deps: ['#11'],
    files: ['src/components/windows/CreditsWindow.tsx', 'src/app/(public)/credits/page.tsx'],
  },
  {
    id: '036',
    title: 'Search window (DB search MVP)',
    milestone: 'M5 — Desktop Apps',
    labels: ['epic:desktop-apps', 'priority:mvp', 'type:feature'],
    summary: 'Site search by title, excerpt, tags, topics via Postgres query.',
    acceptance: [
      'Search returns matching published articles',
      'Results link to article pages',
      'Empty state exists',
    ],
    deps: ['#14'],
    files: ['src/components/windows/SearchWindow.tsx', 'src/lib/search.ts'],
  },
  {
    id: '037',
    title: 'Terminal window (command palette)',
    milestone: 'M5 — Desktop Apps',
    labels: ['epic:desktop-apps', 'priority:mvp', 'type:feature'],
    summary: 'Fun but useful terminal with help, open, search, theme, shutdown commands.',
    acceptance: [
      'help lists available commands',
      'open articles/notes/about work',
      'search query opens search results',
      'shutdown/restart trigger dialog flow',
    ],
    files: ['src/components/windows/TerminalWindow.tsx'],
  },
  {
    id: '038',
    title: 'Notes + Projects windows (placeholder)',
    milestone: 'M5 — Desktop Apps',
    labels: ['epic:desktop-apps', 'priority:mvp', 'type:feature'],
    summary: 'Placeholder windows until V2 Notes and Projects collections exist.',
    acceptance: [
      'Windows open from desktop icons',
      'Coming soon message shown',
      'No broken data fetching',
    ],
    files: ['src/components/windows/NotesWindow.tsx', 'src/components/windows/ProjectsWindow.tsx'],
  },
  // Epic 6 — Responsive & A11y
  {
    id: '039',
    title: 'Mobile app-grid layout',
    milestone: 'M6 — Responsive & A11y',
    labels: ['epic:a11y-responsive', 'priority:mvp', 'type:feature'],
    summary: 'Replace draggable desktop with app grid on small screens.',
    acceptance: [
      'Mobile shows custardsquare.exe app grid',
      'No tiny dragged desktop on phone',
      'Apps open as full-screen panels',
    ],
    files: ['src/components/desktop/DesktopShell.tsx'],
  },
  {
    id: '040',
    title: 'Full-screen mobile panels (no drag)',
    milestone: 'M6 — Responsive & A11y',
    labels: ['epic:a11y-responsive', 'priority:mvp', 'type:feature'],
    summary: 'Windows become full-screen panels on mobile; dragging disabled.',
    acceptance: ['Drag disabled below tablet breakpoint', 'Close button always visible'],
    deps: ['#39'],
  },
  {
    id: '041',
    title: 'Keyboard navigation + focus management',
    milestone: 'M6 — Responsive & A11y',
    labels: ['epic:a11y-responsive', 'priority:mvp', 'type:feature'],
    summary: 'Tab order, Enter to open, Escape to close, focus trap in modals.',
    acceptance: [
      'Tab order is logical across desktop',
      'Escape closes dialog/window where appropriate',
      'Focus visible on all interactive elements',
    ],
  },
  {
    id: '042',
    title: 'Skip link + ARIA on windows',
    milestone: 'M6 — Responsive & A11y',
    labels: ['epic:a11y-responsive', 'priority:mvp', 'type:feature'],
    summary: 'Skip to content link and dialog landmarks on windows.',
    acceptance: [
      'Skip link bypasses desktop chrome',
      'Windows use role=dialog and aria-labelledby',
      'Focus moves into window on open',
    ],
  },
  {
    id: '043',
    title: 'prefers-reduced-motion across boot/windows',
    milestone: 'M6 — Responsive & A11y',
    labels: ['epic:a11y-responsive', 'priority:mvp', 'type:feature'],
    summary: 'Respect reduced motion for boot, window open, and transitions.',
    acceptance: [
      'Boot animation simplifies',
      'Window bounce/transitions reduced',
      'No essential content depends on animation',
    ],
    deps: ['#22'],
  },
  // Epic 7 — Launch Polish
  {
    id: '044',
    title: 'Win95-themed 404 page',
    milestone: 'M7 — Launch Polish',
    labels: ['epic:launch', 'priority:mvp', 'type:feature'],
    summary: 'Fake system error 404 with clear path back to desktop.',
    acceptance: ['404 matches Win95 theme', 'Accessible error text', 'Link home works'],
    files: ['src/app/(public)/not-found.tsx'],
  },
  {
    id: '045',
    title: 'Performance pass (icons, images, LCP)',
    milestone: 'M7 — Launch Polish',
    labels: ['epic:launch', 'priority:mvp', 'type:chore'],
    summary: 'Optimise icon sizes, image loading, and layout shift.',
    acceptance: [
      'Icons appropriately sized',
      'Lighthouse performance acceptable',
      'No major CLS on homepage and articles',
    ],
  },
  {
    id: '046',
    title: 'Playwright E2E smoke tests',
    milestone: 'M7 — Launch Polish',
    labels: ['epic:launch', 'priority:mvp', 'type:chore'],
    summary: 'E2E tests for desktop boot, articles, admin gate, mobile layout.',
    acceptance: [
      'Visitor can open desktop and Articles window',
      'Draft article not public',
      'Mobile layout smoke test passes',
    ],
    files: ['tests/e2e/'],
  },
  {
    id: '047',
    title: 'Launch content checklist',
    milestone: 'M8 — Launch',
    labels: ['epic:launch', 'priority:mvp', 'type:chore'],
    summary: 'Pre-launch content: 3-5 articles, about, skills, resume, credits, OG, favicon.',
    acceptance: [
      '3-5 published articles live',
      'About and skills content complete',
      'OG image and favicon set',
      'All credits attributed',
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
    title: 'Archive learning-journey-os with redirect note',
    milestone: 'M8 — Launch',
    labels: ['epic:launch', 'priority:mvp', 'type:chore'],
    summary: 'Archive old repo and add README pointer to custardsquare-exe.',
    acceptance: [
      'learning-journey-os archived on GitHub',
      'README points to custardsquare-exe',
    ],
  },
  // V2
  {
    id: '050',
    title: 'V2: Notes collection + Notes window',
    milestone: null,
    labels: ['epic:cms', 'priority:v2', 'type:feature'],
    summary: 'Shorter learning notes collection with public/private/unlisted visibility.',
    acceptance: [
      'Notes collection in Payload',
      'Notes window shows real published notes',
      'Less formal than articles',
    ],
  },
  {
    id: '051',
    title: 'V2: Projects collection + Projects window',
    milestone: null,
    labels: ['epic:desktop-apps', 'priority:v2', 'type:feature'],
    summary: 'Project case studies and build logs with tech stack and links.',
    acceptance: [
      'Projects collection in Payload',
      'Projects window shows published projects',
      'GitHub and live demo links work',
    ],
  },
  {
    id: '052',
    title: 'V2: Series collection',
    milestone: null,
    labels: ['epic:cms', 'priority:v2', 'type:feature'],
    summary: 'Grouped writing series linking multiple articles.',
    acceptance: ['Series collection with ordered articles', 'Series displayed on article pages'],
  },
  {
    id: '053',
    title: 'V2: Pagefind or Meilisearch search upgrade',
    milestone: null,
    labels: ['epic:desktop-apps', 'priority:v2', 'type:feature'],
    summary: 'Upgrade from DB search to static index or dedicated search service.',
    acceptance: ['Faster search', 'Covers notes and projects when collections exist'],
  },
  {
    id: '054',
    title: 'V2: Guestbook with moderation + Turnstile',
    milestone: null,
    labels: ['epic:launch', 'priority:v2', 'type:feature'],
    summary: 'Public guestbook with spam protection and admin moderation.',
    acceptance: [
      'Guestbook collection with moderationStatus',
      'Turnstile on submit form',
      'Rate limiting on public endpoint',
    ],
  },
  {
    id: '055',
    title: 'V2: Desktop layout persistence',
    milestone: null,
    labels: ['epic:desktop-ui', 'priority:v2', 'type:feature'],
    summary: 'Persist icon positions and window layout in localStorage.',
    acceptance: ['Icon positions saved', 'Reset desktop option in Start menu'],
  },
  {
    id: '056',
    title: 'V2: Theme switcher (dreamy/classic)',
    milestone: null,
    labels: ['epic:desktop-ui', 'priority:v2', 'type:feature'],
    summary: 'Toggle between dreamy vaporwave and classic grey Win95 theme.',
    acceptance: ['Theme toggle in Start menu Settings', 'Preference persists'],
  },
  {
    id: '057',
    title: 'V2: Sketchpad gallery from Media',
    milestone: null,
    labels: ['epic:desktop-apps', 'priority:v2', 'type:feature'],
    summary: 'Paint-style gallery window for sketches and UI doodles from Media uploads.',
    acceptance: ['Sketchpad window shows media gallery', 'Captions and alt text displayed'],
  },
]

function formatBody(issue) {
  const lines = [
    issue.summary,
    '',
    '## Acceptance criteria',
    ...issue.acceptance.map((item) => `- [ ] ${item}`),
  ]
  if (issue.deps?.length) {
    lines.push('', '## Dependencies', ...issue.deps.map((d) => `- ${d}`))
  }
  if (issue.files?.length) {
    lines.push('', '## Key files', ...issue.files.map((f) => `- \`${f}\``))
  }
  return lines.join('\n')
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
  }
  writeFileSync(
    path.join(DOCS_DIR, 'README.md'),
    `# GitHub Issues Manifest

This folder contains one markdown file per GitHub issue for **custardsquare.exe**.

## Usage

Generate/update docs and create GitHub issues:

\`\`\`bash
node scripts/github-issues.mjs --docs
node scripts/github-issues.mjs --create
\`\`\`

Each file is named \`NNN-slug.md\` and includes YAML frontmatter with title, labels, and milestone.

## Issue count

- **MVP issues:** 001–049 (${issues.filter((i) => i.labels.includes('priority:mvp')).length})
- **V2 issues:** 050–057 (${issues.filter((i) => i.labels.includes('priority:v2')).length})
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
if (args.includes('--create')) {
  createIssues()
} else if (!args.includes('--docs')) {
  console.log('Wrote docs/issues/*.md — run with --create to create GitHub issues')
}
