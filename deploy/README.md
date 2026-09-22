# Deployment packages

## GitHub / Mac transfer — 22 September 2026

Only this README and `package-cloudbase.ps1` are tracked from `deploy/`. ZIPs, checksums, extracted sites and `archive/` remain local on Windows; a Git clone will not contain them. The package details below describe that existing Windows artifact. See `../MAC-HANDOFF.md` for restoring the two ignored Firebase configs before rebuilding. The PowerShell packager has not been verified on macOS. Source publication does not deploy the website or create a GitHub Release.

## Latest Windows runtime package

Upload **14-September-2026-phone-image-uploads-newest-blog-project-views.zip** only.

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
