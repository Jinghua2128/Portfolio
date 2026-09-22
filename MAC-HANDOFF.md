# Portfolio handoff for Codex on macOS

Prepared 22 September 2026 from `D:\Portfolio`. Repository: [Jinghua2128/Portfolio](https://github.com/Jinghua2128/Portfolio), branch `main`.

The current source and this guide were pushed in commit `093dd0616a374611dee0649834afe34b0d0f39f0` and independently verified against GitHub's `main`. A subsequent documentation checkpoint records that result; fetch the latest `main`, including that checkpoint. No GitHub Release or hosting deployment was performed.

## Immediate objective

The user requested a complete transfer to another Codex on their Mac and a GitHub push before any further implementation. This stage packages the existing source and project knowledge for continuation. No new feature, redesign, hosting deployment or production Firebase operation is part of the transfer.

Read this guide, `AGENTS.md`, then **all of `HANDOFF.md`** before starting. The top checkpoint is current; lower checkpoints are historical, including old stop/resume instructions, process IDs, package names and approval requests. The latest user instruction always takes precedence. Keep `HANDOFF.md` current after each meaningful verified stage and before switching tasks or approaching a usage/context limit.

## Fetch and start on your Mac

For a new checkout:

```sh
git clone https://github.com/Jinghua2128/Portfolio.git
cd Portfolio
git status --short --branch
git log -3 --oneline
```

For an existing checkout, inspect its working tree first, fetch `origin`, and only fast-forward a clean local `main`. Do not reset or overwrite local changes; reconcile any divergence deliberately. Do not assume an old Mac checkout already contains the transferred work.

Requirements: Git to fetch, a modern browser, and a local static HTTP server. Python 3 is one option if already installed. Node.js is needed for the syntax-check commands below, but there is no application build step. Do not assume Git, Python, Node or PowerShell is installed on a fresh Mac; inspect versions first. `package.json` only declares Firebase `^12.15.0`; it has no scripts. Running `npm install` does not configure or start this site, and the deployed pages actually use Firebase **8.10.1 CDN scripts**.

### Restore the ignored Firebase browser configuration

Both `firebase-config.js` and `editorial-portfolio/firebase-config.js` are intentionally ignored and are **not** fetched from GitHub. They were identical on Windows at transfer time. Their absence is a setup requirement, not a working offline configuration: the feature scripts expect the globals they define.

Preferred: privately transfer those two existing files from the Windows project and place them at the same relative paths. Do not transfer `.env`, credentials, service-account files or browser profiles into Git.

Alternative, only when the destination files do not already exist:

```sh
cp -n firebase-config.example.js firebase-config.js
```

Fill the existing Firebase project's web-app settings (`apiKey`, `authDomain`, `databaseURL`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`) and the already-authorized admin email/UID arrays. Keep `ALLOW_ANY_SIGNED_IN_USER_TO_EDIT = false`. Then, only if the editorial config is absent:

```sh
cp -n firebase-config.js editorial-portfolio/firebase-config.js
```

The template is not a working Firebase project. Do not test live auth/upload using placeholder values, create a replacement project, or broaden permissions to bypass setup. Browser config is not a service-account credential; nevertheless this transfer preserves the existing ignore policy. The `.env` file is not consumed by the static pages. A Git clone carries no Firestore documents, Storage objects, accounts, server rules, billing settings or browser local drafts.

Start the server from the repository root in a dedicated terminal:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Visit `http://127.0.0.1:8765/`, `/projects.html`, `/blog.html`, `/immersion.html`, and `/editorial-portfolio/`. Use HTTP, not `file://`. Internet access is needed for external Firebase scripts/data, fonts and opt-in Sketchfab models. A local preview configured with the real Firebase project can contact production; do not sign in, save, upload or delete as part of an unapproved smoke test.

## Project description and architecture

This is Liu GuangXuan's personal portfolio for internship/job applications in immersive media, games, interactive development, UI/UX, motion graphics, 3D design and multimedia production. Present real student work professionally without inventing clients, credentials, metrics or completion claims. Avoid labeling public project cards ASGs, CAs, assignments or coursework; describe what was made and the tools used.

The root site uses the established dark grid composition, typography and palette. The orange/black editorial redesign is preserved as a separate site under `editorial-portfolio/`. Both use the same Firebase project and `projects`/`posts` collections, with comments under `posts/{postId}/comments`. Keep the sites' designs distinct while maintaining shared data compatibility.

| File or area | Responsibility |
| --- | --- |
| `index.html`, `about.html`, `projects.html`, `blog.html`, `contact.html` | Main multi-page site and its drawers/forms |
| `styles.css`, `script.js` | Main appearance, navigation, drawers/focus, filters/tabs, carousel, lightweight motion and reduced-motion response |
| `project-catalog.js` | Real built-in catalog, approved identity/link corrections, public visibility policy and nested media path resolution |
| `projects-firebase.js`, `blog-firebase.js` | Immediate local fallback, Firestore merging/listeners, authenticated editing, comments and existing record actions |
| `editor-tools.js`, `editor-tools.css` | Main-site labeled editors, validation, chips, preview, busy/error handling and UID-scoped recoverable drafts |
| `project-management.js` | Admin selection/editing of all records, including hidden entries; distinguishes local copies from loaded remote records |
| `content-order.js` | Saved/legacy dates, newest-first ordering and in-progress status classification |
| `project-highlights.js`, `project-highlights.css` | Featured / In Progress / Latest views, keyboard interaction and maximum three entries per view |
| `image-upload.js`, `image-upload.css` | Shared photo selection, validation/re-encoding, preview and explicit Storage upload lifecycle |
| `immersion.html`, `immersion.css`, `immersion.js` | Opt-in Sketchfab gallery, one active iframe, camera controls, error/retry and non-3D source links |
| `editorial-portfolio/` | Five alternate HTML pages, own styles/scripts, older forms and homepage project renderer; shares root helpers/media |
| `firebase-config.example.js` | Placeholder setup template; actual root and editorial configs stay ignored |
| `imgs/` | Eight approved logo/blog/project media files in Git; other Windows media intentionally excluded |
| `FIREBASE-STORAGE-SETUP.md`, `storage.rules.example` | Owner setup and reviewable example rules; not an applied cloud configuration |
| `WORK-RECOMMENDATIONS.md` | Approved attribution, source links, asset boundaries and historical public-work research |
| `deploy/package-cloudbase.ps1`, `deploy/README.md` | Explicit runtime packaging recipe and historical release metadata |
| `.firebaserc`, `firebase.json` | Legacy Firebase CLI metadata; Hosting currently points at `.` and must not be used to deploy the workspace |

### Data and editing behavior to preserve

- The built-in catalog retains **19** records; its public subset is **six**: StickAR, LabRats, EchoWorks, Past Portfolio, Burnt Cones Website Revamp, Carbon Creative Website. Thirteen records are hidden rather than deleted. Remote/custom records can change the actual displayed count.
- `PortfolioProjectPolicy` applies approved display policy. An explicit `portfolioVisible` boolean supports restoration/hiding; drafts stay excluded. This is display policy, not private cloud storage.
- Remote fields, IDs and custom media take precedence where intended; preserve unknown fields and merge writes. Built-in local records are not automatically proof of saved Firestore documents. Do not seed/migrate/delete records automatically.
- The three real local Blog entries remain. Ordering uses saved ISO/legacy dates, then publication/creation timestamps or timestamp-like legacy sort order; `updatedAt` must not make an old post new. Do not invent missing dates or statuses.
- Existing limitation: the editorial homepage's `home-projects.js` still queries with `.orderBy("sortOrder", "asc")`, so remote homepage records missing that field can be omitted. The Projects and Blog listing listeners no longer require it. This transfer documents the discrepancy without changing runtime behavior.
- Project views show up to three matches each. Featured uses explicit flags; In Progress uses status; Latest needs a real date/timestamp. Empty views are legitimate.
- Main editor drafts live in browser localStorage scoped to admin UID. They do not migrate through Git, and saving a local revision does not unpublish a live item. The editorial editor lacks equivalent draft recovery. Preserve account-switch/pending-save isolation and unsaved chip text.
- Account drawers display the optional name field only for Create account. Login hides/disables it; reset and restored-page state were handled previously.
- Existing explicit admin delete actions remain in the source. The curation/upload implementation did not delete records or automatically remove Storage files. Do not exercise delete actions during transfer verification.

### Image uploads

Both site variants support project image, Blog cover and append-one-at-a-time Blog body photos. Selecting a file only creates a local preview. Upload is explicit and lazily loads the Storage SDK; Save/Publish separately persists the resulting URL. Preserve custom/old URLs after errors, cancellation or retry.

Input: JPG/PNG/WebP, maximum 12 MiB and 40 megapixels. Output: re-encoded without cropping, maximum 2048 px on the longest edge and 4 MiB. HEIC requires JPEG export. No image blobs/base64 in Firestore or local drafts; no automatic Storage deletion. Uploaded images become publicly addressable before the post/project is saved. Pending work is cancelled/invalidated on account/editor changes.

Storage provisioning, billing, deployed rules and real phone upload/save/reload remain unverified. Follow `FIREBASE-STORAGE-SETUP.md`, inspect the owner's existing setup and verify current provider requirements before any authorized configuration work. Never replace broad existing rules blindly or enable billing as an incidental setup step.

## Decisions and approvals already settled

- Preserve the main design; no redesign or framework migration was requested. Keep enhancements restrained, keyboard-accessible and responsive to reduced motion.
- The existing homepage JPGs for Burnt Cones, CarbonCreative and EchoWorks are approved for their corresponding project cards and Details panels. Do not request the same approval again. Preserve their bytes and custom Firebase image precedence. No Past Portfolio screenshot was supplied.
- The existing logo/icon and three existing Blog images are approved; the Git/media and deployment allowlists name the exact eight files. Extra OIP photos, portraits and the StickAR APK are local-only and unapproved for this transfer.
- Do not add/replace/generate any further image, thumbnail, texture, video, model or external embed without confirming the specific asset, purpose, format/aspect ratio or size budget, and placement.
- Approved Sketchfab embeds: `Chess pices - Knight` (`6fbc704037754126ae66f0604db4d62b`), `hologram` (`30e4d2f5ffda42718012338c096c9cc5`), `Crystals` (`9daa1337b6704d8cb0d3a6ce90513fea`). All use Maya/Substance Painter; Crystals also uses ZBrush. Preserve source spelling and do not invent descriptions.
- The gallery uses **Sketchfab Viewer API**, not Three.js. Native Three.js is a possible later stage requiring authorized GLB/GLTF assets. Do not download/extract models from Sketchfab.
- Burnt Cones: Liu did all website work; teammates made logo, promotional materials and documentation. Do not invent commission/client/date claims.
- EchoWorks: Liu made the website versions and full-site revamp; UI by Gracie and first scenario scene by KaiMing. Update the existing entry, no duplicate.
- Past Portfolio retains ID `personal-portfolio-website` and uses the approved NP-FED links. Carbon Creative Website has separate ID `carbon-creative-website`; the old branding record remains hidden. Carbon's individual role is unconfirmed.
- CourseCarry remains excluded under the finished-work brief. LabStats is only a possible supporting LabRats link. Do not add new projects based solely on public repositories.
- ArtStation is a supplied link; historical attempts hit a 403 challenge, so artwork/account contents were not independently verified. Preserve actual contact/profile links; do not invent replacements.
- Do not restore the removed Echo/ECHO GX About character or real-face portrait. Preserve existing user file moves. Update README when behavior changes. Preserve at least 20% Codex usage if usage information is available; never redeem reset credits without explicit authorization.

## What was verified, and what was not

Fresh Windows checks for this transfer are recorded in the current `HANDOFF.md` checkpoint. All **16 existing runtime JS files** and the new config template passed syntax checks. Independent source review confirmed **19 retained / six public** built-in projects and **218 local references across 11 HTML pages**, with exact case matching. The recorded ZIP checksum matched and all 41 archived files matched the current source bytes, including exactly eight approved media files. A targeted credential-pattern scan of the proposed text files found no matching private-key/token/service-account patterns; this is not an exhaustive security audit. The staged whitespace check passed. No new runtime feature changes were made in this handoff task. The source push succeeded and its remote commit ID matched local HEAD, as recorded above.

Historical Windows evidence, chiefly 14 September, is described in full in `HANDOFF.md`: root/editorial Projects and Blog at 1440x1000 and 390x844; local fallback/identity, catalog retention/visibility, editor merge/custom fields, account isolation, upload error/progress/cancel/retry, URL retention, Blog ordering, project views, keyboard controls, no horizontal overflow and no runtime exceptions. Auth/Firestore/Storage write-path tests used **local doubles**, not production accounts. Earlier tests rendered all three live Sketchfab models and exercised camera controls.

Historical QA scripts/screenshots remain outside Git under `D:/CodexData/home/visualizations/2026/08/20/01a01e33-ae42-7850-ab2a-105f2abbafd0/`, including `uploads-ordering-qa.mjs`, `catalog-qa.mjs`, `approved-images-qa.mjs` and `portfolio-qa.mjs`. They relied on Windows Edge/CDP processes and are not a portable committed test suite. Old exec session IDs, temp profiles, drive paths and preview servers do not transfer to macOS and must not be assumed running.

Still unverified: macOS Safari/Chrome behavior, native iOS/Android pickers and image processing, real mobile GPU performance, screen readers inside third-party iframes, live Firebase authentication/saves/rules, Storage/billing, and the deployed website. Local syntax, hashes and screenshots do not prove these work. Historical tests have not been rerun merely by cloning.

After configuration, basic Mac syntax checks can be run with:

```sh
(for file in ./*.js ./editorial-portfolio/*.js; do
  node --check "$file" || exit 1
done)
git diff --check
```

A useful browser smoke pass covers all six root pages and all five editorial pages, desktop/mobile widths, image loads, visitor admin controls remaining hidden, drawers/Escape/focus, project search and views, Blog order, reduced motion and the opt-in gallery. Use isolated local doubles for any editor/upload regression work unless the user specifically authorizes a live write. There is no `npm test` suite in the repository.

## Deployment and cross-platform cautions

The latest Windows runtime package remains `deploy/14-September-2026-phone-image-uploads-newest-blog-project-views.zip`: 41 files, 6,814,521 bytes, `index.html` at the archive root, SHA256 `62f3d063abc1a807e93e1a4c9a63bc7be4e11c7ad6353d5b4dc5bbde706dde0d`. It contains both configured sites and all eight approved media files. ZIPs/checksums, extracted packages, original-design snapshots and archives remain on Windows, excluded from Git; they are not GitHub Releases.

The runtime source is transferred, so a new package can be built after restoring both configs. The existing PowerShell script derives paths from its location; `pwsh` on Mac is an optional route if installed, but has not been tested there. If replacing it later with a portable packager, preserve the exact explicit runtime/media allowlist, local-reference validation, secret/local-file exclusions, no-overwrite behavior and descriptive `DD-Month-YYYY-exact-update.zip` naming. Do not create a new ZIP solely for these documentation changes.

Cloudflare Pages is the chosen target. Do not run `firebase deploy`, deploy the repository root, or infer deployment authorization from the GitHub source push. `firebase.json` has legacy `public: "."` configuration and is not safe for the intended workspace upload. Host only an audited runtime package. Existing deployment/CI linkage has not been verified by this transfer.

Preserve case exactly on Mac/Linux/hosting, especially `imgs/Blogs/EchoWorks/photo.JPG` and all `imgs/Projects/...` paths. Editorial pages resolve shared media through `../imgs/`; stored canonical image paths must still work in both sites. Never substitute Windows absolute paths into runtime code.

The transferred current tree omits the old portrait, but the original commit already contained it. This ordinary push does not remove earlier Git history; history rewriting is outside this request. Keep local excluded material intact.

## First continuation task and unresolved work

1. Verify the fetched branch/commit, read continuity documents completely, and inspect local changes/tool availability.
2. Restore the two ignored Firebase configs without exposing secrets or changing the live project. If unavailable, report this exact prerequisite and perform independent source review meanwhile.
3. Start a new Mac preview and run read-only desktop/mobile checks; record what actually runs. Rebuild/adapt local mock-based QA only when relevant to the next authorized change.
4. Confirm the user's next feature or verification objective if none is supplied. The last implementation/package stage is locally complete; old historical to-do lists are not blanket authorization to resume unrelated work.
5. If the user chooses live phone uploads, first review the existing bucket/rules/billing with them, then perform one explicitly authorized upload/save/reload and document actual results. Do not call it fixed from local doubles alone.
6. If a later change affects runtime behavior, update README/HANDOFF and make a newly named allowlisted package when requested. Keep source pushes, releases and site deployments distinct.

## Copy this prompt into the new Codex task

> Continue my existing Portfolio project from https://github.com/Jinghua2128/Portfolio on branch main. Clone it if necessary, or safely fetch/update my existing checkout without overwriting local changes. Read MAC-HANDOFF.md, AGENTS.md and the entire HANDOFF.md before doing work; the newest checkpoint supersedes historical sections. First inspect the current tree and Mac tooling, restore/check the two ignored Firebase browser configs using the documented instructions, and start a local preview with read-only desktop/mobile checks. Preserve the established main dark grid design, the separate editorial site, real content, approved assets, Firebase data shapes and user edits. Do not add assets/projects, deploy hosting/rules, enable billing, seed/delete records or perform live uploads/saves unless I authorize that next task. Clearly distinguish historical Windows/local-double evidence from fresh Mac or live verification. Update README for behavioral changes and HANDOFF.md after verified stages. Once the transfer is verified, summarize the current state and ask what I want to work on next if I have not supplied an objective.
