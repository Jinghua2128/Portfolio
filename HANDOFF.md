# Handoff

Last updated: 2026-10-22

## Active checkpoint — 22 October takeover verified; no edits beyond records

- **Request / scope:** continue the existing dirty checkout, read AGENTS/MAC-HANDOFF/the whole HANDOFF/PROJECT_MAP/DECISIONS/FAILURE_LOG/README/deploy README, reconcile docs with the real tree, verify the preview before editing, then give the owner a state summary and a prioritized small next step. **No application code, assets, Firebase data/rules, billing, packaging or Git state was changed in this pass**; only this record (and FAILURE_LOG/PROJECT_MAP notes) was updated. No deployment or push.
- **Tree reconciled:** branch `main`, HEAD `54355ea`, 27 modified tracked files, untracked `DECISIONS.md`, `FAILURE_LOG.md`, `PROJECT_MAP.md`, `admin/`, `firebase-fallback.js`, `firestore.rules`, `blog-page.css`, `blog-page.js`. No tracked asset additions/deletions. Both ignored browser configs exist, are byte-identical and still Git-ignored; contents were not copied anywhere. `package.json` still only declares the unused Firebase `^12.15.0`; runtime pages load Firebase 8.10.1 CDN. `firebase.json` remains rules-only.
- **Preview (changed):** port **8765 is NOT this repository**. It is an unrelated uvicorn app ("Media Curator · Empire AI", PID 77444, cwd `~/Documents/Empire AI/Social Media/Assets/Emprie AI Media Curator`). It was identified via `lsof` and **left running** — do not kill it. This repo was served read-only on **`http://127.0.0.1:8766`** via `python3 -m http.server 8766 --bind 127.0.0.1`; the 8766 job may stop when this session ends, so re-check the port before reuse.
- **Fresh static checks PASS (22 Oct):** `node --check` for all 21 root/editorial/admin JS files; `git diff --check`; the audit `/private/tmp/portfolio-blog-qa.hezUfv/audit.mjs` with the corrected 22 October allowlist → **52 allowlisted files**, 14 HTML documents, 258 local references, six cross-page anchors, unique IDs, public/admin isolation. The PowerShell packager itself remains NOT RUN.
- **Fresh rendered checks PASS (22 Oct, headless Chrome 155 via CDP, DevTools width emulation — not native devices):** Home and Blog at 1440/768/375 render with correct title/H1, no horizontal overflow, no public editor forms, no broken visible images. Live Blog showed 4 Firestore-sourced cards (Internship/Empire AI, EchoWorks pitch, GGF China Booth, Shenzhen OIP), 5 topic filters with counts, author sidebar; search "EchoWorks" → 1 entry; clear filters restores; article opens by click and by direct `?post=<existing-id>` (existing IDs preserved), Back/Forward and "All entries" work; invalid id shows "This entry isn’t available."; article reader shows prose, Comments, signed-out "Log in to comment"; login drawer opens and Escape closes it; mobile menu opens with `aria-expanded=true`. All 11 root/editorial routes rendered; signed-out `/admin/blog.html` and `/admin/projects.html` redirect to `/admin/index.html` with zero editor forms. Home 1440/375: 3 static featured cards, images loaded.
- **Accessibility PASS (limited):** axe-core 4.10.2 (WCAG 2.0/2.1 A/AA) reported **zero violations** on Home 1440, Blog 1440, Blog 375 and an article page. One minor finding outside axe: footer social links are 42px tall at 375px (below the 44px AAA target; still above WCAG 2.2 AA 24px). Not a screen-reader or native-Safari test.
- **Internship image added (22 Oct):** the owner supplied the Empire Code reception photo and asked for it to be used on the internship post; it is saved as `imgs/Blogs/empire-ai/empire-code-reception.jpg`. The owner then chose the **Codex-generated version**, so the asset is now the 1448×1086 AI-enhanced JPEG (quality 90, 285 KB; the generated version altered minor desk/poster details by design). The remote record still references `imgs/EmpireAI/photo.JPG`, which both variants' `resolveBlogImage` maps to this file — **the Firestore record was not modified** for the image path. Added to the explicit deployment allowlist. Note: `/imgs/**` is Git-ignored; this file is tracked through an explicit `.gitignore` exception.
- **AI thumbnails + reading time (22 Oct):** the AI VibeKnowledge cover comes from the owner-referenced session `c3cc2dee-22df-4067-a325-c9a629694eb1` (`film/thumbnail.png`, “The Arrow of Time”, 1280×720); the AI MV project was not in that session workspace, so its cover is the video cover from the owner's LinkedIn post (1280×720). Saved as `imgs/Blogs/ai-vibeknowledge/vibe-knowledge-arrow-of-time.jpg` and `imgs/Blogs/ai-mv/paper-cut-mv-cover.jpg`, added to the allowlist (52 files / eleven media) and `.gitignore`. Reading time was removed from the public Blog cards and article metadata (`blog-page.js`, `blog-firebase.js`); dates remain. The two Firestore posts still need their `coverImage` updated and the changes deployed.
- **Console:** apart from the expected 404 console entry for the missing `imgs/EmpireAI/photo.JPG` on pages showing that remote post, no page exceptions or warnings occurred during fresh standalone headless runs. The historical framed-preview `MutationObserver` error and intermittent Firebase WebChannel warnings were **not reproducible** in this standalone (non-framed) harness; that does not prove either fixed. Firebase/CDN requests succeeded.
- **NOT RUN:** native iOS/Android/Safari, screen readers, real owner/non-owner auth and writes, live rules inspection/verification, comment creation, Storage uploads, PowerShell packager, any deployment. Safari automation is unavailable because Safari 26.6 has "Allow Remote Automation" off in its Develop menu (enabling it needs the owner).
- **Visual review points found (not defects):** at 375px the "Explore topics" block sits above the feed (≈2 rows) and the search field is only ~179px wide beside "Latest entries"; these are the only layout frictions observed. The missing-image card keeps a full-height media placeholder by design.
- **Blog workflow (22 Oct):** the owner declined photo-upload/Storage activation and video support for now and asked for a repeatable posting structure instead, since they will supply content for the agent to manage. Added root `BLOG-POSTING-GUIDE.md` (intake template, authoritative stored fields, writing shape, house style, publish checklist, division of work); recorded as `DEC-BLOG-WORKFLOW-20261022`. No runtime code, Storage, billing or Firestore change. Drafting is local; the owner publishes from `/admin/blog.html`; owner-only rules remain the boundary.
- **Pending owner inputs (22 Oct):** (1) **Internship photo upscale:** after the Codex limit reset (12:53) the run produced a 1448×1086 generated version and a faithful 1500×1124 resample. The generated version gained real detail but altered fine details (desk items, posters, TV reflection), so it was **not installed**; the owner must choose generated, resample, or keep the current 750×562 original. Temp files: `/private/tmp/portfolio-imagegen/` (`codex-generated.png`, `empire-2x.png`, `reference.jpg`). (2) **LinkedIn source resolved:** the profile URL still returns HTTP 999, but the two public embed URLs worked (`linkedin.com/embed/feed/update/urn:li:ugcPost:7518567479757930497` and `…7517837264211775489`). Extracted the owner's own posts: a two-minute film programmed in one HTML file (Canvas `render(t)`, headless Chrome, ffmpeg; 4,230 frames/30 fps/1920×1080/11.9 MB/77 BPM) and a 2:28 red paper-cut music video built with Lemo-Opuscar (8 shots, 3,568 frames, 12 fps, −14 LUFS). The owner clarified these are **two separate projects (AI MV; AI VibeKnowledge), not Empire AI work**. Created as **two separate live posts** under the new `AI` category through the owner's authenticated production session (DOM-injected Firestore writes; the deployed owner-only rules still enforced the owner UID): `AI MV: A 2:28 Paper-Cut Music Video Made in Code` (id `wAKHQI2UCLivGOO1TjFy`, date 2026-10-22) and `AI VibeKnowledge: A Two-Minute Film in One HTML File` (id `xASUwld34MSh19oMHY7q`, date 2026-10-20). Verified 16/16 local checks: 6 cards, `AI` filter count 2, newest-first order, both article pages with comments, no page errors or unexpected 404s. The production `/blog` (still served by the old Worker build) also lists all 6. No cover images supplied, so the cards use the text fallback; no rules/billing change.
- **Web image generation verified (22 Oct):** the keyless Pollinations Classic endpoint (`https://image.pollinations.ai/prompt/...`) works from this environment; a 16:10 test rendered as a 971×607 JPEG in ~8.5 s. Free-tier limits: ~768² maximum area, a small “pollinations.ai” watermark, one request per IP per 45 s, results are public/cached, and output is generative rather than a faithful edit. Useful only for clearly labelled illustrations, **not** for upscaling the real internship photo. No-logo/higher-limit use would need an `enter.pollinations.ai` key (owner signup; keep it in the environment, never in the repo). The test image was not added to the repository.
- **Deployment (22 Oct, option B; Worker correction; SUCCESS):** the owner chose GitHub Actions → Wrangler. Added `deploy/build-package.mjs` (50-file allowlist → validated `dist/`; Firebase config from build secrets or the ignored local file), `npm run build`, `wrangler.jsonc` (static assets from `./dist`, `auto-trailing-slash`, no 404 rewrite) and `.github/workflows/deploy-worker.yml`. Local build **PASS** (50 files, 14 HTML, 258 references, 6 anchors) and `wrangler deploy --dry-run` **PASS**. The first run's build passed but deploy failed because the pipeline assumed Pages; diagnosis showed `liuguangxuan-portfolio` is a **Cloudflare Worker** in account `fb9e2989477bd90c3b9d99973d240a74` and the account-ID secret pointed at an empty account. Corrected the secret, switched to `wrangler deploy`, and the owner added `Workers Scripts → Edit` to the API token. Pushed `3006f45`; workflow run **`39725445377` succeeded**. Live verification: `/`, `/blog`, `/admin/`, `/admin/blog`, `/blog-page.js` and the internship image all 200; `/blog` renders 6 posts with the `AI` filter (count 2) and both article pages; the editorial variant renders 6 cards and its image; signed-out `/admin/blog` redirects to `/admin/` with no editor form; no 404s. Clean-URL redirects (`/admin/blog.html` → `/admin/blog`) are expected from `auto-trailing-slash`.
- **Exact first next action:** owner chooses the internship image version (Codex-generated 1448×1086 with minor detail changes, faithful 1500×1124 resample, or keep 750×562); the agent installs the choice as an optimized JPEG, re-verifies, and pushes (which redeploys). Separately: mobile journal polish on request. Every push to `main` now deploys production.

## Previous checkpoint — A + D blog ready for local review; not deployed

- The user selected **A (Linear Now) + D (Fuwari)** from the researched blog references and explicitly chose **existing references only**, with no generated mockup or artwork. Adapt those patterns to the existing root dark-grid portfolio; preserve all content/media, document IDs, Firebase permissions, the editorial variant and dirty worktree. No deployment, billing, live writes or broad file reorganisation is authorised.
- Implemented: compact journal heading, rounded cards, category counts/search and an author sidebar; full-page reading at `blog.html?post=<existing-id>` with comments underneath. `q` / `topic` preserve filters; Copy article link removes those optional filters. Browser Back/Forward, direct URLs, missing-post messages and duplicate-photo suppression work in the public reader. Owner tools remain in `/admin/`; no framework/CMS migration or new imagery.
- Changed for this pass: new root `blog-page.js` / `blog-page.css`; focused integration in `blog.html` / `blog-firebase.js`; two entries added to `deploy/package-cloudbase.ps1`; README/deploy README and the four memory records updated. Existing dirty changes, editor and editorial source were preserved. No existing file moves/renames/deletions, asset changes, credentials/config changes, cloud writes, commit, push, ZIP or deployment. The agent-created responsive fixture and temporary error listener were removed after QA.
- Preview: `http://127.0.0.1:8765/blog.html`, verified in the in-app browser on 18 October and freshly reloaded on 19 October. Existing Python listener PID **93833** was found on port 8765 on 19 October; reuse it while available. Sandbox curl could not connect and a duplicate approved launch reported address-in-use, but browser reload and interactions succeeded. Do not infer the preview is offline from that sandbox curl result. Never kill the existing listener just to restart it.
- Static PASS, repeated 19 October: `for file in ./*.js ./editorial-portfolio/*.js ./admin/*.js; do node --check "$file" || exit 1; done`; `git diff --check`; `node /private/tmp/portfolio-blog-qa.hezUfv/audit.mjs` (49 allowlisted files, 14 HTML documents, 258 local references, six cross-page anchors, no duplicate IDs, public/admin presentation isolation). The PowerShell packager itself was NOT RUN. No tracked asset/deletion diff was present.
- Browser PASS on 18 October: expected title/meaningful content/no framework overlay at 1280px; search, topic filters, combined no-results and Clear filters; article/direct reload, remote-record direct reload, invalid post, copied URL, All entries, Back/Forward; existing comments, sign-in panel/Escape/focus return; signed-out `/admin/blog.html` redirects with no editor form; editorial Blog retains its original read drawer and comment flow. Fresh 19 October reload → search EchoWorks → open article → comments → All entries → clear search also passed; four posts returned after Firebase settled.
- Responsive PASS with limitations: actual 375px and 768px same-origin frames (not native devices) showed no horizontal overflow, working search/article/login/menu keyboard flows and no public editor forms. Sidebar collapses at 860px to keep tablet cards readable. Browser plugin/standalone Playwright were absent; built-in CUA was used without installing dependencies. Browser viewport override did not apply; temporary framed harness logs contained intermittent unattributed MutationObserver errors. A diagnostic listener did not reproduce/attribute them; cause remains unconfirmed. See FAILURE_LOG.md. Native mobile/Safari and screen-reader QA remain NOT RUN.
- Console distinction: standalone blog/admin/editorial were clean during 18 October tests. The long-lived tab accumulated Firebase WebChannel transport warnings overnight; on 19 October no new warning/error appeared during the fresh verification window (from 00:25 UTC), and posts/comments rendered. Do not claim uninterrupted Firebase connectivity or a production fix.
- Reference-fidelity ledger: (1) Linear's dark restraint → retained portfolio gray palette/grid; (2) Linear's hierarchy/search → compact heading and clear search toolbar; (3) Fuwari's personal/sidebar structure → author and topic sidebar; (4) Fuwari's rounded surfaces → 18px cards, no borrowed anime art; (5) readable editorial flow → full-page article and comments, with tablet/mobile stacking. Two-column desktop cards, existing fonts/media and no decorative banner are intentional portfolio adaptations, not a pixel-for-pixel theme clone.
- Evidence inspected: `/Users/longmai2128/.codex/visualizations/2026/09/22/01a0c8e0-55c3-76f2-bc22-48d0c9194536/blog-journal-desktop.png`, `blog-journal-responsive.png`, and `blog-article-desktop.png` (same folder). Baseline/reference/extra QA captures and the temporary source-audit script remain outside the repo at `/private/tmp/portfolio-blog-qa.hezUfv/`; temporary files may not survive a reboot.
- Remaining risks: the remote internship record refers to missing `imgs/EmpireAI/photo.JPG`; cards now show a text-only category fallback and the reader hides the failed image, without changing its URL/data. Per-post server-rendered social metadata/HTTP 404s are not supplied by client query routing. Real owner/non-owner login/write checks, comment creation, deployed-rule verification, privacy/schema migration and Storage remain unverified and out of this UI pass; prior limitations below are still open.
- Exact first next action: open the local Blog for the user's visual review. Before a release, perform native-device QA and agree on a bounded real-auth Firebase test plan. This local design pass is ready for review, not production certification; do not deploy the stale September ZIP or resume unrelated historical work.

## Previous checkpoint — 9 October handoff complete; implementation stopped

- **Current request / stop point:** the user requested a handoff, then said continue. This continuation completes the documentation handoff only; it does not resume development or authorise a deployment. No application, asset, Firebase or billing changes were made in this handoff pass.
- **Workspace:** `/Users/longmai2128/Portfolio`, branch `main`, HEAD `54355ea` (`Record verified GitHub transfer checkpoint`). The substantial October source changes remain uncommitted. `origin/main` is only the locally recorded tracking state; no fresh fetch or remote verification was performed. Preserve the dirty tree, untracked `admin/`, `firebase-fallback.js`, `firestore.rules`, and the three new memory files. No commit, push, package, file move, rename or deletion occurred.
- **Completed source work, previously verified:** public Projects/Blog are separated from owner editor routes; Home has three static featured works; the catalog retains 21 records with eight public built-ins; three text case studies, professional About/Contact copy, accessibility/layout improvements and asynchronous case-study anchor correction are in place. Root dark-grid design, the separate editorial site, approved media and existing Firebase content were preserved. Detailed 4/7 October evidence is retained below, not claimed as fresh testing today.
- **This handoff changed only:** `HANDOFF.md`, `PROJECT_MAP.md`, `DECISIONS.md`, `FAILURE_LOG.md`. The existing workflow setup and historical records were preserved. The map now records inspected entry points, shared helpers, configuration and case-sensitive media paths; decisions and failure lessons point back to their dated evidence. No runtime organisation changes were made.

### Verification on 9 October

- **PASS:** `git status --short --branch`, `git rev-parse --short HEAD`, `git log -3 --oneline` — inspected the local branch and existing changes; no remote update implied.
- **PASS:** `for file in ./*.js ./editorial-portfolio/*.js ./admin/*.js; do node --check "$file" || exit 1; done` — syntax only, not a build or runtime/security test.
- **PASS:** `git diff --check` — no whitespace errors.
- **PASS:** `cmp -s firebase-config.js editorial-portfolio/firebase-config.js` and `git check-ignore firebase-config.js editorial-portfolio/firebase-config.js` — both local browser configs exist, are byte-identical and stay ignored. Their contents and owner identifiers were not copied into documentation.
- **NOT RUN today:** browser/responsive checks, live owner/non-owner authentication or writes, live rules inspection, Storage uploads, the PowerShell packager, production checks and remote Git fetch. There is no `package.json` test/start script. The last rendered verification is 7 October (18 root route/width pairs plus targeted interactions); the last recorded package-source audit covered 47 files, 253 local references and six cross-page anchors. Those are historical results.
- **Preview:** previously served at `http://127.0.0.1:8765/`; its availability has not been checked today. Old process/session IDs below are not reusable evidence of a running server.

### Remaining risks and approval boundaries

1. **Firebase authorization:** owner-only project/post writes and owner-only comment modification were recorded as published on 2 October. Visitors may read and authenticated visitors may add comments. Fresh deployed-rule verification and bounded real-owner/non-owner tests remain outstanding; local UI gates and syntax checks do not certify authorization. Use designated disposable test records and agreed login scope, never alter real content incidentally.
2. **Public-read privacy:** hidden/draft documents and stored comment email fields remain readable under the recorded rules. Comment identity/spam protections also need separate work. A compatibility-safe schema/query migration is required before tightening reads because existing listeners are unfiltered. Do not mark the Firebase structure fully secure or broadly change rules from this handoff.
3. **Storage/deployment:** Storage previously required a Blaze upgrade; no billing approval or real upload/save/reload verification exists. `storage.rules.example` is not deployed. `firebase.json` now declares only Firestore rules, with no Hosting target. Cloudflare Pages remains the intended hosting target; the 47-file allowlist recipe has not been executed on this Mac. The historical September ZIP is stale and must not be deployed as the October source.
4. **Content and backlog:** no approved resume PDF/public email or Questionnaire/PoliteLoad screenshots have been supplied. Do not invent them. The earlier audit also records editorial homepage `sortOrder` query omissions and data/deletion-lifecycle issues; these remain review items, not authorisation to migrate or delete data. Preserve current files, naming and media bytes.
5. **Documentation precedence:** `MAC-HANDOFF.md` is the September transfer record, not current state. Its 19/six catalog counts, missing-config prerequisite, unsafe Hosting-root description and package counts were superseded by October source changes. Use this checkpoint, `README.md` and `PROJECT_MAP.md` for current facts; retain the Mac guide's setup/preservation cautions.

### Exact first next action

Run `git status --short --branch` from `/Users/longmai2128/Portfolio`, then read the four root memory files and reconcile them with the newest user objective. This handoff leaves no implementation running. If development is requested, first check the local preview; if port 8765 is free, start `python3 -m http.server 8765 --bind 127.0.0.1` from the repository root and verify the affected pages before editing. Do not overwrite this dirty checkout to obtain a newer `main`, or infer permission for live Firebase writes, billing, assets or deployment from historical next steps.

## Historical record — dated evidence, not current instructions

All checkpoints below describe their own dates. Their words “current”, “next”, “active”, old process IDs and stop/resume instructions are historical. The active checkpoint above and newest user request take precedence. Original evidence and decisions are retained for traceability.

## Historical checkpoint — 7 October professional presentation pass locally verified

- Current request: review and make further professional adjustments. Scope is local presentation, copy and usability while preserving the dark-grid design, approved content/media, both variants, dirty worktree and Firebase data/access policy. No production deployment, database write, credentialed login, billing action or new asset is authorised by this polish pass or has occurred.
- Implemented locally: `index.html` moves the existing interactive focus panel after the static featured projects, adds a browse-all link and closing Contact CTA, and gives the three case-study links distinct accessible names. `styles.css` reduces excess hero/section spacing, prevents the hero eyebrow sitting behind the fixed navigation, aligns featured-card actions and improves About/Contact hierarchy. The decorative, ungrounded percentage meter is removed; focus tabs remain keyboard-operated with explicit panel relationships in `script.js`.
- `projects.html` has case-study jump links, clearer individual/team roles, visitor-facing copy in place of internal approval notes (approvals remain HTML comments), and a closing contact CTA. `contact.html` prioritises the explicit LinkedIn messaging CTA, clarifies what to include in an enquiry and relabels the old Website link as Earlier Portfolio. `about.html` uses scan-friendly selected-work links and removes an unnecessarily time-sensitive internship sentence. Existing biography, carousel, media and profile destinations remain intact.
- `project-catalog.js` refines PoliteLoad wording without changing IDs or fields. Rendered review found an old generic copy replacement turning “submissions” into “finished pieces”; that replacement was removed in both Projects scripts. Root cards now leave word wrapping/truncation to CSS rather than cutting strings mid-word. `project-highlights.js` uses visitor-facing empty states instead of editor instructions. Fresh root browser checks confirmed the exact corrected PoliteLoad sentence and the visitor-facing Latest empty state. Editorial Projects loaded at 375px with no editor forms, overflow or recorded warnings/errors; its older card-snippet length remains unchanged.
- Initial checks passed: changed `script.js` and catalog syntax, `git diff --check`; fresh Home browser DOM/console at local port 8765 shows meaningful content and no warnings/errors. A settled desktop screenshot confirms the visible eyebrow and shorter hero. Focus Motion click and ArrowRight to 3D updated the panel and its accessible label. Home Questionnaire CTA reached the correct case-study URL/content; the first browser wait timed out during navigation, but the subsequent URL/DOM confirmed successful arrival. No claims yet for the final responsive sweep or remaining changed flows.
- `README.md` is updated to the current public/admin split, 21 retained/eight public catalog records, 47-file allowlist, source-only Firestore configuration and current verification limits. Asset references use `20261007-1`; final root CSS, root Projects script and admin bootstrap use `20261007-2`. The preview/browser session restarted during the user's final continuation; a new server is running on `127.0.0.1:8765` in exec session **66052**. Old session 28321 is no longer current. Recheck before reuse. Browser plugin is absent and standalone Playwright is unavailable; the in-app CUA browser provided rendered checks without dependency installation.
- Additional verified fix: asynchronous Firebase cards shifted an incoming case-study anchor out of view. `projects-firebase.js` now aligns a valid initial case-study target after card render/load/font readiness, and releases that alignment on the visitor's first wheel, touch, pointer, key or hash change. Desktop Questionnaire and mobile PoliteLoad links landed around 93–100px below the viewport top, clear of the 68px fixed navigation, after the cards loaded. A source-isolated Node mock passed all five release events plus the no-hash state; no Firebase writes were involved.
- Final browser checks: six root routes at **375, 768 and 1440px** (18 route/width pairs) returned the expected title/H1, no horizontal overflow, zero project/post editor forms and no recorded warnings/errors. Settled screenshots were inspected for Home, Contact and About on desktop/mobile and for desktop/mobile case-study destinations. About's final focus-card layout is a balanced three-plus-two desktop arrangement; a post-adjustment 375/768px recheck confirmed five cards with no overflow. These are local in-app-browser checks, not Safari, native phone, screen-reader or production certification.
- Interaction checks passed: Home focus Motion click and ArrowRight to 3D with updated panel label; Home Questionnaire and PoliteLoad case-study links; EchoWorks jump link; search for PoliteLoad returned one of eight works; Latest empty state and Featured restore; EchoWorks Details drawer and Escape close; Project-to-Contact CTA; mobile menu open then About navigation. Signed-out `/admin/projects.html` redirected to `/admin/index.html` with no editor forms/errors. After the browser restart, Blog EchoWorks Read more opened Comments, and Log in to comment opened Blog Account with owner-only-edit wording and zero editor forms. No login or comment submission was attempted. A first Details locator assumed the catalog ID, which differs for the live EchoWorks record; it was corrected to use the rendered title and the drawer test passed.
- Final static checks passed: syntax for all root/editorial/admin JS and `git diff --check`; independent 47-file allowlist audit verified 253 local file references and six cross-page anchors, with no duplicate HTML IDs; catalog check retained 21 unique IDs/eight public built-ins; copy-regression tests preserve “submissions”/“submitted” in both Projects renderers. The first reference-audit draft incorrectly treated hash-only admin links as file paths; the corrected audit matches the packager's hash-only exclusion and separately validates cross-page anchors. Both real browser configs remain byte-identical and Git-ignored. The PowerShell packager itself was not executed; no ZIP, commit, push or production deploy was made. Temporary browser viewport override was reset and the local homepage tab marked as the deliverable.
- Current next step: user review of the local preview. This presentation pass is complete locally. The next content improvement would be specifically approved evidence/screenshots for Questionnaire and PoliteLoad, plus a real resume PDF/public contact email if desired; do not invent or add these without the existing approval. Real-auth Firebase tests, public-read privacy migration for hidden/draft documents and comment emails, Storage/billing, and production packaging/deployment remain separate, pending work described in the 4 October checkpoint. Do not deploy the historical September ZIP.

## Previous checkpoint — 4 October local preview verified

- Continuing the attached portfolio brief on the existing dirty `main`; no commit, production deployment, Firebase data mutation, billing action or new asset has occurred. The 3 October security report below remains a pre-implementation scan, not proof that later edits fixed every finding.
- Root source work now separates public Projects/Blog from admin editor markup and adds text-only Questionnaire, EchoWorks and PoliteLoad case studies and static homepage featured cards. Existing design, Firebase data, approved media and editorial side site are preserved. The admin editor routes and Cloudflare package are **not yet fully verified**.
- The 4 October local preview at `http://127.0.0.1:8765/` was checked in the in-app browser. Home rendered the new positioning and three featured cards with no console warnings/errors or horizontal overflow at 1280px. The first featured case-study link navigated to `projects.html#case-study-questionnaire` and its content was visible. Public Projects had no Account/New Project buttons and no console warnings/errors. Public Blog rendered existing posts, Read more opened the comment area, and “Log in to comment” opened the account drawer; no console warnings/errors. A signed-out visit to `/admin/projects.html` redirected to `/admin/index.html`, with zero project/post editor forms and no console warnings/errors. This is not a credentialed owner-write test.
- The editorial variant now also omits public Project/Journal account and editor controls while keeping project details and Journal comment sign-in. Its scripts tolerate absent editor forms and use the inert Firebase fallback if a checkout has no local config. `node --check` passed for both editorial scripts and `git diff --check` passed. In the local in-app browser, editorial Projects rendered eight public works and its details drawer opened; editorial Journal rendered existing posts and its comments drawer offered “Log in to comment.” Both had zero public editor forms and no recorded console warnings/errors. No owner-authenticated editor test has occurred.
- The root About page now leads with professional introduction, focus areas, technical skills, education and selected work; the existing life-stage carousel is retained lower as “My Journey.” Contact now uses the requested broader opportunity language, prioritises LinkedIn/GitHub and has a LinkedIn “Start a Conversation” CTA. Public email and resume CTA remain TODO because no approved email/PDF exists. The root six major pages now have canonical and Open Graph metadata using the user-supplied domain and approved local image paths; external live-domain response was not verifiable through the web tool.
- `deploy/package-cloudbase.ps1` now allowlists `firebase-fallback.js` and five admin runtime files, and its HTML reference audit accounts for `<base href="../">` on admin editor pages. An independent read-only Node audit found all 47 listed source paths present and all local HTML `src`/`href` targets allowlisted. PowerShell is unavailable on this Mac, so the packager has **not** been executed and no new ZIP has been created. `deploy/README.md` marks the old September ZIP as historical, not current. `firebase.json` now declares only the Firestore rules file instead of Firebase Hosting `public: "."`; no CLI deployment was run. Existing published rules remain unchanged and the Storage example remains undeployed.
- Syntax check passed for every discoverable non-deploy `.js`; JSON structure check confirmed `firebase.json` points to `firestore.rules` with no Hosting target. `cmp` confirmed the two ignored browser configs are identical, both `git check-ignore` checks passed, and `git diff --check` passed. The in-app browser checked 390px mobile across root Home, Projects, Blog, About, Contact, 3D Work and editorial Projects/Journal: nonblank headings, no relevant errors/warnings and no horizontal overflow. Home mobile menu opened and reported `aria-expanded=true`. Root Home/Projects/About/Contact were additionally checked at 375, 430, 768, 1024 and 1440px with no horizontal overflow or recorded errors. Screenshot evidence was visually inspected for root Home, Projects, About and Contact on desktop/mobile; the initial immediate screenshot after a navigation sometimes captured an interim blank transition, so settled screenshots were used for visual claims. Browser viewport was reset afterward.
- A private-admin implementation gap was found and fixed: the shared drawer manager makes `<main>` inert when a drawer opens, so admin drawers are now moved from the cloned template to body siblings before shared scripts load. Signed-out/non-owner navigation returns to `/admin/index.html`. An isolated in-memory Node test passed the signed-out and non-owner redirects, owner UID gate, body-level drawer placement and ordered script load for both Projects and Blog; this is a **mock**, not a real Firebase Auth or write test. The client UI gates now use configured UID only, consistent with the published UID-based Firestore rule; the rule, not the client, remains the write boundary.
- During rendered QA, the in-app browser reused a stale cached Projects script. Updated public/admin script references and root CSS links now have a 4 October asset version. Fresh Projects load with Firebase data now consistently shows Questionnaire, EchoWorks and PoliteLoad as the three visible highlights. EchoWorks' exact vague legacy “Currently working on it” text is replaced at display time with previously approved catalog wording and missing role/tools/case-study link; the Firestore record was not changed. A small CSS adjustment lets the full Questionnaire title show in the featured card. Settled desktop screenshot and DOM confirmed this, with no console warnings/errors. All six root navigation links were clicked and each destination/H1 verified after its navigation completed.
- Final 4 October static checks: every discoverable non-deploy JavaScript file passed `node --check`; `git diff --check` passed; six root pages contain canonical/Open Graph/Twitter-card metadata; an independent 47-file package allowlist/local HTML reference check passed after asset-version queries; `firebase.json` parses and references an existing rules file without a Hosting root; both real ignored browser configs remain byte-identical and Git-ignored. Final root/editorial public-page smoke found no editor forms or recorded errors/warnings; signed-out `/admin/blog.html` redirected to `/admin/index.html` with zero editor forms. No package was built because PowerShell is unavailable on this Mac, and no production deployment or Firebase write occurred.
- External reachability check on 4 October returned HTTP 200 for GitHub, Sketchfab, Telegram, EchoWorks, Burnt Cones, Carbon Creative and the older portfolio; LinkedIn returned 999 and ArtStation 403 to an automated request, so those two are **not verified broken or working for a human browser**. The supplied live portfolio domain could not be fetched by the web tool, so production site/OG URL responses remain unverified.
- Final polish after that checkpoint: root Project Library cards now show separate Role and Technologies (or accurately labelled Tools & focus) lines when data exists. Featured and library titles may use three lines so “Multilingual Questionnaire Platform” is not visibly cut off on desktop/mobile; descriptions get two lines with case-study links for full detail. Root footers now consistently identify the creative-developer role, and compact GitHub/LinkedIn/Telegram labels have accessible names. An exact mechanical pass changed external-link `rel="noreferrer"` to `rel="noopener noreferrer"` across root/editorial HTML and runtime scripts. Asset versions were advanced after these edits to defeat observed stale browser caching. A settled 375px Projects screenshot and DOM confirmed full title height, readable role/tool lines, visible CTAs and no layout overflow. No project data or images were altered.
- A final 35-pair responsive sweep checked root Home, Projects, About, 3D Work, Blog, Contact and admin sign-in at 375, 430, 768, 1024 and 1440px: no horizontal overflow or recorded page errors. Browser viewport was reset and the local Home preview left open. Final syntax check for all discoverable non-deploy JS, `git diff --check`, Firebase JSON/ignored-config checks and independent 47-file HTML-reference allowlist audit all passed after the final edits. The PowerShell recipe itself remains unexecuted.
- Current next step: obtain the owner’s permission to use a suitable existing Auth login or designated disposable test records for bounded credentialed tests; verify owner project/post save, non-owner denial, signed-in comment creation and deployed rules without touching real content. Separately design and approve a compatibility-safe public-read/privacy migration for hidden/draft documents and comment email fields, plus anti-spoofing/rate-limiting; do not silently tighten rules against unfiltered listeners. Resume PDF and public email are still missing and no links were invented. PowerShell package execution, Storage/billing and production deployment require separate verification/decision. Preserve the dirty worktree and the ignored configs; do not upload the old September ZIP.

## Historical checkpoint — portfolio development in progress; security scan completed

- The latest attached brief requests a staged, in-place improvement of the existing portfolio. Preserve the dark-grid identity, both site variants, all Firebase documents and approved media; do not invent resume/email, links, images, metrics or project commissions. P0 is public CMS separation, owner-only writes, Multilingual Questionnaire, professional homepage positioning, three static featured projects and obvious copy fixes; P1/P2 follow if safely possible. The full attached brief, `AGENTS.md` and this handoff were read before work.
- Current worktree before new implementation is the same dirty `main` described in the 2 October checkpoint. The existing published Firestore owner-only write rules were not changed in this turn. No production data, Firebase Console, billing, Storage or hosting action has been taken. The two real browser config files remain local and Git-ignored; their contents must not enter Git or this handoff.
- A source-backed Codex Security Standard scan completed on 3 October against the pre-implementation worktree, scan ID `fd52ce9d-0b26-474b-852e-c85d2190ed8d`; its generated report is at `/Users/longmai2128/.codex/state/plugins/codex-security/scans/Portfolio/54355ea730198556dea1f04f47151022eaa4303a_20261003T082055Z_ken0qd5w/report.md`. It recorded six findings: public reads of hidden/draft Firestore documents, publicly readable comment email fields, malformed comment timestamps able to disrupt rendering, spoofable comment names/chronology, unbounded comment volume, and a conditional unsafe Firebase Hosting root. Three are medium and three low. Coverage is explicitly partial, with deployed state and some static files unverified. Owner-only project/post and existing-comment writes were confirmed in local rules by independent source review; real-auth behavior was not tested. No security finding was automatically remediated or deployed.
- The security scan identified architectural work that must be planned before rules/data migration: current unfiltered listeners would fail under published-only read rules; existing comment documents may contain emails; Storage rules are only a local example. Do not silently tighten public reads or remove fields in a way that breaks live clients. `firebase.json` still points Hosting at the repository root; do not run `firebase deploy` from this checkout.
- Current next step: implement P0 source/UI changes locally, starting with separate admin pages and public read-only pages while preserving Blog comment sign-in. Then add verified text-only Questionnaire/PoliteLoad case-study content, homepage evidence and navigation/copy. Update the Cloudflare package allowlist only after auditing new runtime files, then run syntax, static-reference and rendered desktop/mobile QA. Publish/deploy only after a separate explicit production decision and checks.

## Historical checkpoint — owner-only Firestore rules published; live-auth check pending

- The user said “continue,” resuming the owner-only Firestore access work described below. Scope remains owner-only project/post and existing-comment edits, signed-in commenter creation and public viewing. No Storage billing or Hosting deployment is in scope.
- Reopened the existing Firebase Console on 2 October. Its May 21 rules still allowed any authenticated user to write projects/posts and edit/delete comments. The earlier unpublished editor state had not survived the browser restart, so the local `firestore.rules` policy was restored and **published** through the Console. The new starred current version is dated 2 October, 2:33 PM; a full page reload retained that version and showed owner-only write clauses with no unpublished-change banner. The local file's opening comment matches the published policy. The previous version remains in Console history and was backed up at `/private/tmp/portfolio-firestore-rules-before-2026-10-01.txt`.
- Final-draft Rules Playground simulations passed without document writes: public post read allowed; non-owner post create denied; owner post create allowed; signed-in non-owner comment create with matching UID/email allowed; mismatched email denied; non-owner existing-comment update and delete denied; owner update and delete allowed. After publication and reload, the simulator again denied non-owner post create and allowed owner post create against the starred published version. An independent read-only candidate review found no bypass of the stated owner-only write boundary.
- Reviewer identified residual comment-integrity risks: a commenter may choose an arbitrary displayed `authorName` and timestamps despite a bound UID/email. These are not owner-only edit bypasses. Do not present displayed names or ordering as verified identities/chronology until a separate compatibility decision and change. Public read exposure of hidden/draft documents and stored emails remains unchanged.
- Root and editorial Blog/Projects local preview at `http://127.0.0.1:8765/` rendered four Blog entries and six project cards on each variant after publication. Signed-out Blog read-more showed the login-to-comment prompt; root Blog/Projects and editorial Projects account drawers displayed the owner/commenter policy. The local browser recorded no relevant warnings/errors on those routes. Syntax checks passed for both Blog and both Projects scripts; `git diff --check`, identical-config comparison and Git-ignore checks passed. A local HTTP server is running in exec session 82783; recheck before reuse. No actual Firebase login/write, mobile QA or live Hosting/Cloudflare UI deployment was performed.
- Additional source copy refinements since the paused checkpoint: root `blog.html` now says “View posts and comments,” and root `projects.html` replaces misleading non-owner project-editor benefits with viewer/commenter/owner wording. No committed changes or Hosting package yet.
- Current working tree remains uncommitted: tracked edits in `HANDOFF.md`, both Blog scripts, root Blog HTML, both Projects scripts and both Projects HTML files; untracked `firestore.rules` plus the pre-existing partial `admin/` and `firebase-fallback.js`. The two real browser config files remain ignored, identical and local. Do not package them or other private material.
- Concrete next step: when the owner can supply a suitable existing Auth login, run bounded real-auth checks for owner write and non-owner denied write/comment create without changing real content (or use a designated disposable test document with explicit scope). Then decide separately whether to publish the source UI-copy changes via the audited Cloudflare package; they are only local now. Address display-name/timestamp integrity and public hidden/draft/email exposure as separate schema/privacy work. Do not migrate/delete data or alter billing, Storage or Hosting without a new request.

## Previous checkpoint — stopped on user request; owner-only editing draft was unpublished

- The user's latest policy is: **only the owner can edit; other people can view and comment underneath**. I interpreted this literally as owner-only project/post creation, edits and deletion, plus owner-only edits/deletion of existing comments. Signed-in non-owners may create comments; visitors may read the existing public collections. The user then said **“handoff now”**. Stop implementation here; do not publish, deploy or perform further changes until they resume.
- This turn changed source only: `firestore.rules` is an **untracked draft** enforcing the policy for `projects`, `posts` and nested `comments`; both `blog-firebase.js` variants hide comment Edit/Delete from non-owners and cap new comment text at 2,000 characters; `blog.html` and both Projects page/script variants now describe the owner/commenter roles accurately. Existing design and content were otherwise preserved. These changes are not deployed to Hosting or committed.
- The existing browser config files remain locally restored, identical and Git-ignored. They contain the existing project's web configuration and client-side owner UI designation, but client-side checks are not security controls. Do not copy config values, user identities or credentials into this document or commit ignored files.
- The Firebase Console Rules editor currently holds **unpublished changes** matching the source draft's effective policy. The currently published May 21 rules **still allow any signed-in user to create/update/delete projects and posts and to update/delete comments**. Do not confuse Rules Playground results with live enforcement. Do not inadvertently click Publish or discard the draft during handoff.
- Read-only/simulated checks this turn: the Rules Playground reproduced a non-owner post create being allowed by the published rules. Draft simulations denied non-owner post creation and comment update/delete, allowed owner post creation and comment deletion, allowed public post reading, and allowed a signed-in non-owner to create a correctly attributed comment. These simulations did not write Firestore documents. After those checks, the draft comment update/delete clause was simplified to owner-only; that final revision has **not yet been rerun in the simulator** or published. Earlier source checks passed `node --check` for both Blog and Projects scripts, `git diff --check`, identical ignored-config comparison and ignore checks; rerun these after any further edits. No credentialed end-to-end write test or post-change rendered QA has been completed.
- The previous published rules are backed up at `/private/tmp/portfolio-firestore-rules-before-2026-10-01.txt`, and Firebase Console version history provides rollback. No Firestore data, Storage, Authentication users, billing or Hosting deployment was changed. Storage still requires a Blaze upgrade for this project; do not initiate billing without a separate request. The existing local preview was at `http://127.0.0.1:8765/blog.html`; recheck server availability before use.
- Residual risks/constraints: public collection reads also expose hidden/draft project or post documents and stored comment author emails; restricting those reads needs a separate data/query migration. Legacy comment `uid` fields were not previously validated, so owner-only comment editing deliberately avoids trusting them. A parent-post-exists requirement would break comments on fallback-only posts. The legacy `firebase.json` Hosting root is unsafe for a broad `firebase deploy`; use neither that command nor an unreviewed package. Preserve the pre-existing unintegrated `admin/` and `firebase-fallback.js` partial files and all user changes.
- Current `git status --short`: modified `HANDOFF.md`, `blog-firebase.js`, `blog.html`, `editorial-portfolio/blog-firebase.js`, `editorial-portfolio/projects-firebase.js`, `editorial-portfolio/projects.html`, `projects-firebase.js`, `projects.html`; untracked `admin/`, `firebase-fallback.js`, `firestore.rules`. No commit was made.
- Concrete next step **only after the user resumes**: inspect the working tree and this checkpoint; align the local rules draft's opening comment with the Console draft, rerun focused owner/non-owner Rules Playground simulations on the final draft, obtain a fresh read-only security review, and then publish the owner-only Firestore rules if still requested. Verify the published rule version and local preview, run syntax/diff checks and bounded real-auth tests if appropriate credentials are available, and report any tests that remain unverified. Do not deploy Hosting, alter Storage/billing or migrate/delete existing content as part of this rules change.

## Historical checkpoint — Firebase configuration pending admin-access decision

- New user request: take over and configure the existing Firebase project. This resumes Firebase work, not the previously paused broad portfolio redesign. Preserve the existing project, documents, main/editorial site content, and unrelated user changes.
- Read this full handoff and `AGENTS.md`. The Mac checkout remains on `main`; pre-existing uncommitted `admin/`, `firebase-fallback.js` and prior handoff edits remain. No Firebase connector or CLI is available, but the owner is signed in to the existing Firebase Console in Chrome.
- Read-only console inspection confirmed the current Firestore rules allow any signed-in user to create/update/delete `projects` and `posts`, and any signed-in user to update/delete any comment. Public read is currently open for all project/post documents. This is a live authorization risk; do not mistake client-side admin checks for security.
- Firebase Authentication has four existing email/password users. The signed-in owner account matches the admin UID already present in `storage.rules.example`. A question is pending on whether any of the three other users should retain project/blog editing access. Do not place user emails, UIDs, keys or secrets in this handoff.
- The project is on Spark. The Storage page requires a Blaze upgrade, so uploads cannot be verified or enabled on the current plan. No billing upgrade was attempted.
- Restored the existing web app's browser configuration into two identical, Git-ignored files: `firebase-config.js` and `editorial-portfolio/firebase-config.js`. Both set the broad edit flag to false and designate the owner UID for client UI gating. The web-app settings came from the existing Firebase Console; no service-account credential was used. Both files passed `node --check`, `cmp` confirmed identical bytes, and `git check-ignore` confirmed both stay out of Git.
- Fresh local HTTP preview on `127.0.0.1:8765` rendered the main Projects page with six public cards and the Blog page with four visible entries at the final browser check; neither remained on the loading placeholder. The Blog preview tab was retained for handoff. This is a read-only browser check, not proof of live authentication, rule permissions, writes, comments or Storage uploads. The preview server is currently in exec session 59823; recheck before reuse.
- Added an untracked `firestore.rules` **draft** for owner-only project/post writes and author-owned comment changes, while retaining existing public reads for compatibility. The pre-change deployed rules were preserved at `/private/tmp/portfolio-firestore-rules-before-2026-10-01.txt`; the Firebase Console also has published version history. Rules Playground simulations against the draft passed: public project read; unauthenticated/non-admin project create denied; owner project create allowed; owner post create allowed and non-admin post create denied; matching signed-in author comment create allowed, mismatched-email and unauthenticated comment create denied. These are simulations, not live authorization tests. Comment update/delete were not simulated.
- The draft was tested in the Console, then its unpublished changes were **discarded**. Console visibly returned to the May 21 published rules with no unpublished-change banner. No live Firebase rules, Auth settings, Firestore documents, Storage data, billing or hosting were changed. The unsafe deployed write permissions remain until an approved rules publication.
- Public reads still expose *all* project/post/comment documents, including any hidden/draft records and comment author emails stored in documents. Current unfiltered collection listeners mean public-only reads need a separate schema/query migration; do not silently break the site. The user must decide whether editing is owner-only or includes named collaborators before finalizing and publishing rules. If collaborators are included, explicitly confirm the scope because that would broaden access. After publication, verify the live rule version and run read-only preview plus bounded real-auth tests; do not enable billing or deploy Hosting as part of the rules fix. The pre-existing partial `admin/` and `firebase-fallback.js` remain unintegrated and should not be treated as completed security controls.

## Historical checkpoint — portfolio improvement paused at user request

- Current objective from the user's attached brief: mature the existing dark-grid portfolio for recruiters and freelance clients, starting with public CMS removal, Firebase authorization, the Multilingual Questionnaire project, professional positioning and static featured work; then case studies, navigation/content, accessibility and responsive QA. Preserve the main visual identity, separate editorial site, Firebase documents and real content. Do not invent links, assets, metrics or credentials.
- The entire 1,083-line attached brief, this handoff, `AGENTS.md` and the Mac guide were read. The frontend-testing skill was read because rendered QA is required. Source inspection found the public Projects/Blog pages currently contain account/editor drawers and depend on missing ignored Firebase configs; no deployed Firestore/Storage rules are tracked. The real browser config, live data and rules remain unverified.
- The user replied to a request to restore the two ignored browser config files and share deployed rules: **“stop now, i will do it later.”** Treat this as a stop request. Do not continue implementation or request those files again until the user resumes.
- Partial, unverified changes made before the stop: added `firebase-fallback.js` (inert globals intended to let fallback content render when config is absent), `admin/index.html` (a proposed separate management sign-in entry), and `admin/admin.js` (a proposed client-side login gate). These files are not integrated into Projects/Blog, have not been syntax-checked or browser-tested, and do not secure Firestore. They are not a finished admin migration. No existing runtime pages, CSS, Firebase data/rules, assets or deployment were changed in this turn. The earlier modification to this handoff file was preserved.
- No live authentication, write, upload, rules change, production deployment, project/blog data mutation or responsive QA was performed. The current partial files should not be deployed as a completed upgrade. Client-side admin gating is not an authorization boundary; production security requires inspecting and testing the owner's deployed rules.
- When the user resumes: first inspect `git status`, re-read this checkpoint and the newest request, then decide whether to finish or revise the partial admin approach. Privately restore the two ignored configs when the user is ready, inspect deployed rules without publishing secrets, complete the requested source changes, run syntax and rendered desktop/mobile tests, and document actual pass/fail results. A resume PDF and public contact email were also requested but not yet supplied; do not invent links.

## Historical checkpoint — Firebase structure and file naming audit

- User request: check whether Firebase structure, file management and naming conventions are sound. This was a read-only source audit; no runtime code, assets, cloud data, rules, dependencies or deployment configuration were changed.
- Current tracked tree remains on `main`; only this previously edited handoff file is modified. Both ignored browser configs are still absent, as are deployed Firestore/Storage rules. No Firebase console or production data was accessed. Therefore live authentication, Firestore permissions/content, Storage provisioning and upload/save behavior cannot be certified.
- Source data layout is coherent: `projects/{projectId}`, `posts/{postId}` and `posts/{postId}/comments/{commentId}` are used by both variants. Uploads use `portfolio-media/{uid}/{project|post}/{timestamp}-{random}.{extension}`, which matches the path in `storage.rules.example`. The example is not deployed rules. Frontend admin checks are only UI gates; actual access depends on Firestore and Storage rules.
- Fresh static checks passed: all root/editorial JavaScript files passed `node --check`; 218 local `src`/`href` references across 11 HTML pages were checked for existence and exact filesystem case. No missing references other than five expected references to the absent ignored Firebase configs. The built-in catalog has 19 distinct, lowercase hyphenated project IDs, six currently public records and no duplicate display numbers. The 54 tracked file paths have no case-insensitive collisions or spaces/backslashes.
- Finding 1: without `firebase-config.js` in each site variant, the Projects and Blog scripts refer to undeclared `auth`/`db`, so their intended local fallback cannot initialize. Restoring the two real files is the setup prerequisite; a future non-invasive bootstrap guard would also make a fresh checkout render cleanly without them.
- Finding 2: no `firestore.rules` or active Storage rules are tracked. Check the owner's deployed rules with read-only access before asserting that visitors may read only intended documents, only admins may edit projects/posts, and commenters may edit only their own comments. The client `ADMIN_EMAILS`/`ADMIN_UIDS` arrays do not enforce cloud authorization.
- Finding 3: `editorial-portfolio/home-projects.js` orders its query by `sortOrder`, which omits documents lacking that field. Projects/Blog listings do not use that query ordering. Query the collection without ordering and sort/limit locally if this is later fixed.
- Finding 4: both root and editorial first-save paths use a merged list containing local fallback records to decide whether to set `createdAt`. A first cloud save of a built-in project/post may therefore omit `createdAt` even though it creates a Firestore document. Distinguish known remote documents from local fallback records before changing this behavior.
- Finding 5: the two editors write different optional fields and order values to the same collections. Merge writes preserve unknown fields, but editorial-created records may omit root-only metadata, and editorial Projects uses `Date.now()` as a fallback `sortOrder` where root uses a sequential position. Document a shared field contract and test cross-site create/edit before refactoring.
- Finding 6: the legacy `firebase.json` sets Hosting `public` to the repository root and its ignore list does not comprehensively exclude local docs, media, dependencies or generated files. The chosen deployment path is Cloudflare's audited allowlisted package; do not run `firebase deploy` from this checkout.
- Data lifecycle note: deleting a `posts/{id}` document from the browser does not delete its `comments` subcollection; this is documented in the existing UI but should be accounted for in a future retention/cleanup policy. Already uploaded Storage objects also remain after edits/deletes by design.
- Naming assessment: code modules use lowercase hyphenated names and project IDs follow the same pattern. Existing media mixes capitalized folders, underscores and `.JPG`; all current references are exact case and work. Preserve these paths because existing links and the package allowlist depend on them. Use a documented lowercase hyphenated convention only for new media, with path/allowlist checks when adding approved assets. The tracked npm Firebase `^12.15.0` dependency is unused by the static site, which loads Firebase 8.10.1 CDN scripts; avoid treating `npm install` as a setup step.
- Concrete next step: restore both real ignored configs privately, inspect the deployed Firestore and Storage rules read-only, then rerun Projects/Blog in a local browser. Address the missing-config fallback and schema drift in a separate tested source change before any production write or deployment.

## Historical checkpoint — read-only portfolio review

- User request: review the current portfolio and suggest improvements. This was a read-only product/frontend review; no design, content, runtime, asset, dependency, Firebase or deployment changes were authorized or made.
- Re-read the full handoff and reviewed source plus rendered pages in the Codex in-app browser. A fresh local server ran at `http://127.0.0.1:8765/`. Desktop review used 1440x1000; mobile review used 390x844.
- The established main dark-grid visual identity remains strong and cohesive. Desktop Home and Contact and mobile Home showed clear typography, consistent spacing, no horizontal overflow and no relevant console warnings on the non-Firebase routes. The Home focus tabs and mobile layout remain usable. The editorial homepage provides a useful comparison because it surfaces selected project evidence much earlier.
- Highest-priority blocker is unchanged: both ignored Firebase configs are missing. Projects and Blog in both variants cannot complete their real rendered state and previously produced `auth is not defined`; restore the two real matching configs before accepting or changing those pages.
- Highest-value product improvement: add a restrained selected-work section to the main homepage using only already approved project records/assets, so a recruiter sees evidence and a direct case-study path immediately after the hero. Preserve the existing design rather than importing the editorial design wholesale.
- Content improvement: strengthen the best two or three project detail experiences with concise problem, individual role, process/constraints, tools and honest outcome/reflection. Current top-level language communicates breadth well but is often generic; do not invent metrics, clients or unverified claims.
- Conversion improvement: reduce the large desktop gap before the Contact card and prioritize the strongest professional channel(s). Add a direct email or resume link only if the user supplies/approves the actual destination/file.
- Accessibility improvement: replace root footer abbreviations `GH`, `IN` and `TG` with explicit accessible names (visible or `aria-label`); correct the About carousel's first label from “Show Stage 0” to human numbering; confirm tab/panel relationships with `aria-controls`/`aria-labelledby` during implementation.
- Discovery/SEO improvement: every reviewed page has one H1 and a meta description, but none of the 11 pages has canonical, Open Graph, Twitter card or JSON-LD metadata. Add these only after the production domain and approved share image are confirmed.
- Resilience/maintenance improvement: define a safe shared Firebase bootstrap so missing optional config leaves `auth`/`db` as `null` and still renders local fallback content. Reduce behavior drift between root/editorial Firebase implementations; the known editorial homepage `sortOrder` query discrepancy is evidence of duplicated logic diverging. Keep the two visual designs distinct.
- Performance improvement: after configs are restored, profile the real deployment before optimizing. Likely wins are loading Firebase only on data/admin routes, continuing opt-in 3D loading, and auditing fonts/script duplication; do not add a framework solely for optimization.
- Static audit: all 11 pages have exactly one H1, descriptions, image `alt` attributes, safe `rel` on `_blank` links and no duplicate IDs. No page currently has canonical/social/structured-data metadata. Core duplicated CSS/JS reviewed totals about 224 KB before Firebase/CDN resources.
- Concrete next step: privately restore both Firebase config files, rerun Projects/Blog desktop/mobile and console checks, then implement the homepage selected-work improvement first if the user approves. Any new asset, resume, email or production action still requires the existing explicit approval boundaries.

## Historical checkpoint — Mac clone and preview setup

- User request: clone `https://github.com/Jinghua2128/Portfolio`, use the latest `main`, read `MAC-HANDOFF.md`, `AGENTS.md` and all of this file, follow the Mac setup, preserve the existing site, and verify a local preview before further development.
- Fresh Mac checkout completed at `/Users/longmai2128/Portfolio`. `git fetch origin main` and `git merge --ff-only origin/main` reported already up to date. Local `main` and `origin/main` both point to `54355ea` (`Record verified GitHub transfer checkpoint`); the tracked worktree was clean before this documentation update.
- Required documents were read completely. No feature, content, design, asset, dependency, Firebase, deployment or production-data change was made.
- Mac tools found: Git 2.50.1, Python 3.9.6, Node 26.9.0 and npm 11.19.1. `pwsh`, a repository Playwright workflow and a standalone Playwright command were not available. The Codex in-app browser was used for read-only rendered checks.
- Both ignored prerequisites are missing: `firebase-config.js` and `editorial-portfolio/firebase-config.js`. `.env` is also absent. No placeholder config was created and no credentials were requested, printed or invented. The owner must privately restore the two completed, matching browser configs documented in `MAC-HANDOFF.md` before the Firebase-backed preview can be accepted.
- Fresh source checks passed: all root/editorial JavaScript files plus `firebase-config.example.js` passed `node --check`; `git diff --check` passed.
- A new local server was started from the repository root at `http://127.0.0.1:8765/`. Read-only browser checks at 1440x1000 covered all six root routes and all five editorial routes. Every route returned meaningful HTML, the expected title/H1, no framework error overlay, no horizontal overflow and no visibly exposed admin-only controls. Root Home focus tabs worked; the Motion selection updated its content. Desktop visual inspection preserved the established dark-grid design.
- Fresh 390x844 Home check passed for meaningful content, no horizontal overflow and the mobile navigation opening with all six links visible. No production login, save, upload, delete, third-party model load or Firebase write was attempted.
- Blocking preview finding: Projects and Blog on both site variants log `ReferenceError: auth is not defined` and remain on their loading states because the ignored config scripts are absent. This is the documented setup prerequisite, not a source change. Root Home/About/Contact/Immersion and the corresponding non-data editorial routes render. Do not continue feature development or claim a complete Mac preview until the two real configs are restored and Projects/Blog are rerun.
- Concrete next step: privately place the existing completed config at `firebase-config.js` and the identical copy at `editorial-portfolio/firebase-config.js`, keeping `ALLOW_ANY_SIGNED_IN_USER_TO_EDIT = false`. Then repeat the read-only desktop/mobile pass, including project cards/search/views, Blog entries/order/drawers, image loads, console health and visitor-only admin gating. Do not sign in or perform live writes without separate authorization.

## Historical checkpoint — GitHub transfer and Mac continuation

- User request: prepare a complete handoff for another Codex on the user's Mac and push the current project to GitHub before any further implementation. Stop feature work; documentation, transfer preparation and verification are in scope.
- Repository: `https://github.com/Jinghua2128/Portfolio.git`, branch `main`. On 22 September the remote and local base were both `5a2b4dd735f9a9e6a56f51239a64fcfe1a2dc835` (the original commit). The substantial existing source changes and user asset moves had not yet been committed. Preserve them.
- Transfer documents completed: `MAC-HANDOFF.md` covers architecture, Mac startup, configuration, approvals, evidence, limitations, next actions and a copyable Codex prompt; root `README.md` provides the entry point. Added `firebase-config.example.js`, updated `.gitignore` with deploy/media exclusions and `deploy/README.md` with clone limitations. Actual configs and excluded local files are untouched; runtime source is unchanged in this transfer task.
- Fresh verification on 22 September: all 16 root/editorial runtime JavaScript syntax checks and the new template passed; independent source review confirmed 19 retained / six public built-ins and 218 local references across 11 HTML pages with exact casing. Latest local deployment ZIP hashes to `62f3d063abc1a807e93e1a4c9a63bc7be4e11c7ad6353d5b4dc5bbde706dde0d`; all 41 archive entries match current source bytes, including eight approved media files. Targeted credential-pattern scan of 46 proposed text files found no matching private-key/token/service-account patterns (not a full security audit). No fresh rendered browser, Mac or live Firebase tests performed.
- Existing limitation discovered/documented: `editorial-portfolio/home-projects.js` still orders its remote query by `sortOrder`, which can omit remote homepage records without that field. The broader historical claim about removing query ordering applies to Projects/Blog listings, not this homepage. No runtime fix attempted during handoff.
- Pre-commit Git audit: staged tree contains 54 files and exactly eight approved media files; no `.env`, actual Firebase configs, portrait folders, APKs, logs or deployment outputs. Existing logo/blog asset moves are detected as renames. Independent review of the Mac guide/template/ignore policy found no blocking issues. A pre-existing broken `node_modules` line in the historical notes was corrected when the staged whitespace check exposed it.
- GitHub transfer completed: source/handoff commit `093dd0616a374611dee0649834afe34b0d0f39f0` (`Publish current portfolio source and Mac handoff`) was pushed to `origin/main`. Independent `git ls-remote --heads origin main` matched local HEAD exactly; the tracked worktree was clean. This documentation checkpoint follows that verified source push. No force push or history rewrite was used. Remote access required leaving the Windows sandbox after its TLS credential lookup failed.
- Scope of Git transfer: current runtime source, the eight approved existing media files, continuity/setup documentation and packaging recipe. Exclude `.env`, live Firebase configs, `node_modules`, logs, QA/browser profiles, deploy ZIPs/archives, private portraits, extra blog photos and the APK. Keep excluded local files intact. The original Git history already contains an old portrait; removing it from the current tree does not erase prior history.
- Mac configuration: this is a plain static site, with no build step and no npm start script. Its HTML uses Firebase 8.10.1 from CDN, independent of the unused npm Firebase dependency. Restore both ignored `firebase-config.js` files before checking the full site. Git does not carry Firestore/Storage data, accounts, rules, billing or browser drafts.
- No new deployment, billing/rules change, image upload, production write or additional asset approval is authorized by this transfer. The existing approved screenshots and three Sketchfab embeds remain approved; do not ask again for those exact uses.
- Final local checks: `git diff --cached --check` passed before the source commit. The source commit tracks 54 files, preserves the four existing logo/blog file renames, includes exactly eight approved media files and removes the already-deleted portrait path from the current tree. Local excluded originals remain intact. A GitHub Release and website deployment were not performed.
- Next action on Mac: clone/fetch current `main`, follow `MAC-HANDOFF.md`, read this entire history, restore both ignored Firebase configs, and run a new local read-only preview/check. Full Mac/live Firebase behavior remains unverified. No feature work remains required for this transfer; obtain the user's next objective after setup if none is supplied. The copyable new-task prompt is at the end of `MAC-HANDOFF.md`.

## Historical checkpoints

All sections below describe previous stages. Their old next steps, approval requests, package names and process/session IDs are historical; the current checkpoint above and `MAC-HANDOFF.md` take precedence.

## Previous checkpoint — phone uploads, newest-first Blog and project views packaged

- Objective: add admin-only photo selection/preview/upload to both main and editorial editors, preserve existing image URLs, design, content and Firebase document shapes. No new media is being published by this implementation/test task.
- Latest upload: `D:/Portfolio/deploy/14-September-2026-phone-image-uploads-newest-blog-project-views.zip` — **6,814,521 bytes**, **41 files**, root `index.html`, both sites included. SHA256 `62f3d063abc1a807e93e1a4c9a63bc7be4e11c7ad6353d5b4dc5bbde706dde0d`; matching checksum verified. This supersedes every older upload path below.
- Starting audit (historical): editors accepted URLs only; Firebase v8.10.1 CDN app/auth/firestore scripts and an existing Storage bucket config were present, but Storage SDK/upload handlers/rules were absent. Main editors use `PortfolioEditor`; editorial editors are legacy forms. Original source/dirty user moves preserved.
- Completed implementation approach: shared lazy-loaded Storage uploader for project image, blog cover and body images; phone-friendly picker, preview, resizing without cropping, clear errors/progress/cancel/retry; URL remains alternative. Upload fills existing URL field, separate Save/Publish retains existing Firestore merge behavior. No blobs/base64 stored in Firestore or localStorage.
- Production gate: billing/Storage provisioning/rules are unverified. Official Firebase docs require Blaze for Storage. No billing/rules deployment or production writes authorised/performed. Provide local setup guide and narrowly scoped admin-UID rules example; never overwrite existing rules wholesale.
- Implemented shared `image-upload.js/css`; main/editorial Blog and Projects integrations; Storage SDK is lazy-loaded only after explicit Upload. Projects fill the existing image URL; Blog supports cover and append-one-at-a-time body photos. Main editor draft/chip updates preserve URL fields. Inputs JPG/PNG/WebP <=12 MiB/40 MP, output <=2048px/4 MiB, browser re-encoding without crop. HEIC requires JPEG export. Images become public-addressable on Upload, before post Save; UI and docs state this. No automatic Storage deletions.
- Added `content-order.js`: Blog/Journal sort newest first by saved ISO/legacy date, then publication/creation timestamp or timestamp-like old sort order; ignore updatedAt. Collection snapshots no longer require sortOrder (so documents without it are retained). Newly created records get createdAt; existing records are not given invented dates.
- Added `project-highlights.js/css`: accessible keyboard tabs within the EXISTING featured area for Featured, In Progress and Latest, each <=3. Full project library and visibility policy retained. Featured uses explicit flags only; In Progress uses status; Latest requires a date/timestamp. No empty-slot fictional content or invented statuses. Editorial form now also has date/status fields, retaining unknown saved status/legacy date until changed.
- `FIREBASE-STORAGE-SETUP.md` and `storage.rules.example` are local owner instructions, not deployed rules or upload-ZIP content. Example restricts creates to configured admin UID in its own portfolio-media path, validates size/MIME, allows image gets and denies list/update/delete. Owner must merge/review existing broader rules and accept any billing setup. No live provisioning/billing/rules changes.
- September 12 helpers hit usage limits; editorial helper had made partial source edits, verified and continued locally. No further agents spawned in September 14 continuation.
- Checks: syntax for eight changed JS files passed. `uploads-ordering-qa.mjs` PASSED both sites' Projects and Blog at 1440x1000 and 390x844: fallback/identity, hidden visitor uploads/no Storage SDK, actual blog ordering, honest empty highlights, max3/group, keyboard tabs, picker without forced camera, type/size errors, preview without network upload, pending-selection submit blocking, failed upload preserves old image, body append, progress/cancel/late result, retry URL without duplicate upload, account/reset isolation, explicit save URL merge, no deletes, no overflow and no runtime/console errors. Local Auth/Firestore/Storage doubles only; no production writes. First run paused at existing draft confirmation; test now accepts that explicit confirmation and rerun passed.
- Evidence: QA script and `project-phone-upload-preview.png`, `blog-phone-upload-preview.png`, `project-highlight-views-mobile.png` in `D:/CodexData/home/visualizations/2026/08/20/01a01e33-ae42-7850-ab2a-105f2abbafd0/`. Screenshots inspected for mobile fit. Test photo is existing approved CarbonCreative JPG, transformed in memory only; no new public assets created.
- Final refinements: photo picker now retains its selected filename until upload/discard; helper paths updated; editorial Blog date writes stay consistent with changed legacy day/month fields while preserving untouched saved dates. Final image/ordering suite rerun passed, including signed-in non-admin gating and lazy Storage SDK network-failure recovery. No live write tests.
- Final full catalog regression PASSED: hidden record admin save/custom-field retention, visibility restore, six public / 19 retained, approved links, Blog related choices, all root routes/side Blog/homepage assets, no runtime exceptions. Its initial all-images assertion also counted empty hidden upload preview elements; test narrowed to actual image sources or non-hidden images, then passed. This was a test expectation update, not a missing-image production failure.
- All 16 runtime JS syntax checks passed. Packaging/private-file/local HTML reference audits passed; independently verified all 41 ZIP entries against source hashes and all eight approved media assets byte-identical to prior ZIP. Setup guide/rules example, secrets, local-only files and unapproved media excluded. Previous 10 September ZIP/checksum safely moved to `deploy/archive/14-September-2026-phone-image-uploads/` with both hashes unchanged. No deletion; user-extracted deploy folders preserved. `deploy/README.md` updated.
- Current preview HTTP session 61889 on 8765; hidden Edge CDP9334 profile `C:/Users/AL/AppData/Local/Temp/portfolio-upload-1e6e73a69c274cc4b7b4d7272019e690`. Browser plugin/Playwright unavailable, existing approved Edge/CDP fallback reused. Recheck after interruptions.
- Next: hand back new ZIP, preview, this handoff and `FIREBASE-STORAGE-SETUP.md`. Local implementation/package complete. User must review/enable Storage/Blaze/admin rules and test one authorised phone upload/save/reload before production upload functionality is verified. Do not deploy billing/rules, upload images, seed documents or delete assets automatically. Native iOS/Android file picker, real mobile image processing and live Storage/rules behavior remain untested. Usage-limit tool unavailable; no reset credits used.

## Previous checkpoint — approved screenshots packaged and verified

User explicitly approved the three existing homepage JPGs via response annotation 1: “yes do so”. They are now authorised for matching project cards and Details panels: Burnt Cones, CarbonCreative and EchoWorks. Approval includes only the previously proposed files/placements, not new artwork, portraits, thumbnails for other projects, or APKs.

- Implemented in source: `project-catalog.js` references the three approved JPGs, fills blank legacy previews (including EchoWorks), and exposes a render-only local-image path resolver for the editorial subdirectory. Both `projects-firebase.js` files preserve remote custom image/cover precedence and unknown fields while rendering these defaults. No Firebase writes or deletes were performed.
- `editorial-portfolio/projects.html` now accepts local paths in its existing image field (text input instead of URL-only native validation). `editorial-portfolio/styles.css` shows compact 80px approved thumbnails within the existing title cell, keeping the editorial row grid. Root design is unchanged. No image bytes generated or edited.
- Current upload: `D:/Portfolio/deploy/10-September-2026-add-approved-project-screenshots.zip` — **6,805,208 bytes**, **36 allowlisted files**, `index.html` at root and the editorial side site included. SHA256: `55e69c5f27f92877b71777804ee7726f1bd9bc16a50eb5ac22e495cdc88a8a54`. Matching `.zip.sha256` exists. This supersedes all older upload paths below.
- Packaging checks passed: independent read-only review verified all 36 archive files hash-match source, no duplicate entries, correct checksum basename/hash, and exactly eight approved media files. The five existing Logo/Blogs assets remain byte-identical to the prior release. No private/local files or unapproved media. Packaging script local HTML reference audit passed; all 13 root/side JavaScript files pass `node --check`.
- User explicitly authorised finishing the updated ZIP using the remaining five-hour allowance after the prior 20% reserve pause. This was a bounded packaging/verification/documentation pass, not permission for unrelated work or a usage reset. Latest check near start: **23% five-hour / 19% weekly remaining**. No reset consumed. Packaging is now complete; stop and hand back the deliverable. For future substantial work, recheck allowance and clarify reserve exceptions if needed.
- Browser checks PASSED both root and editorial Projects at 1440x1000 and 390x844: three card screenshots and matching Details images loaded from correct paths, images fit viewport, six public / 19 retained records, no visitor admin controls, blank legacy image fallbacks, custom Firebase image/cover priority and unknown-field preservation, valid editable local image paths, zero writes/deletes, and no runtime exceptions. Used a LOCAL Firebase test double, not real authentication or cloud persistence.
- First image QA run found editorial thumbnails hidden by existing CSS, preventing lazy loading; fixed with the compact title-cell thumbnail rule, then full image suite passed. Root desktop/mobile screenshots visually inspected in this packaging pass; no clipping or layout issue observed. Additional editorial desktop/mobile captures verified the 80px thumbnails and readable titles within the existing row layout, no overflow, no visitor admin, and no runtime exceptions. Browser plugin and Playwright unavailable; existing isolated Edge CDP fallback used. Firebase SDK deliberately blocked; no live authentication/writes. No runtime source changes in this packaging pass.
- Evidence folder: `D:/CodexData/home/visualizations/2026/08/20/01a01e33-ae42-7850-ab2a-105f2abbafd0/`. Inspected images: `approved-project-images-desktop.png`, `approved-project-image-mobile-details.png`, `approved-project-images-side-1440.png`, `approved-project-images-side-390.png`. Scripts: `approved-images-qa.mjs` (prior complete image interaction checks), `release-side-preview.mjs` (new read-only side captures). Previous broader `catalog-qa.mjs` suite was not rerun; no additional runtime code changed.
- Approved files: `imgs/Projects/BurntConesRevamp/BurntConesRevamp_HomePage.jpg` (1280x713), `imgs/Projects/CarbonCreative/CarbonCreative_HomePage.jpg` (1280x714), `imgs/Projects/EchoWorks/EchoWorks_HomePage.jpg` (1280x708). Existing JPGs approximately 16:9; already visually inspected. No Past Portfolio screenshot supplied.
- Previous curated ZIP/checksum moved to `deploy/archive/10-September-2026-approved-project-screenshots/` after exact resolved path, ancestor/reparse-point and collision checks; both hashes unchanged. Nothing permanently deleted. User-extracted deploy folder preserved. `deploy/README.md` and `WORK-RECOMMENDATIONS.md` now record the approved images/current package.
- Concrete next step: user uploads the new ZIP (not the workspace, archive folder, checksum or documentation). No further implementation required for this request. Production Firebase authentication/saves/rules and deployed behavior remain unverified; local-only catalog records are not necessarily stored in Firebase. No deployment or database migration occurred. Any further media, including a Past Portfolio screenshot, requires separate approval.
- Preview at `http://127.0.0.1:8765/projects.html`; Python HTTP session 19527, hidden isolated Edge CDP 9334, temporary profile `C:/Users/AL/AppData/Local/Temp/portfolio-images-698d5e6df17346b9a7504de900dd1f43`. Recheck processes after interruptions. Image QA session 44186 completed successfully (exit 0).
- Important: the screenshot approval is complete; do not ask for it again. Actual Firebase persistence/authentication still unverified as noted below; this approval does not authorise seeding/migrating records or deploying the site.

## Previous verified package — curated projects and repaired media paths (screenshot status superseded above)

This historical checkpoint supersedes older upload/status sections below, but not the current screenshot checkpoint above. User requested updated BurntConesRevamp, Carbon-Creative and NP-FED information; Personal Portfolio renamed Past Portfolio; listed old projects removed from public display but KEPT in Firebase. Implementation/QA/package complete for text, visibility and relocated existing media. Actual cloud persistence of local-only records remains unverified; screenshot source changes are documented above.

- Public list now has **six** entries: StickAR, LabRats, EchoWorks, Past Portfolio, Burnt Cones Website Revamp, Carbon Creative Website. All **19** catalog entries are retained. The 13 old entries (YL Clothes, requested studies, old Carbon branding campaign, editorial portfolio) are hidden by exact ID/title, not deleted.
- Burnt Cones appeared in both supplied-update links and pasted removal text; disclosed assumption is keep/update it. Carbon website uses NEW ID `carbon-creative-website` so the old branding campaign record remains intact. `personal-portfolio-website` ID retained for Past Portfolio. All three supplied HTTPS demos/repositories were verified reachable and reviewed as source; no unsupported Carbon client/marketing metrics or role claims copied.
- Shared `PortfolioProjectPolicy` in `project-catalog.js` prepares approved names/links and controls public visibility. `portfolioVisible: true/false` supports deliberate restoration/hiding; drafts stay excluded. Unknown fields/custom records preserved. Root/side renderers retain full merged records but filter public grids/featured work; side homepage and root Blog related choices use same visibility policy.
- New `project-management.js` gives signed-in admins access to all records, including hidden ones. Root `editor-tools.js` and side legacy form have “Show in public portfolio” controls; saves merge visibility into the existing record. Admin selector distinguishes built-in copies from records actually loaded from Firebase.
- No production Firebase reads/writes/deletes/authentication or migration were performed in this stage. Existing cloud records are untouched; local-only records are NOT necessarily saved remotely. To store those, use the authenticated project editor and save each record; do not claim all 19 exist in Firestore until verified. Visibility is display policy, not private storage.
- User moved existing assets into `imgs/Logo/`, `imgs/Blogs/`, `imgs/Projects/`, `imgs/Me/`. All 11 root/side HTML files now use moved logo/icon paths; both Blog scripts use moved existing photo paths and narrow render-only legacy URL aliases. All five existing image assets verified byte-identical to prior ZIP. Preserve user's file moves; no portraits/APK/new blog photos published.
- Still awaiting approval for these three existing JPGs (asked in commentary): `imgs/Projects/BurntConesRevamp/BurntConesRevamp_HomePage.jpg` (1280x713), `imgs/Projects/CarbonCreative/CarbonCreative_HomePage.jpg` (1280x714), `imgs/Projects/EchoWorks/EchoWorks_HomePage.jpg` (1280x708). Proposed matching project cards + Details panels, approximately 16:9. No new image references/files packaged yet; neutral previews remain. No Past Portfolio screenshot supplied.
- Checks passed: syntax (shared editor/manager, catalog, both project renderers, both Blog scripts, side homepage); visibility/merge policy units (19 retained / 6 public / 13 hidden, explicit restoration, draft exclusion, custom preservation); 60 moved-image alias/custom-preservation checks; 17 HTML image/icon references resolved.
- Fresh Edge CDP browser suite PASSED root/side Projects at 1440x1000 and 390x844: public/retained counts, correct names/links, no visitor admin controls, legacy saved hidden records suppressed, unrelated custom project retained, all-record admin selector, hidden record edit/save with merge + custom-field retention + NO delete calls, visibility restoration, logout gating, no horizontal overflow. Root Blog chooser has six public options; existing images load across all six main routes plus side Blog/homepage. Side homepage excludes hidden featured docs. No runtime exceptions. Firebase was a LOCAL TEST DOUBLE; no production persistence verified.
- Screenshots inspected: `D:/CodexData/home/visualizations/2026/08/20/01a01e33-ae42-7850-ab2a-105f2abbafd0/projects-curated-desktop.png` and `projects-curated-mobile.png`. Original design retained. Test script `catalog-qa.mjs` in same folder; browser plugin/Playwright absent, hidden isolated Edge fallback used.
- Latest upload: `D:/Portfolio/deploy/10-September-2026-curate-projects-preserve-records-fix-image-paths.zip` — **6,539,719 bytes**, 33 allowlisted entries with `index.html` at root. SHA256 `d643a9ff8f8817ba04a06473e3d67748ec5ba9c8a05ef24b56e2df26091cbd55`. Matching checksum exists; all 33 archived files hash-match source. Local HTML reference/private-file audits passed.
- Previous 8 September ZIP/checksum moved to `deploy/archive/10-September-2026-project-curation/` after exact path/link checks; hashes unchanged. Nothing permanently deleted. `deploy/README.md` and `WORK-RECOMMENDATIONS.md` updated. Keep day–full English month–year–exact update naming.
- Preview `http://127.0.0.1:8765/projects.html`; HTTP exec session 57463, isolated Edge CDP 9334, profile `C:/Users/AL/AppData/Local/Temp/portfolio-curation-1cd9f27cf9154ac3b829750f009d2c13`. Recheck after interruptions.
- Latest pre-final usage snapshot: 45% five-hour / 39% weekly remaining. User requires at least 20% reserve: recheck before extended work, checkpoint early and stop before approaching it. No reset used.
- Next: hand back ZIP/preview/handoff and request explicit approval for the three proposed screenshots. If approved, reference existing screenshot paths, handle side-site relative paths, include only those approved files in allowlist, rerun rendering and make a NEW descriptive ZIP. If user wants all records actually stored in Firebase, authenticate/verify with their direction; do not auto-seed, overwrite, or delete existing documents. No deployment performed.

## Previous checkpoint — deploy cleanup and descriptive release names

This checkpoint supersedes all earlier upload paths below. User requested a clean deploy folder and filenames containing day, month and the exact update; then asked to leave 20% usage available. No website/runtime code changed in this stage.

- Upload `D:/Portfolio/deploy/08-September-2026-display-name-only-on-create-account.zip`. This is byte-for-byte identical to verified v4, with the actual update date retained (8 September). Full website included, not a patch. Size: **6,537,888 bytes**, 32 entries.
- SHA256: `45dfc9269393d35ad8290a30ee8007b4e06a8df5146173df4029e37ae072887a`. Matching `.zip.sha256` contains the NEW filename and verified hash.
- Deploy top level now contains only this ZIP/checksum, `package-cloudbase.ps1`, `README.md`, and `archive/`.
- Moved 24 old top-level items (old ZIPs/checksums, 10 preview PNGs, and 3 extracted folders including `12`) to `D:/Portfolio/deploy/archive/09-September-2026-deploy-cleanup/`, preserving original names/contents. All **85 file hashes** matched before/after moves. No permanent deletion. Reparse-point/path/destination collision checks preceded moves.
- Trusted original-design snapshot is now `D:/Portfolio/deploy/archive/09-September-2026-deploy-cleanup/liuguangxuan-cloudflare-pages/`. The old deployment paths below are historical; look under the archive for them. No active runtime references to the moved paths were found.
- `deploy/package-cloudbase.ps1` now accepts `-UpdateDescription 'specific-lowercase-hyphenated-change'`, optional `-ReleaseDate 'YYYY-MM-DD'` (defaults to today), or explicit `-ArchiveName`. Enforces `DD-Month-YYYY-exact-update.zip` using full English months and valid dates. No default description that could mislabel future changes. Existing ZIPs are never overwritten.
- `deploy/README.md` explains the current upload, naming, rebuild commands, checksum, and archive policy. Do not upload README/script/checksum/archive or the workspace root.
- Checks passed: successful descriptive-name package creation, 32-entry allowlist/private-file/local-reference audits, new ZIP byte-identical to v4, checksum basename/hash, independent 32-file source comparison, all 85 moved-file hashes, invalid/missing description rejection, impossible-date/old-format rejection, and overwrite prevention. No new rendered testing needed: runtime/assets unchanged. Previous UI verification remains below; real Firebase authentication/rules remain untested.
- Latest account-usage snapshot: 99% remaining in the 5-hour window, 63% in the weekly window. User requests at least 20% reserve; stop before approaching it, checkpoint early, and recheck before extended work. Usage is account-wide; no reset credit was used and no monitoring automation was created.
- Next: hand back renamed ZIP and this document; cleanup is complete. No deployment or additional implementation is authorized/needed for this request. Preserve prior asset/project approvals and user edits.

## Previous checkpoint — Display name only during account creation (8 September)

This checkpoint supersedes the September 6 status below. The current request is a small account-form behavior fix; all existing design, content and Firebase handlers remain unchanged.

- Updated `blog.html`, `projects.html` and their `editorial-portfolio/` equivalents: Display name label/input initially hidden, input disabled.
- Updated both `script.js` files: show/enable name only for Create account, hide/disable for Login, preserve typed name while switching, synchronize on initialization/pageshow and after form reset (microtask).
- Both scripts pass `node --check`. Independent read-only review confirms all four Firebase handlers use name only for registration and already reset after success; no authentication code changes needed.
- Edge CDP checks passed all requested UI states on all four routes at 1440x1000 and 390x844: initial Login, keyboard selection of Create account/back, optional/focusable name on signup, hidden field skipped by reverse Tab, preserved name when switching, reset, restored selection/pageshow, Escape/reopen, no horizontal overflow and no runtime exceptions. Screenshots inspected: original styling retained and name visibility correct.
- Final UI suite PASSED after allowing only the exact expected Firebase-SDK-unavailable warning. First blanket no-warning assertion failed on that deliberate offline condition, not a code exception. Test intentionally blocks Firebase SDK; real account creation/login remains untested. No database writes or deployment.
- Temporary QA script/screenshots: `C:/Users/AL/AppData/Local/Temp/portfolio-auth-c4c675e095704d668a9b472bdc67b734/`. Browser plugin/Playwright unavailable; approved hidden isolated Edge fallback on port 9334, HTTP preview on 8765 (exec session 29058). Recheck after interruptions.
- Latest upload ZIP: `D:/Portfolio/deploy/liu-guangxuan-portfolio-2026-09-08-v4.zip` — **6,537,888 bytes**, 32 allowlisted entries, `index.html` at archive root. Supersedes September 6 v3 and all older archives; previous files preserved.
- SHA256: `45dfc9269393d35ad8290a30ee8007b4e06a8df5146173df4029e37ae072887a`; matching `.zip.sha256` exists. All 32 archived file hashes match source. Private-file exclusion and local HTML reference audits passed. `deploy/package-cloudbase.ps1` defaults to v4, still refuses to overwrite packages.
- Preview: `http://127.0.0.1:8765/blog.html` (open account drawer, then change Action). Screenshots in the QA directory above: `auth-login-desktop.png` and `auth-register-mobile.png`; Firebase-unavailable notice is the deliberate SDK-blocked QA state, not evidence of a production outage.
- Next step: no further implementation required for the display-name request. Hand back v4 ZIP, preview and HANDOFF.md. User can upload v4; production authentication/rules still need authorized testing. If interrupted, recheck preview availability. Keep earlier content/asset approval limits unchanged.
- No new assets, dependencies, production writes, or changes to unrelated projects. Earlier asset/project approval boundaries below remain in force.

## Previous checkpoint — approved stage completed, 6 September (superseded above)

This historical checkpoint supersedes the older sections below it, but NOT the current September 8 checkpoint above. The main site retains its original dark grid identity. No deployment or production Firebase write has been performed.

### Latest deliverable — upload v3 only

- ZIP: `D:/Portfolio/deploy/liu-guangxuan-portfolio-2026-09-06-v3.zip`
- Size: **6,537,289 bytes**; 32 allowlisted files, with `index.html` at archive root and the editorial side site included.
- SHA256: `2e3f18fdbc0c1b00da80afa4bb3c252ca4c54cf81fc97c3cb9dcd77711c9de13`
- Matching `.zip.sha256` file exists. All 32 archived file hashes were compared to current source and match.
- September v1/v2 and August archives remain preserved but are superseded. Do not upload them.
- `deploy/package-cloudbase.ps1` now explicitly lists runtime files, five existing image/icon assets and side-site files. No recursive media collection. It rejects missing HTML references and private files and refuses to overwrite existing archives. Rebuild with a NEW `-ArchiveName` if code changes.
- Excluded: `.env`, `.git`, `node_modules`, logs, QA, handoffs, old ZIPs and the unused `Me_np.jpg` portrait. Do not deploy the workspace root using the current `firebase.json` public="." configuration.

### Latest approvals applied

- Main catalog now has **18 projects**: the original 17 plus **Burnt Cones Website Revamp** (`burnt-cones-website-revamp`, no. 18, not featured). User did all website work; teammates made the logo, promotional materials and documentation. Added verified repository/demo links and explicit credits. Commission status and dates are unconfirmed: no client/commission/date claims. Neutral initials preview, no new image.
- Updated the existing **EchoWorks** entry, no duplicate: user did the website versions and full-site revamp, with UI from **Gracie** and first scenario scene from **KaiMing**. Website role, collaborator credits and verified web demo/repository links are now present.
- Corrected the same outdated Unity attribution in the editorial side site's project fallback/copy and homepage link. Its design/layout are unchanged. Burnt Cones was added to the main catalog only, not duplicated into the standalone side-site defaults.
- Exact known legacy EchoWorks Unity copy is corrected at render-merge time; custom revised Firebase copy and unknown fields are preserved. No database migration writes.
- Added editable **Collaborators & credits** to the shared project editor and project detail view.
- `WORK-RECOMMENDATIONS.md` records the approvals, evidence and remaining candidates. LabStats is still only a possible supporting LabRats link. CourseCarry remains excluded as experimental alpha.

### Completed feature work

- Motion/keyboard refinements: default-visible reveals, live reduced-motion handling, restrained existing hover/parallax, tab-group keys, slideshow pause, mobile Escape, modal inertness/focus/reopen handling. Original palette, type and layout retained.
- `editor-tools.js` / `editor-tools.css`: grouped labels, helpers, tool/tag/image-URL chips, text preview, validation, visible errors, explicit New vs Edit, UID-scoped recoverable local drafts, pending-save feedback. New Project/Post now starts a new record rather than reopening the previous edited item.
- Firebase integrations retain legacy fields, IDs, sort order and merge behavior; numeric and non-ISO dates remain supported. Pending save from admin A cannot delete admin B's draft. Unfinished chip text is included in draft snapshots.
- `project-catalog.js` provides one main catalog to Projects and Blog's related-project selector (18 entries). Existing real blog entries remain three.
- `immersion.html/css/js`: three approved Sketchfab models, click-to-load, one iframe at a time, model navigation, loading/error/retry, keyboard camera controls, reduced-motion response, resource release and non-3D source links. No new images/textures/videos/model files added.
- Root pages link to 3D Immersion, Sketchfab and supplied ArtStation. ArtStation endpoints return a 403 challenge: do not claim its artwork/profile contents were verified.
- `AGENTS.md` contains the reusable continuity policy the user requested and adopted. Copy/merge into other projects, do not overwrite their existing policies automatically.

### Gallery approval boundary

User approved Sketchfab embeds for:

1. `Chess pices - Knight` — `6fbc704037754126ae66f0604db4d62b` — Maya, Substance Painter.
2. `hologram` — `30e4d2f5ffda42718012338c096c9cc5` — Maya, Substance Painter.
3. `Crystals` — `9daa1337b6704d8cb0d3a6ce90513fea` — Maya, Substance Painter, ZBrush.

Titles preserve source spelling. No descriptions supplied; none invented. Other models and any new thumbnails/artwork require approval. User explicitly chose **Sketchfab embed-first**. Current gallery uses Sketchfab Viewer API, NOT a native Three.js renderer. Native Three.js remains a later stage requiring authorised GLB/GLTF files; never extract models from Sketchfab.

### Final verification

- Final Edge CDP regression suite on the 18-project version PASSED completely: approved roles/credits/no duplicate, legacy correction/custom-field preservation, search, hidden visitor tools, chips/autosave, failed-save retention, new-record flow, merge payloads, legacy dates, related-project options, unsafe URL rejection, logout/reload/restore, account switch during pending publish, modal Escape/inertness, reduced-motion, gallery states/cameras and Contact links.
- Desktop 1440×1000 and mobile 390×844 checks: meaningful pages, no horizontal overflow on tested routes, screenshots inspected, no error overlay, no runtime exceptions.
- LIVE Sketchfab checks rerun after final changes: all three real models rendered, reached viewerready, returned cameras and responded to rotate/reset. Screenshots `portfolio-immersion-live-0.png` through `-2.png` reflect the compact final gallery layout.
- Separate unmocked read-only site check passed all six root routes and editorial homepage, with no runtime exceptions and visitor tools hidden. This preceded the final attribution-only edits; those edits passed the final mock regression suite.
- JS syntax, local HTML reference audit and final archive hash comparison passed.
- **Production Firebase saves/authentication/security rules remain untested.** Write-path tests used a local test double with Firebase CDN blocked. Local drafts are not cloud-private documents; a local revision does not unpublish an existing public item. Frontend admin gating is not a substitute for Firestore rules.
- Actual mobile GPU performance and screen-reader behavior inside the third-party iframe need real-device testing. Outer controls/non-3D fallbacks were checked.

### Preview / test environment

- Preview: `http://127.0.0.1:8765/index.html`; gallery: `http://127.0.0.1:8765/immersion.html`.
- Python HTTP server currently exec session **40612**. Hidden isolated Edge CDP port **9334**. Recheck availability after any task/usage interruption; earlier servers/browsers stopped during interruptions.
- Current Edge temporary profile: `C:/Users/AL/AppData/Local/Temp/portfolio-final-ed9514206a5d45c2bf1430d164564e78`.
- Browser plugin/Playwright were unavailable. Approved hidden Edge/CDP fallback used; initial sandboxed GPU launch failed. QA brings its dedicated tab to front, disables cache and awaits matchMedia changes.
- QA script: `D:/CodexData/home/visualizations/2026/08/20/01a01e33-ae42-7850-ab2a-105f2abbafd0/portfolio-qa.mjs`.
- Run with Node for mock/editor suite; `live-gallery` for real approved embeds; `live-site` for a fresh unmocked read-only tab. Do not run suites concurrently in the same test tab.
- Screenshots in that same directory: `portfolio-home-desktop.png`, `portfolio-project-editor.png`, `portfolio-projects-mobile.png`, `portfolio-blog-editor.png`, `portfolio-immersion-desktop.png`, `portfolio-immersion-mobile.png`, `portfolio-immersion-live-0.png` to `-2.png`.
- Codex gallery preview open request returned queued; not confirmed displayed. Direct localhost links and screenshots are available.

### Next action

Hand back v3 ZIP, preview and AGENTS.md/HANDOFF.md. No implementation work is required for this approved stage. Further native Three.js/assets, other project additions, deployment or production-admin testing need the relevant assets/approval/access. Preserve the dirty worktree and existing firebase-config.js/.env; never print/package secrets or restore removed portrait/ECHO GX content. Continue checkpointing after verified stages and before likely limits; exact usage cutoff cannot be predicted.

## Earlier September checkpoint (superseded)

This section supersedes the historical stopped status below. The user explicitly asked to continue on 2026-09-05.

- Preserve the established dark grid identity, fonts, palette, layout, real content, contact links and Firebase behavior. Do not redesign the main site or alter the editorial side site.
- Current task: refine accessible lightweight motion; improve project/blog editors with labeled fields, validation, previews and recoverable local drafts; research public GitHub work; add verified creative profile links; build an empty, approval-gated Three.js `3D Immersion` gallery.
- Never add images, thumbnails, textures, videos, models or external embeds without asking for the specific asset and receiving approval. No new projects or gallery entries may be published without approval. No production Firebase writes or deployment are authorized by local implementation work.
- Repository and existing editors audited. Existing scroll/card motion and local Firebase-loading fallbacks already exist. Main gaps: placeholder-only editor fields, comma-separated metadata, hidden save errors, no draft recovery, and reveal content depending on JavaScript visibility.
- Planned stages: (1) motion/accessibility, (2) backward-compatible editor improvements, (3) empty gallery infrastructure and public-work recommendations, then browser/static verification.
- Draft privacy: Firestore rules are not tracked/verified. Keep unpublished drafts local and scoped to the signed-in admin UID; do not assume a `draft` field makes a public document private.
- Existing `firebase-config.js` has user changes since the August handoff (missing-SDK guards and explicit admin configuration). Preserve it. `.env` exists: do not read, print, commit, or package it.
- Three parallel helpers failed at the account usage limit; they made no edits. Continue locally; do not assume their assigned work was completed.
- September implementation in progress: `script.js` now has default-visible WAAPI reveals, dynamic reduced-motion handling, keyboard tab navigation, carousel pause, modal background inertness and reopen-race guards. `styles.css` adds restrained accessibility overrides; existing design tokens/layout are unchanged.
- Added `editor-tools.js` / `editor-tools.css` for grouped labels, chip inputs, text preview, URL validation, UID-scoped local draft recovery and save-status messaging. Integrated additional optional fields into `projects-firebase.js` / `blog-firebase.js`, retaining legacy Firebase fields and merge writes. These edits passed JS syntax checks but have NOT yet completed browser/regression validation.
- Important next editor checks: chip typing/autosave, pending draft recovery, save failure retaining text, account switch during save, public visitor controls, legacy dates/unknown fields, and new related-project selection. Production Firebase was NOT written to.
- Public GitHub metadata and READMEs inspected via unauthenticated Node fetch (web research fetch failed). BurntConesRevamp has a live HTTP 200 GitHub Pages demo; EchoWorks has a live HTTP 200 Firebase demo and is already listed, so recommend updating its existing entry only after approval. CourseCarry README explicitly says experimental alpha: do NOT add it under the finished-work brief. NP-FED is a live older portfolio, likely redundant. More detailed recommendations still need documenting.
- Sketchfab public profile verified, six published models found. User APPROVED Sketchfab embeds for the proposed three-model starting selection: `Chess pices - Knight` (`6fbc704037754126ae66f0604db4d62b`), `hologram` (`30e4d2f5ffda42718012338c096c9cc5`), `Crystals` (`9daa1337b6704d8cb0d3a6ce90513fea`). User states all use Maya and Substance Painter; Crystals also uses ZBrush. No descriptions were supplied: omit them, do not invent. Other models and all new thumbnail/image/GLB assets remain unapproved.
- ArtStation profile and public endpoints return HTTP 403 security challenge; do not claim profile/artwork verification. User-provided link can be preserved as supplied, with verification caveat in the final/handoff.
- QA infrastructure: Python HTTP server running in exec session 5154 at `http://127.0.0.1:8765`. Browser plugin and Playwright absent. Sandboxed Edge crashed its GPU process. An approved hidden unsandboxed Edge launch on port 9334 was attempted with temporary profile `C:\Users\AL\AppData\Local\Temp\portfolio-check-080c0eb7a1b842f49474eb23c8acf672`; verify the port before using. QA files/screenshots belong outside the repository in the provided visualizations workspace.
- Latest instruction: checkpoint this document after verified stages and before a likely context/usage cutoff. Exact cutoff cannot be predicted. A reusable policy is supplied in `AGENTS.md`; do not modify unrelated projects automatically.

### Verified September stage and current continuation

- Shared catalog extracted into `project-catalog.js` (all 17 original records/order compared exactly). Projects consumes the same catalog; Blog now combines it with remote records for its related-project selector.
- Read-only helper review identified draft account-switch race, unfinished chip loss and legacy date risks. Fixes applied: capture publishing UID; save draft before network request; include unfinished chip text in snapshots; preserve untouched legacy date strings; numeric blog days supported. These deeper fixes still need explicit regression tests beyond the first successful smoke suite.
- First Edge CDP smoke suite PASSED at 1440×1000 and 390×844: 17 projects, 3 posts, search, hidden visitor controls, modal inertness/Escape, local-only autosave, chip Enter, failed-save retention, merge fields/legacy dates/sort order, live reduced-motion, mobile menu and no horizontal overflow. No page runtime exceptions. Firebase was replaced by a local test double and CDN blocked; production writes/rules/auth remain untested.
- The first failed drawer test was a background test-tab animation-frame issue, resolved by bringing the dedicated QA tab to front. The first reduced-motion assertion was too early; waiting for matchMedia's change event resolved it.
- New `immersion.html`, `immersion.css`, `immersion.js`: approved embed-first gallery with all three verified titles/tools, opt-in SDK/model loading, one iframe at a time, camera buttons, release-on-close/hidden tab, reduced-motion handling and non-3D links. Native self-hosted Three.js is deferred until authorised model files are supplied, consistent with user's “use the sketchfab embed first”; do NOT claim the current renderer is Three.js.
- Root five-page navigation now links to 3D Immersion. Sketchfab/ArtStation links added to root footers and Contact, with the ArtStation verification limitation above. Editorial side site remains unchanged.
- `WORK-RECOMMENDATIONS.md` records source-backed recommendations and future asset requests. BurntCones and EchoWorks updates still need user approval; none were added/published.
- Current server: local HTTP exec session 65533 on 8765. Hidden Edge CDP on 9334, fresh temporary profile `C:\Users\AL\AppData\Local\Temp\portfolio-verify-f5b0b78521374fa49618e5610664da0d`. Recheck availability after a break.
- QA script and screenshots: `D:\CodexData\home\visualizations\2026\08\20\01a01e33-ae42-7850-ab2a-105f2abbafd0\portfolio-qa.mjs` and `portfolio-home-desktop.png`, `portfolio-project-editor.png`, `portfolio-projects-mobile.png`, `portfolio-blog-editor.png` in the same directory. Do not include QA files in upload archives.

### Latest verification

- Expanded Edge CDP suite passed: complete draft save/logout/reload/restore cycle, rejection of unsafe URL before save, preserved non-ISO and numeric legacy dates, all 17 built-in related-project choices, and account A's pending save cannot clear account B's draft.
- Gallery mocked checks passed: three approved items only, no iframe on initial load, correct Crystals/ZBrush metadata, one iframe at a time, camera rotate/zoom/reset API calls, live reduced-motion unload, error/retry fallback and 390px mobile width without overflow. Root Contact links/mobile layout also passed. No runtime exceptions.
- LIVE Sketchfab SDK tested (not mocked) for all three approved models: each reached `viewerready`, supplied a camera, and rendered in the iframe. Real rotate/reset button calls exercised. No runtime exceptions. Live screenshots are `portfolio-immersion-live-0.png` through `-2.png` in the QA directory.
- Visual inspection showed excess inherited whitespace on the NEW gallery page only. Its heading/section spacing was tightened; existing page layout remains unchanged. Editor select styling now matches existing inputs. These final small adjustments need the final rerun.
- Follow-up gallery-review helper hit the usage limit; no gallery changes from it. Main agent verified the documented camera/pause API through the official Sketchfab documentation and live browser tests.

Next: final rerun after spacing/keyboard refinements, reference/asset checks, then create a new allowlisted dated ZIP and show the preview. Do not upload the stale August ZIP. No deployment or production Firebase writes have been performed.

## Historical notes (August; not current status)

## Immediate Status — User Stopped Work

The user explicitly said: `stop right now, write the handoff doc`.

Do not continue implementation automatically. The next task should first confirm whether the user wants to resume the work described below.

## Latest Requested Direction

The user changed the portfolio direction after the full editorial redesign:

- Keep the established dark, grid-based portfolio design as the main website.
- Make only restrained enhancements to the main design, especially scrolling effects, animation, and immersive interaction details.
- Preserve the bold orange/black editorial redesign as a separate side website.
- Add that side website to the main Projects page as a real project.
- Keep all existing Firebase blog/project editing behavior and real content.
- Do not add or replace image assets without asking first.

## Work Completed in the Current Pass

- Preserved the full bold editorial redesign as a standalone site at:

```text
D:\Portfolio\editorial-portfolio\
```

  It contains its own five HTML pages plus its CSS and JavaScript files. It shares the existing root `imgs` directory through `../imgs/...`; no image was copied, added, replaced, or generated.

- Restored the main root website from the established deployment reference at:

```text
D:\Portfolio\deploy\liuguangxuan-cloudflare-pages\
```

  This brought back the previous dark grid design, navigation, homepage layout, About page, Projects page, Blog page, Contact page, and Firebase editors.

- Added a real seventeenth default project to root `projects-firebase.js`:

```text
id: editorial-portfolio-experience
title: Editorial Portfolio Experience
link: editorial-portfolio/index.html
```

  The project truthfully describes the alternate portfolio website and opens it in a new tab. It is not marked featured, so the original three featured projects remain unchanged.

- Added a lightweight immersive motion layer to the restored main design:
  - Thin scroll progress indicator.
  - Slightly stronger navbar state after scrolling.
  - Pointer-responsive hero spotlight.
  - Subtle hero-grid pointer depth and scroll parallax.
  - Animated scroll cue.
  - Section-rule draw animation.
  - Small stagger rhythm for existing card/list reveals.
  - Very restrained pointer tilt on project/blog/info cards for fine-pointer devices.
  - Small primary-button light sweep.
  - Full `prefers-reduced-motion` handling.

- Preserved the existing motion and interaction features already in the original design, including page wipes, drawers, mobile navigation, focus lab tabs, skill tabs, project filters/search, life carousel, contact previews, and hero-grid tile lighting.

- Restored immediate local fallback rendering while Firebase connects:
  - Projects render the real local project list immediately, then merge live Firestore data.
  - Blog renders the existing three local entries immediately, then merges live Firestore data.

- Removed the now-unused root `home-projects.js`. The side website keeps its own copy because its redesigned homepage uses it.

## Files Changed in the Current Pass

- `index.html`, `about.html`, `projects.html`, `blog.html`, `contact.html`
  - Restored to the established main design from the existing deployment reference.
- `styles.css`
  - Restored main design plus appended immersive motion layer.
- `script.js`
  - Restored main behavior plus appended scroll, hero, section, and card motion logic.
- `projects-firebase.js`
  - Restored main Firebase behavior, added project 17, and added immediate fallback rendering.
- `blog-firebase.js`
  - Restored main Firebase behavior and added immediate fallback rendering.
- `firebase-config.js`
  - Restored from the established deployment reference; its hash matched the pre-change version.
- `home-projects.js`
  - Deleted from root because only the side website needs it.
- `editorial-portfolio/`
  - New standalone copy of the bold editorial redesign with corrected shared image paths.
- `deploy/preview-main-before-reference.png`
- `deploy/preview-main-motion-desktop.png`
- `deploy/preview-main-motion-mobile.png`
- `deploy/preview-main-projects-motion.png`
- `deploy/preview-editorial-side-site.png`
  - Browser QA previews generated during this pass.

## Validation Completed in the Current Pass

Browser/IAB was unavailable and Playwright is not installed, so Microsoft Edge headless mode was used through the Chrome DevTools Protocol.

- JavaScript syntax checks passed for the root main scripts and every JavaScript file inside `editorial-portfolio/`.
- Main homepage was captured at 1440×1000 and compared directly with the untouched established deployment reference.
  - Same title, hero copy, navigation, focus tabs, composition, palette, typography, and card structure.
  - The new effects do not visibly redesign the page.
- Main homepage mobile check at 390×844:
  - `documentElement.scrollWidth` was 390.
  - No horizontal overflow.
  - Hero title remained inside the viewport.
  - Hamburger menu opened correctly and updated `aria-expanded`.
- Motion behavior verified:
  - Hero pointer variables updated.
  - Scroll progress updated.
  - Navbar acquired its scrolled state.
  - Sections entered the motion-visible state.
  - All 17 dynamically rendered project cards received the restrained motion class.
- Reduced-motion emulation verified:
  - Scroll progress hidden.
  - Hero-grid transform disabled.
  - Scroll-cue animation disabled.
  - Required content remained visible.
- Projects page verified:
  - 17 project cards.
  - Original three featured cards unchanged.
  - `Editorial Portfolio Experience` present.
  - Its URL is `editorial-portfolio/index.html` with `_blank` behavior.
  - Searching its exact title returned one result and `1 WORK SHOWN / 17`.
  - Project account drawer opened, focused a control, closed with Escape, and cleared the body drawer state.
- Blog page verified:
  - Three real posts rendered immediately.
  - All three existing images loaded.
  - Read-more drawer opened with the real EchoWorks post.
- About page verified:
  - Five life slides and six skill tabs remained present.
- Contact page verified:
  - LinkedIn, GitHub, Telegram, and the existing Website link remained unchanged.
- Editorial side site verified:
  - Loaded successfully at `editorial-portfolio/index.html`.
  - Retained the bold orange/black editorial hero and three real homepage project rows.
  - Shared favicon path resolves through `../imgs/icon.ico`.
- No JavaScript runtime exceptions were recorded during the tested flows.

## Important Unfinished Work

- The current CloudBase archive is stale:

```text
D:\Portfolio\deploy\liu-guangxuan-portfolio-cloudbase.zip
```

  It was created before this direction change, when the editorial redesign was still the root website. Do **not** upload it in its current state.

- A fresh upload archive still needs to be built with:
  - The restored/enhanced root main site.
  - The full `editorial-portfolio/` side site.
  - The shared root `imgs/` directory.
  - No `.env`, `.git`, `node_modules`, logs, QA browser profiles, old deploy packages, or preview images.

- Run one final local-reference scan after packaging, including nested `editorial-portfolio` paths.
- Inspect ZIP entries after packaging and confirm `index.html` is at the archive root.
- If work resumes, repeat the final reference-vs-current screenshot comparison after any new edit.

## Current Risks / Pitfalls

- The working tree was already dirty before this pass. Do not run `git reset`, `git checkout --`, or overwrite files from Git history.
- `deploy/liuguangxuan-cloudflare-pages/` is the trusted pre-redesign visual reference. Preserve it unless the user explicitly asks to replace it.
- The older `deploy/liuguangxuan-cloudflare-pages.zip` also remains untouched.
- Do not upload the stale CloudBase ZIP named above.
- Do not add, copy, replace, or generate image assets without first asking the user for the image, purpose, aspect ratio, and placement.
- The side website intentionally shares the existing Firebase project/blog collections. Its account/editor behavior is therefore still functional.
- Do not make further wholesale visual changes to the main root site. The user explicitly wants its established design preserved.
- Keep new motion lightweight, purposeful, keyboard-safe, and reduced-motion compatible.
- Do not invent portfolio projects, credentials, clients, metrics, or links.

## Exact Next Steps If the User Resumes

1. Read this `HANDOFF.md` before doing anything.
2. Confirm the user wants to resume packaging or request further design changes.
3. Run `git status --short` and preserve all unrelated/user-owned changes.
4. Run final syntax and nested local-reference checks.
5. Rebuild `deploy/liu-guangxuan-portfolio-cloudbase.zip` from an explicit allowlist.
6. Inspect the ZIP entries and hash.
7. Run one final desktop/mobile browser pass and compare the established reference screenshot with the latest main-site screenshot using `view_image`.
8. Hand back the updated ZIP and preview paths.

## Current Task / Project Goal

This project is Liu GuangXuan's personal portfolio website for internship and job applications in immersive media, game design, motion graphics, interactive development, UI/UX, 3D design, and multimedia production.

The current goal is to keep the site professional, minimalist, responsive, and believable as a polytechnic student portfolio while preserving the existing multi-page structure and Firebase-backed blog/project editing features.

Project path:

```text
D:\Portfolio
```

Local preview:

```text
http://127.0.0.1:5180/index.html
```

Cloudflare Pages upload zip:

```text
D:\Portfolio\deploy\liuguangxuan-cloudflare-pages.zip
```

## Completed Work

- Refined the portfolio into a cleaner, more professional multi-page website.
- Preserved the current structure: `index.html`, `about.html`, `projects.html`, `blog.html`, and `contact.html`.
- Removed the resume page from the active site flow.
- Improved the homepage with a stronger portfolio overview section.
- Improved contact page presentation and kept only existing contact/social links.
- Added logo-style icons for the Contact page links:
  - LinkedIn
  - GitHub
  - Telegram
  - Website
- Added shared drawer behavior in `script.js`:
  - Side drawer open/close
  - Overlay backdrop
  - Escape key close
  - Focus return
  - Mobile menu support
  - Page transition animation
- Improved Blog page:
  - Blog account/login drawer
  - Blog post editor drawer
  - Read-more drawer
  - Signed-out comment prompt
  - "Log in to comment" button
  - Firebase post/comment support
  - Admin edit/delete support for posts and comments
- Improved Projects page:
  - Project account/login drawer
  - Project editor drawer
  - Firebase project saving/editing/deleting
  - Featured checkbox for projects
  - Top 3 featured project orbit section
  - Mobile stacked project layout
- Added support for project/blog image URLs and optional external links.
- Fixed hidden admin buttons showing while signed out on mobile.
- Rebuilt the Cloudflare Pages upload zip after the latest changes.
- Moved the project from C:\Users\AL\Documents\Portfolio to D:\Portfolio.
- Removed the Echo/ECHO GX About-page character block and deleted the unused Echo image assets from imgs.
- Replaced the About-page real portrait with a face-free creative snapshot board, so the About page no longer displays `imgs/Me_np.jpg`.
- Adjusted project admin behavior so logged-in admins can edit default project cards and save those edited versions into Firebase; default fallback cards are still not deleted locally.
- Rebuilt the Cloudflare Pages upload zip and excluded the unused real-face image from the deploy package.
- Reworked the Projects page defaults into ASG/CA-level cards using evidence from D:\PoliteMall_NP_Course_Briefs_2026-07-15, including StickAR, LabRats, 3D walkthrough work, motion graphics CAs, UX testing, level design, branding, experiential design, and real-time 3D studies.
- Updated projects-firebase.js so default project cards are always merged with Firebase projects, while Firebase projects with echo in the id/title are filtered out.
- Reworded the Projects page so visible cards do not say ASG, CA, assignment, course, or school project; each card now says what Liu did and which tools were used.
- Added a small display cleanup helper in `projects-firebase.js` so older Firebase-saved project text is shown with neutral portfolio wording instead of school-project terms.
- Added an interactive polish pass using plain HTML/CSS/JavaScript:
  - Home page creative focus switcher and responsive hero grid lighting.
  - About page skill category tabs, including soft skills.
  - Projects page category filters, search input, live result count, and empty state.
  - Contact page link preview state on hover/focus.
- Rebuilt the Cloudflare Pages upload zip after the interaction pass.

## Important Files

- `index.html` - homepage content.
- `about.html` - student profile/about content.
- `projects.html` - project page structure and project drawers.
- `projects-firebase.js` - Firebase project loading, saving, editing, deleting, featured logic.
- `blog.html` - blog page structure and blog drawers.
- `blog-firebase.js` - Firebase blog posts, comments, login/admin behavior.
- `contact.html` - contact page and logo-style social links.
- `script.js` - shared navigation, page transition, drawer behavior.
- `styles.css` - full visual system, responsive layout, cards, drawers, orbit animation.
- `firebase-config.js` - Firebase browser config and admin rules.
- `firebase.json` / `.firebaserc` - Firebase hosting config, currently not the deployment path.

## Validation Already Done

- JavaScript syntax check passed for main scripts.
- Local HTML asset/link references passed.
- Blog drawer, login drawer, read-more drawer, and comment prompt checked in browser.
- Project page featured orbit and account drawer checked in browser.
- Contact page desktop and mobile checked in browser.
- Mobile layout checked at narrow width with no horizontal overflow.
- No relevant browser console warnings in tested pages.
- After the D-drive project update, static checks passed: JS syntax, local references, no Echo references, and local HTTP page serving. Playwright package is not installed in this static project, so no fresh automated rendered screenshot test was run for this specific update.
- After the latest About/Projects update, checks passed again: JS syntax, local HTML references, local HTTP 200 responses for About and Projects, no `Me_np` reference in active source, and no `Me_np.jpg`, `.env`, `.git`, `node_modules`, or Firebase debug log entries in the Cloudflare zip.
- After project wording cleanup, checks passed: no ASG/CA/assignment/course/school-project terms in `projects.html` or `projects-firebase.js`, JS syntax passed, Projects page served HTTP 200, and Cloudflare zip was rebuilt.
- After the interaction pass, checks passed: JS syntax for `script.js`, `projects-firebase.js`, and `blog-firebase.js`; local HTML references; HTTP 200 for Home, About, Projects, Blog, and Contact; Cloudflare zip rebuilt. Browser plugin is absent and Playwright import was unavailable/blocked, so no fresh automated rendered screenshot was captured.

## Blockers / Risks

- The full project files are now in D:\Portfolio; the old C:\Users\AL\Documents\Portfolio folder has no files left but may remain as an empty locked folder until the active process releases it.

- Firebase CLI login failed earlier, so Firebase Hosting deployment was abandoned.
- Current intended deployment path is Cloudflare Pages, not Firebase Hosting.
- Firebase image upload is not implemented; blog/project images currently use image URLs.
- Firebase Auth must authorize the live domains after deployment:
  - `liuguangxuan.com`
  - `www.liuguangxuan.com`
- Firestore rules must stay compatible with signed-in editing for projects/posts/comments.
- Do not expose or commit `.env` secrets.
- Do not upload local-only folders such as `node_modules`, logs, or `.git` to Cloudflare.

## Next Steps

1. Upload `D:\Portfolio\deploy\liuguangxuan-cloudflare-pages.zip` to Cloudflare Pages.
2. Connect the Cloudflare Pages project to `liuguangxuan.com`.
3. Add `liuguangxuan.com` and `www.liuguangxuan.com` to Firebase Authentication authorized domains.
4. Test the live website after DNS is active:
   - Home page loads.
   - Navigation works.
   - Blog loads posts.
   - Login opens.
   - Signed-in admin can add/edit blog posts.
   - Signed-in admin can add/edit projects.
   - Visitors can read posts/projects.
   - Signed-in users can comment.
5. Later improvement: add Firebase Storage uploads for blog/project images instead of requiring image URLs.

## Pitfalls Not To Repeat

- Do not try Firebase deployment again unless the user explicitly asks; they chose Cloudflare Pages.
- Do not invent contact details, emails, social links, projects, or credentials.
- Do not remove Firebase blog/project functionality while styling pages.
- Do not make the site overly flashy; keep it professional and minimalist.
- Do not show admin-only controls to signed-out visitors.
- Do not add unnecessary libraries for small UI improvements.
- Do not overwrite user changes without checking current file contents first.
- Do not package .env, node_modules, .git, debug logs, or Firebase CLI state for Cloudflare upload.
- Do not re-add Echo/ECHO GX unless the user explicitly asks; it has been removed from the site and asset folder.
- Do not put Liu GuangXuan's real face back on the About page or into the Cloudflare deploy package unless the user explicitly asks.
- Do not describe Projects page cards as school projects, ASGs, CAs, assignments, coursework, or submissions; use professional portfolio wording focused on what Liu made and the tools used.
- Keep new interactions lightweight and explainable: no unnecessary libraries, no overly flashy animation, and do not break Firebase project/blog editing.

## Handoff Protocol

When the user says `handoff` in this project, update this `HANDOFF.md` file so a new conversation can continue without old chat context.

Each handoff update should include:

- Current task/project goal
- Completed work since the last handoff
- Files changed
- Validation/testing done
- Blockers or risks
- Next steps
- Pitfalls not to repeat

After updating this file, reply briefly with the path:

```text
D:\Portfolio\HANDOFF.md
```


## Workflow installation checkpoint — 2026-10-09 11:30 SGT

- User request: set up the handoff starter for all projects. Scope: workflow documentation only.
- Installed/merged `AGENTS.md`; initialized missing `HANDOFF.md`, `PROJECT_MAP.md`, `DECISIONS.md`, and `FAILURE_LOG.md` at this project root. Existing history is preserved.
- Inspected root paths, existing instruction/memory files, available README/package commands, and Git metadata. This is a setup inventory, not a full code, media, dependency or deployment audit.
- Observed branch: `main`; HEAD: `54355ea730198556dea1f04f47151022eaa4303a`. Before setup: 29 pre-existing changed/untracked status entries. Setup adds uncommitted documentation; no commit or push is part of installation.
- Files moved/renamed/deleted: none. Application code, assets, credentials, settings and schedules are outside this setup.
- Verification: filesystem/Git inventory completed; PASS: all 40 installed file hashes match prepared content, all eight original documents remain intact as prefixes, four templates match their originals, and Git HEAD/index/diffs outside workflow files are unchanged. Command: `python3 work/setup_handoff.py verify` from the setup workspace. Application tests, builds, browser/editor checks and live integrations: NOT RUN (documentation-only setup).
- Exact next action: read `PROJECT_MAP.md`, this handoff and the current user request; recheck the actual working tree before starting that requested task. Historical next steps are context, not a new authorization.
