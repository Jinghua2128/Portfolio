# Handoff

Last updated: 2026-09-22

## Current checkpoint — GitHub transfer and Mac continuation

- User request: prepare a complete handoff for another Codex on the user's Mac and push the current project to GitHub before any further implementation. Stop feature work; documentation, transfer preparation and verification are in scope.
- Repository: `https://github.com/Jinghua2128/Portfolio.git`, branch `main`. On 22 September the remote and local base were both `5a2b4dd735f9a9e6a56f51239a64fcfe1a2dc835` (the original commit). The substantial existing source changes and user asset moves had not yet been committed. Preserve them.
- Transfer documents completed: `MAC-HANDOFF.md` covers architecture, Mac startup, configuration, approvals, evidence, limitations, next actions and a copyable Codex prompt; root `README.md` provides the entry point. Added `firebase-config.example.js`, updated `.gitignore` with deploy/media exclusions and `deploy/README.md` with clone limitations. Actual configs and excluded local files are untouched; runtime source is unchanged in this transfer task.
- Fresh verification on 22 September: all 16 root/editorial runtime JavaScript syntax checks and the new template passed; independent source review confirmed 19 retained / six public built-ins and 218 local references across 11 HTML pages with exact casing. Latest local deployment ZIP hashes to `62f3d063abc1a807e93e1a4c9a63bc7be4e11c7ad6353d5b4dc5bbde706dde0d`; all 41 archive entries match current source bytes, including eight approved media files. Targeted credential-pattern scan of 46 proposed text files found no matching private-key/token/service-account patterns (not a full security audit). No fresh rendered browser, Mac or live Firebase tests performed.
- Existing limitation discovered/documented: `editorial-portfolio/home-projects.js` still orders its remote query by `sortOrder`, which can omit remote homepage records without that field. The broader historical claim about removing query ordering applies to Projects/Blog listings, not this homepage. No runtime fix attempted during handoff.
- Pre-commit Git audit: staged tree contains 54 files and exactly eight approved media files; no `.env`, actual Firebase configs, portrait folders, APKs, logs or deployment outputs. Existing logo/blog asset moves are detected as renames. Independent review of the Mac guide/template/ignore policy found no blocking issues. A pre-existing broken `node_modules` line in the historical notes was corrected when the staged whitespace check exposed it.
- GitHub remote read succeeded outside the Windows sandbox after the sandboxed TLS credential lookup failed. No push yet at this checkpoint; verify the actual remote commit after pushing before claiming success.
- Scope of Git transfer: current runtime source, the eight approved existing media files, continuity/setup documentation and packaging recipe. Exclude `.env`, live Firebase configs, `node_modules`, logs, QA/browser profiles, deploy ZIPs/archives, private portraits, extra blog photos and the APK. Keep excluded local files intact. The original Git history already contains an old portrait; removing it from the current tree does not erase prior history.
- Mac configuration: this is a plain static site, with no build step and no npm start script. Its HTML uses Firebase 8.10.1 from CDN, independent of the unused npm Firebase dependency. Restore both ignored `firebase-config.js` files before checking the full site. Git does not carry Firestore/Storage data, accounts, rules, billing or browser drafts.
- No new deployment, billing/rules change, image upload, production write or additional asset approval is authorized by this transfer. The existing approved screenshots and three Sketchfab embeds remain approved; do not ask again for those exact uses.
- Next action: finish and verify the transfer documents and Git allowlist, commit to existing `main`, push to `origin/main` without rewriting history, then independently compare local and remote commit IDs. Record the result here and hand the user the Mac startup prompt.

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
