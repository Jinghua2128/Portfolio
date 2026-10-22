# PROJECT_MAP — Portfolio

Initial setup inventory: 2026-10-09 11:30 SGT; root Blog/allowlist reconciled on 2026-10-18 and rechecked 2026-10-19. Root: `/Users/longmai2128/Portfolio`.

## Identity and entry points

- Type: Static HTML/CSS/JavaScript site with Firebase integration and a separate editorial variant.
- Branch: `main`; HEAD: `54355ea730198556dea1f04f47151022eaa4303a`.
- Open/run: `python3 -m http.server 8765 --bind 127.0.0.1` per README.md, but first verify the port is actually this repository. On 22 October 8765 was held by an unrelated app; the repo was served and verified on `127.0.0.1:8766`. Root Blog preview and related regression checks ran on 18 and 22 October; see HANDOFF.md for exact scope.
- This map records inspected paths and source references, not fresh runtime or cloud certification. See dated evidence in HANDOFF.md.

## Canonical locations

| Path | Purpose | Verification scope |
| --- | --- | --- |
| `index.html` | Root Home; three static featured cards and focus panel. | HTML/script references inspected; historical rendered checks in handoff |
| `about.html`, `contact.html` | Root biography and contact pages. | Existing routes; preserve approved content and links |
| `projects.html`, `projects-firebase.js` | Public project listing, details and text case studies; shared project rendering/editor logic. | HTML references inspected; no live-write certification |
| `blog.html`, `blog-firebase.js` | Public journal/full-page article shell and comment account flow; shared Firebase post/editor logic. | Public routes and signed-out comments/admin gate checked on 18 October; no live-write certification |
| `blog-page.js`, `blog-page.css` | Root-only journal presentation: topic/search filters, cards, query routing, history, copying links, image fallback and responsive reading layout. | Loaded before the root Firebase controller; not loaded by admin/editorial. URLs preserve existing post IDs; no content migration |
| `styles.css`, `script.js` | Shared root appearance, navigation, drawers and interactions. | Referenced by root pages; JS syntax checked |
| `project-catalog.js`, `content-order.js`, `project-highlights.js`, `project-highlights.css` | Catalog/display policy, ordering and featured/status views. | Root/shared helpers; 21 retained/eight public built-ins verified on 7 October |
| `editor-tools.js`, `editor-tools.css`, `image-upload.js`, `image-upload.css`, `project-management.js` | Editor validation/drafts, explicit uploads and record management. | Existing shared helpers; Storage/live writes still pending |
| `immersion.html`, `immersion.js`, `immersion.css` | Opt-in Sketchfab 3D Work page. | Existing route; preserve approved embeds |
| `admin/index.html`, `admin/admin.js` | Owner sign-in entry and client gate. | Paths and references inspected; rules are the real write boundary |
| `admin/projects.html`, `admin/blog.html`, `admin/editor-bootstrap.js` | Inert editor templates, owner-gated bootstrap and shared script loading. | Editor pages use `<base href="../">`; auth was previously mock-tested only |
| `editorial-portfolio/` | Separate five-page site; own styles/scripts and `home-projects.js`; shares root helpers/media. | Preserve variant and case-sensitive relative references |
| `firebase-fallback.js` | Safe inert globals when browser config is absent. | Shared fallback, not a replacement Firebase configuration |
| `firebase-config.js`, `editorial-portfolio/firebase-config.js` | Local browser configuration, intentionally ignored. | Byte-identical and ignored on 9 October; never copy contents into memory |
| `firebase-config.example.js` | Placeholder configuration template. | Not a working cloud project |
| `firestore.rules`, `firebase.json` | Local Firestore rule source and CLI rules declaration. | JSON has no Hosting target; live state not rechecked today |
| `storage.rules.example`, `FIREBASE-STORAGE-SETUP.md` | Storage setup guidance/example rules. | Not an applied cloud configuration |
| `imgs/` | Approved media at exact paths listed below. | Inventory only today; preserve other local/ignored media |
| `deploy/package-cloudbase.ps1`, `deploy/README.md` | Explicit runtime allowlist recipe (single source of truth) and release notes; intended target is Cloudflare Pages despite the legacy script name. | 50-file (nine media) / 258-reference / six-anchor audit re-run 22 October; PowerShell recipe not executed on this Mac |
| `deploy/build-package.mjs`, `.github/workflows/pages-deployment.yml` | Reads the 50-file allowlist from the PowerShell recipe, builds `dist/` with build-time Firebase config, validates references, and deploys on push to `main` via Wrangler. | Added 22 October; local build PASS; workflow not yet run and no deployment made |
| `MAC-HANDOFF.md` | Historical September Mac transfer/setup guide. | Later counts/configuration are superseded in HANDOFF/README |
| `README.md`, `package.json` | Current run instructions and dependency declaration. | `npm run build` now builds the audited `dist/` package; no test script |
| `AGENTS.md`, `HANDOFF.md` | Working agreement and live resume point. | Pre-existing records preserved; workflow reminder merged by setup |
| `BLOG-POSTING-GUIDE.md` | Owner-facing blog intake template, stored fields, writing shape, house style and publish checklist. | Added 22 October; documentation only, not part of the deployment allowlist |
| `PROJECT_MAP.md`, `DECISIONS.md`, `FAILURE_LOG.md` | Verified layout, enduring choices and evidenced lessons. | Created by 9 October setup and enriched during handoff |

## Dependencies and data boundaries

- Static HTML/CSS/JavaScript, no application build step. `package.json` declares Firebase `^12.15.0`, but inspected runtime pages load Firebase **8.10.1 CDN** scripts; do not silently switch SDK APIs.
- Root Home is static and does not require Firebase. Projects/Blog load browser config followed by the inert fallback and their helpers. Admin templates resolve shared root files through their base URL; do not move them without a reference audit.
- Both variants use shared `projects`, `posts` and `posts/{postId}/comments` data. Display filtering is not document privacy. Current public-read limitations and live-auth verification gaps are recorded in HANDOFF.md.
- Editorial media references use `../imgs/`; shared helpers resolve canonical media paths for both variants. The homepage's historical `sortOrder` query limitation remains an open audit item.

## Approved media paths

Preserve spelling, case and bytes; this is the approved tracked-media subset, not permission to delete other files:

- `imgs/Logo/logo.png`, `imgs/Logo/icon.ico`
- `imgs/Blogs/GGF/GGF_grp_photo.jpg`, `imgs/Blogs/OIP/OIP_grp_photo.jpg`, `imgs/Blogs/EchoWorks/photo.JPG`
- `imgs/Projects/BurntConesRevamp/BurntConesRevamp_HomePage.jpg`
- `imgs/Projects/CarbonCreative/CarbonCreative_HomePage.jpg`
- `imgs/Projects/EchoWorks/EchoWorks_HomePage.jpg`
- `imgs/Blogs/empire-ai/empire-code-reception.jpg` — owner-supplied 22 October for the internship post; the remote record's legacy `imgs/EmpireAI/photo.JPG` path is mapped to it in both variants. Tracked via an explicit `.gitignore` exception.

## Available commands

- Preview: use the root-bound Python command above; live-configured pages can contact production even when served locally.
- Build/deploy package: `node deploy/build-package.mjs` (or `npm run build`) → validates the 50-file allowlist and writes `dist/`; run from the repository root. In CI it requires the `FIREBASE_*` secrets; locally it falls back to the ignored `firebase-config.js`.
- Syntax: `for file in ./*.js ./editorial-portfolio/*.js ./admin/*.js; do node --check "$file" || exit 1; done`.
- Whitespace: `git diff --check`. No committed `npm test` command exists; browser/live integration checks must be recorded separately.

## Existing context to preserve

- [MAC-HANDOFF.md](MAC-HANDOFF.md) — existing context; consult before related work.
- [WORK-RECOMMENDATIONS.md](WORK-RECOMMENDATIONS.md) — existing context; consult before related work.
- [deploy/README.md](deploy/README.md) — existing context; consult before related work.

## Protected paths and conventions

- Preserve dirty source files, both visual variants, imgs/, deploy archives, ignored Firebase configurations and all existing approval boundaries.
- Place new files in established locations and match existing naming: root/shared helpers use descriptive kebab-case, admin-specific files belong in `admin/`, variant-specific files in `editorial-portfolio/`. Preserve legacy media case and the existing packaging filename; a naming preference is not rename approval. Keep the five workflow files at the root.
- Generated outputs and caches are not automatically disposable. No cleanup, relocation or deduplication was performed or approved by this setup.
- This is a concise source map, not proof that unknown files are unused. Any reorganisation still requires a task-specific dependency audit and explicit approval.
