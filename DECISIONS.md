# DECISIONS — Portfolio

## DEC-SETUP-20261009 — Durable project handoff

- Date / status: 2026-10-09 — Active.
- Decision: adopt the supplied Codex handoff workflow across projects, with global working rules and independent state at each project root.
- Reason: the user requested “set it up for all projects.”
- Consequences: maintain HANDOFF.md at meaningful checkpoints; keep verified paths, durable decisions and evidenced failures in their respective records. Preserve existing instructions, historical context and all project files.
- Scope: workflow installation does not resume past implementation tasks, authorize publishing, or certify application behavior.
- Related: [HANDOFF.md](HANDOFF.md), [PROJECT_MAP.md](PROJECT_MAP.md).

## DEC-PORTFOLIO-PRESERVATION — Existing site and approved content

- Date / status: reaffirmed from September–October handoffs on 2026-10-09 — Active, not a new asset approval.
- Decision: improve the existing dark-grid site in place, preserve the separate editorial variant, real content, media bytes, Firebase data and user changes. No framework migration, broad file reorganisation or replacement design is implied.
- Consequences: new files follow established locations; moves/renames/deletions require approval. Do not invent projects, metrics, clients, resume/email links or missing screenshots. The exact approved-media subset is in PROJECT_MAP.md; detailed attribution and embed approvals remain in MAC-HANDOFF.md and WORK-RECOMMENDATIONS.md.

## DEC-BLOG-DIRECTION-20261018 — Linear + Fuwari, existing references only

- Date / status: 2026-10-18 — Implemented locally; ready for user visual review, not deployed.
- Decision: combine Linear Now's restrained dark styling and clear hierarchy with Fuwari's rounded cards, categories and personal-journal feel. The user explicitly chose existing references only, not a generated concept or new artwork.
- Consequences: preserve the existing portfolio identity, approved media, Firebase backend/document IDs, owner-only editing and separate editorial variant. Root-only `blog-page.js` / `blog-page.css` adapt the presentation without a framework/theme installation. Full-page reading uses `blog.html?post=<existing-id>`; optional `topic` / `q` parameters preserve filters. No document rename or hosting rewrite is needed. Per-post server-rendered social metadata and HTTP 404 responses remain a separate future concern, not guaranteed by client routing.
- References: [Linear Now](https://linear.app/now), [Fuwari](https://fuwari.vercel.app/), [Fuwari repository](https://github.com/saicaca/fuwari). Their artwork, branding and text are not approved portfolio assets.

## DEC-OWNER-EDITING — Owner writes; visitors read and comment

- Date / status: user direction implemented in the recorded 2026-10-02 rules publication — Active; live authentication remains unverified.
- Decision: only the owner may create/edit/delete projects or posts and moderate existing comments. Visitors may view; signed-in visitors may create comments. Client UID gates support the interface but Firestore rules must enforce access.
- Consequences: preserve the public/admin route split. Do not broaden editor access, expose owner identifiers in memory, or treat UI visibility as security. Public-read privacy and comment abuse protections require a separately scoped migration; this decision is not proof that those issues are resolved.
- Evidence: HANDOFF.md, historical owner-only rules publication and 4 October admin checkpoint. No live rules were changed or re-certified during the 9 October handoff.

## DEC-BLOG-WORKFLOW-20261022 — Owner-supplied content; no uploads or video

- Date / status: 2026-10-22 — Active.
- Decision: the owner will send blog content to the agent, who drafts and structures it using the documented post fields and house style; the owner reviews and publishes through `/admin/blog.html`. The owner declined Firebase Storage photo uploads and video support for now (“no need”). Media remains an existing approved path under `imgs/…`, or no image at all.
- Reason: the owner asked for a repeatable posting structure and said they will supply content for the agent to manage, rather than uploading files.
- Consequences: [BLOG-POSTING-GUIDE.md](BLOG-POSTING-GUIDE.md) defines the intake template, stored fields, writing shape, house style, publish checklist and division of work. No Storage/Blaze activation, video pipeline or new asset approval is implied. Owner-only write rules remain the permission boundary; the agent must not publish without explicit approval in that turn. Edits reuse existing document IDs and URLs.
- Related: [HANDOFF.md](HANDOFF.md), [DEC-OWNER-EDITING](#dec-owner-editing--owner-writes-visitors-read-and-comment).

## DEC-CI-DEPLOY-20261022 — GitHub push deploys to Cloudflare Pages (option B)

- Date / status: 2026-10-22 — Active; pipeline prepared, first deploy not yet run.
- Decision: the owner chose GitHub Actions → Wrangler (Direct Upload) over creating a new Git-integrated Pages project. The existing project `liuguangxuan-portfolio` and custom domain are retained; a push to `main` builds `dist/` from the 50-file allowlist and deploys it. Firebase browser config is generated from repository secrets at build time and is never committed.
- Reason: avoids a new Pages project and custom-domain cutover, keeps the current Direct Upload project, and makes deployment reproducible from the audited allowlist.
- Consequences: `.github/workflows/pages-deployment.yml` and `deploy/build-package.mjs` become the release path; the PowerShell recipe remains legacy. `dist/` is ignored; `.gitignore` explicitly tracks the build script and the nine approved media files. **Every push to `main` is a production deployment** — do not push without intent. Repository secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` and the `FIREBASE_*` values must be configured; tokens and config values never enter Git, docs or chat.
- Related: [deploy/README.md](deploy/README.md), [README.md](README.md), [HANDOFF.md](HANDOFF.md).

## DEC-DEPLOYMENT-BOUNDARY — Audited runtime package, separate release approval

- Date / status: September transfer decision, reaffirmed by October source changes — Active.
- Decision: Cloudflare Pages is the intended hosting target; keep source pushes, runtime packaging and production deployment separate. Do not deploy the repository root or reuse the stale September ZIP as current source.
- Consequences: preserve the explicit allowlist and exclusions in `deploy/package-cloudbase.ps1` despite its legacy name. Current `firebase.json` declares only Firestore rules. Rule publication, Storage provisioning/billing and hosting deployment are separate actions, not incidental preview/setup steps.
- Evidence: MAC-HANDOFF.md for historical target/approvals; deploy/README.md and HANDOFF.md for current source/package limitations.

## Existing project decisions

Preserve and consult existing project history rather than copying or overriding it:

- [MAC-HANDOFF.md](MAC-HANDOFF.md) — existing context; consult before related work.
- [WORK-RECOMMENDATIONS.md](WORK-RECOMMENDATIONS.md) — existing context; consult before related work.
- [deploy/README.md](deploy/README.md) — existing context; consult before related work.
- [HANDOFF.md](HANDOFF.md) — prior history, where present, remains intact.

Record future substantive decisions with date, status, reason, consequences and affected paths. Mark superseded decisions explicitly; do not erase history.
