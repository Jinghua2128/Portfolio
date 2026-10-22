# Deployment packages

## Cloudflare Workers deployment via GitHub Actions — 22 October 2026

The owner chose **GitHub → Cloudflare (option B)** and confirmed the live project name `liuguangxuan-portfolio`. Dashboard inspection on 22 October corrected one assumption: it is a **Cloudflare Worker with static assets**, not a Pages project (the Workers & Pages URL is `/workers/services/view/liuguangxuan-portfolio/...`). The Worker keeps the custom domain `www.portfolio.liuguangxuan.com`.

- `deploy/build-package.mjs` reads the explicit **50-file** allowlist from `deploy/package-cloudbase.ps1`, writes `dist/`, generates both `firebase-config.js` files from build secrets (or copies the ignored local config for local builds), and validates every local HTML reference and cross-page anchor before deploy.
- `wrangler.jsonc` deploys the Worker `liuguangxuan-portfolio` with `assets.directory = ./dist`, `html_handling = auto-trailing-slash` and `not_found_handling = none` (matching the live behaviour).
- `.github/workflows/deploy-worker.yml` runs `node deploy/build-package.mjs` then `wrangler deploy` on push to `main` (or manual dispatch).
- Required repository secrets: `CLOUDFLARE_API_TOKEN` (Account → **Workers Scripts → Edit**; Pages permission alone is not enough), `CLOUDFLARE_ACCOUNT_ID` (`fb9e2989477bd90c3b9d99973d240a74`), and the `FIREBASE_*` values (`API_KEY`, `AUTH_DOMAIN`, `DATABASE_URL`, `PROJECT_ID`, `STORAGE_BUCKET`, `MESSAGING_SENDER_ID`, `APP_ID`, `ADMIN_EMAILS`, `ADMIN_UIDS`). Never commit them.
- Status: **deployed successfully on 22 October 2026** (workflow run `39725445377`). Live verification: new journal UI, 6 posts + `AI` filter, `/admin/` routes, internship image, editorial variant, signed-out admin gate, no 404s. Local `dist` build **PASS** (50 files, 258 references, six anchors, env-based config generation) and `wrangler deploy --dry-run` **PASS**. An earlier run failed because the pipeline assumed Pages and used a wrong account ID; account and Worker correction are recorded in `../FAILURE_LOG.md`. `dist/` is ignored; never commit `firebase-config.js` or `dist/`.

## Current Mac source work — 18 October 2026

The portfolio, admin routes and package allowlist are being updated locally. **Do not upload the September ZIP as the current site**: it predates the public/admin separation, case studies and current Blog. No replacement ZIP has been built or audited on this Mac, and nothing has been deployed. The **50-file** allowlist explicitly includes `firebase-fallback.js`, the five `admin/` runtime files, the root-only `blog-page.js` / `blog-page.css` presentation files and nine approved media files (the internship reception photo was added on 22 October). The 22 October independent source audit passed all 50 files, 258 local HTML references and six cross-page anchors; it is not a ZIP or deployment test. Build a new, descriptively dated package only after the owner editor has been credential-tested and a full reference/private-file audit passes. The PowerShell recipe still requires a supported PowerShell runtime and has not been executed on this Mac.

`firebase.json` no longer points Firebase Hosting at the repository root; the intended website deployment remains Cloudflare Pages. Publishing Firestore rules, enabling Storage/billing and deploying the site are separate operations.

## GitHub / Mac transfer — 22 September 2026

Only this README and `package-cloudbase.ps1` are tracked from `deploy/`. ZIPs, checksums, extracted sites and `archive/` remain local on Windows; a Git clone will not contain them. The package details below describe that existing Windows artifact. See `../MAC-HANDOFF.md` for restoring the two ignored Firebase configs before rebuilding. The PowerShell packager has not been verified on macOS. Source publication does not deploy the website or create a GitHub Release.

## Latest Windows runtime package

Historical artifact: **14-September-2026-phone-image-uploads-newest-blog-project-views.zip**. It was the latest verified Windows package for that stage, but is not current for the 4 October source work.

This full-site update adds phone/computer image selection, preview and Firebase Storage upload to Blog and Projects on both site variants. Blog posts now appear newest first. The existing project highlight area switches between Featured, In Progress and Latest, with up to three matching projects per view; the complete library remains below. Dates/statuses are not invented, so undated/unmarked views may be empty until you update their fields.

All earlier approved changes and images are included. The established design, six public projects, all 19 retained catalog records, original Firebase document fields and custom media URLs remain intact. No live uploads, saves, rules changes or deployment were performed. No additional artwork or Past Portfolio screenshot is included.

**Phone-upload setup required:** read `../FIREBASE-STORAGE-SETUP.md`. Firebase Storage must be enabled on the appropriate billing plan with admin-only rules. `../storage.rules.example` is a local example to review/merge, not a deployed configuration. The ZIP only updates the website; it does not configure billing, create a bucket or apply Storage rules. Existing image URLs still work without uploading.

Package: 41 allowlisted files, 6,814,521 bytes, with `index.html` at the ZIP root. All archived files hash-match source and all eight media files are unchanged from the previous release. SHA256: `62f3d063abc1a807e93e1a4c9a63bc7be4e11c7ad6353d5b4dc5bbde706dde0d`.

The matching `.zip.sha256` file verifies the ZIP. Do not upload this README, the packaging script, the checksum, or the archive folder.

## Naming convention

`DD-Month-YYYY-exact-update.zip`

Use the full English month, a four-digit year, and a specific lowercase hyphenated description. Avoid vague names such as `final`, `update`, or `v5`. The filename describes the latest change; each ZIP still includes the full site.

Create a package from the project root in PowerShell:

```powershell
.\deploy\package-cloudbase.ps1 -UpdateDescription 'exact-description-of-your-change'
```

The date defaults to today. For a known earlier update date:

```powershell
.\deploy\package-cloudbase.ps1 -UpdateDescription 'phone-image-uploads-newest-blog-project-views' -ReleaseDate '2026-09-14'
```

The current package already exists, so the second command will safely refuse to overwrite it. A direct `-ArchiveName` is also supported but must follow the same naming convention. Every new change needs its own accurate description; the script does not silently reuse an old update label.

## Archived material

`archive/09-September-2026-deploy-cleanup/` preserves the old ZIPs/checksums, extracted folders (including `12`), and QA previews under their original names. Nothing was permanently deleted. These are historical references, not upload candidates.

`archive/10-September-2026-project-curation/` preserves the previous 8 September upload/checksum. Do not upload it in place of the current curated release.

`archive/10-September-2026-approved-project-screenshots/` preserves the superseded project-curation ZIP/checksum. It does not contain the approved project screenshots.

`archive/14-September-2026-phone-image-uploads/` preserves the previous approved-screenshots ZIP/checksum, with both file hashes unchanged. User-extracted folders are left untouched. Nothing was permanently deleted.

The trusted original-design snapshot is now at `archive/09-September-2026-deploy-cleanup/liuguangxuan-cloudflare-pages/`. All its contents are preserved.

Keep only the latest upload ZIP/checksum at the top level. When replacing a release, move older packages into a dated descriptive archive folder and update this README plus `HANDOFF.md`.
