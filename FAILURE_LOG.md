# FAILURE_LOG — Portfolio

Setup date: 2026-10-09. No project bug was investigated or fixed as part of workflow installation. Existing issues remain in [HANDOFF.md](HANDOFF.md) and linked project records.


Only record meaningful failures and repeatable lessons. Do not treat a guess as a confirmed root cause. Keep entries short and point to actual evidence. Group repeated manifestations of the same bug instead of adding duplicates.

## BUG-ANCHOR-20261007 — Async cards displace the initial case study

- **Date / status:** 2026-10-07 — locally verified then; not rerun during the 9 October documentation handoff.
- **Expected / actual:** a Home case-study link should leave its heading visible below the fixed navigation; asynchronously rendered Firebase cards shifted that destination after initial navigation.
- **Reproduction / cause:** load `projects.html#case-study-questionnaire` or `#case-study-politeload` before remote cards settle. Insertion above the target changes document layout after the initial browser anchor scroll.
- **Fix:** `projects-firebase.js` aligns a valid initial case-study target after card rendering/load/font readiness and releases alignment on the first wheel, touch, pointer, key or hash change.
- **Evidence / verification:** the 7 October HANDOFF checkpoint records desktop/mobile headings around 93–100px from the top, clear of the 68px navigation, and a source-isolated Node mock passing five release events plus the no-hash case. No live writes were involved.
- **Lesson:** test deep links after asynchronous content settles, and respect subsequent user navigation/scroll intent.

## BUG-ADMIN-INERT-20261004 — Drawer nested inside inert content

- **Date / status:** 2026-10-04 — structurally verified with a mock; real authenticated editor interaction still needs verification.
- **Expected / actual:** an owner editor drawer must remain interactive while background content becomes inert. The cloned admin template initially left drawers inside `<main>`, which the shared drawer manager makes inert.
- **Cause / fix:** `admin/editor-bootstrap.js` now moves cloned drawers to body-level siblings before shared scripts load.
- **Evidence / verification:** the 4 October HANDOFF checkpoint records isolated Node checks for signed-out/non-owner redirects, the owner gate, body-level drawers and ordered script loading. These were mocks, not real Firebase Auth/save tests.
- **Lesson:** verify DOM ownership when reusing shared overlay managers; syntax and signed-out redirects cannot prove an authenticated drawer works.

## BUG-CACHE-20261004 — Browser served an earlier Projects script

- **Date / status:** 2026-10-04 — fresh rendered result verified then; not rerun on 9 October.
- **Expected / actual:** a preview should show current featured projects; rendered QA reused a stale Projects script after local edits.
- **Fix / evidence:** versioned public/admin script and CSS references forced fresh assets. Settled browser DOM/screenshots then showed the intended Questionnaire, EchoWorks and PoliteLoad highlights. Subsequent 7 October edits advanced relevant versions again; see the dated HANDOFF checkpoints.
- **Lesson:** verify the loaded asset version and settled rendered state before diagnosing a source regression; invalidate changed static assets consistently. Do not use an old screenshot or immediate navigation frame as proof of the current page.

## QA-BROWSER-20261018 — Responsive harness limitations

- **Date / status:** 2026-10-18 — responsive layout verified in fixed-width frames; native-device verification still needed.
- **Expected / actual:** the browser viewport capability should apply 375px; it returned without applying and the page still reported 1280px. Resetting it invalidated temporary tab handles. Root cause is unconfirmed; this is not evidence of an application layout failure.
- **Workaround / evidence:** an agent-created, same-origin QA fixture rendered actual 375px and 768px iframe viewports. DOM checks reported content/scroll widths of 369/369 and 762/762 (scrollbars excluded), and screenshots plus search/article/menu/login interactions were inspected. Tablet cards were cramped with the sidebar, so `blog-page.css` now collapses it at 860px; the revised layout passed the same inspection.
- **Remaining limitation:** the framed test tabs intermittently logged `MutationObserver.observe` receiving a non-Node, without a source location. Standalone blog/admin/editorial logs were clean. A temporary page error listener did not reproduce or attribute it; do not claim its cause is fixed. Native mobile/Safari QA remains required before release. The fixture and diagnostic listener were removed after testing.
- **Lesson:** verify the measured viewport, not just a successful tool call. Wait for the existing page-wipe transition before screenshots; scroll below-fold images into view before full-page capture. Do not mistake a pre-paint lazy image for a missing asset.

## ENV-PREVIEW-20261022 — Preview port collision and sandboxed headless browser

- **Date / status:** 2026-10-22 — Confirmed; worked around locally. Not a site defect.
- **Expected / actual:** the documented preview command uses port 8765 for this repository. On 22 October that port was held by an unrelated uvicorn app ("Media Curator · Empire AI", PID 77444, cwd under the owner's `Documents/Empire AI/...` folder) and returned another site's HTML; a repo path such as `/blog.html` returned HTTP 404 there.
- **Reproduction / evidence:** `lsof -nP -iTCP:8765 -sTCP:LISTEN` and `lsof -a -p <pid> -d cwd` identified the foreign process; `curl http://127.0.0.1:8765/blog.html` → 404, while the same path on 8766 returned the real Blog and its 4 posts. A separate port (`8766`) was used and recorded.
- **Related environment finding:** headless Chrome 155 under this session's file sandbox failed with "sandbox initialization failed: Operation not permitted" plus GPU/network-service crashes. It ran correctly with `--no-sandbox --disable-gpu --disable-dev-shm-usage --disable-crash-reporter --disable-breakpad`, then accepted CDP commands.
- **Fix / scope:** the foreign process was identified and **left running**; nothing was killed. This repository was served read-only on 127.0.0.1:8766 and verified there. No repository files were changed for this.
- **Verification:** 43-check route/accessibility harness plus a targeted article/login-drawer harness passed against 8766 on 22 October (see HANDOFF.md active checkpoint).
- **Lesson:** confirm what owns a port (process, cwd, served content) before using or stopping it; do not kill an unrelated server to reclaim a documented port — serve on a free port and record the actual URL. Use `--no-sandbox` only for same-origin local QA automation, never to load untrusted content.

## Entry template
### BUG-001 — [descriptive short name]
- **Date / status:** [date] — Unconfirmed / Investigating / Fixed but unverified / Verified fixed
- **Environment:** [e.g., Unity version/platform, Bedrock Education edition, browser]
- **Expected:** [intended result]
- **Actual:** [observed result]
- **Reproduction:** [steps and affected paths]
- **Evidence:** [error, log excerpt, failing test, screenshot path]
- **Root cause:** [confirmed explanation, or label as hypothesis]
- **Fix and changed files:** [precise code/asset changes]
- **Verification:** [test and result; any manual checks not run]
- **Prevention:** [what future sessions should do differently]
- **Related:** [commit, ticket, handoff section]

## Recurring mistake patterns
- **Assumed an edit worked without in-app testing:** Use `Needs manual verification`; do not write `Fixed` without an observed passing check.
- **Changed too many things at once:** Prefer incremental edits and diff review so regressions are traceable.
- **Ignored preservation requirements:** Copy non-negotiable requirements into the acceptance checklist, and inspect the diff before finishing.
- **Repeated the same unsuccessful fix:** After two failed attempts, switch from guessing to evidence gathering.
- **File moves broke dependencies:** Before approved moves, locate all references, preserve required metadata/IDs, update imports/links, and run a build or in-app verification.
- **Scattered or duplicate deliverables:** Maintain canonical paths in `PROJECT_MAP.md`, use clear names and investigate duplicates rather than deleting blindly.

> These patterns are preventive checks, not assertions that they occurred in this particular repository. Replace them with evidence-backed findings as the project progresses.
