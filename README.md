# Liu GuangXuan Portfolio

Personal portfolio built with plain HTML, CSS and JavaScript, with Firebase-backed project/blog editors and a separate editorial site. The main site preserves the established dark grid design. The 3D Work page uses three approved Sketchfab embeds.

## Continue on a Mac

Start with [MAC-HANDOFF.md](MAC-HANDOFF.md), then read [AGENTS.md](AGENTS.md) and all of [HANDOFF.md](HANDOFF.md). The newest handoff checkpoint overrides the historical sections. The Mac guide contains the full project description, configuration steps, file map, approved content, verification limits and a prompt for the next Codex task.

```sh
git clone https://github.com/Jinghua2128/Portfolio.git
cd Portfolio
```

Before previewing, restore the existing ignored `firebase-config.js` and `editorial-portfolio/firebase-config.js` from your Windows copy via a private transfer. Alternatively, copy `firebase-config.example.js` to `firebase-config.js`, fill the existing Firebase web-app settings and authorized admin values, then copy that completed file to `editorial-portfolio/firebase-config.js`. Never put service-account keys, passwords or tokens in these browser files. `.env` is not required by the runtime.

If Python 3 is available:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open [the main site](http://127.0.0.1:8765/) or [the editorial site](http://127.0.0.1:8765/editorial-portfolio/). Serve the project over HTTP rather than opening HTML directly. There is no build step, `npm start`, or `npm test` script. The HTML loads Firebase **8.10.1 from CDN**; the npm Firebase dependency is not used by this runtime.

## Current functionality

- Eight public built-in projects and 21 retained catalog records; visibility controls preserve hidden records. Existing remote records can supplement the catalog.
- Public Projects and Blog are read-only apart from signed-in comment creation. Owner editing is on `/admin/`; editor markup mounts only after the configured owner UID is authenticated. Firestore rules, not client UI checks, enforce write access.
- Main-site editors retain validation, preview, chips and admin-account-scoped recoverable drafts. The editorial site's public pages also omit editor controls.
- Static homepage highlights and three case studies present project roles, tools and technical decisions without depending on Firebase. The interactive focus panel follows the work; case-study navigation and contact calls to action connect the pages.
- Explicit image selection, preview and Storage upload in owner editors; Upload and Save/Publish remain separate actions. Live Storage remains unprovisioned/unverified.
- Newest-first Blog ordering and Featured / In Progress / Latest project views, with at most three projects per view.
- The root Blog combines the selected Linear/Fuwari references with the existing dark-grid identity: rounded cards, topic counts, search, an author sidebar and full-page reading with comments underneath. `blog-page.js` / `blog-page.css` contain the public presentation; `blog-firebase.js` still owns data and comment operations. The editorial variant and owner editor retain their existing layouts.
- Article links use `blog.html?post=<existing-document-id>`; optional `q` and `topic` parameters preserve filters. Links support reload and browser history without a hosting rewrite. This client-side routing does not provide per-post server-rendered Open Graph metadata or a server 404 response for unavailable posts.
- Keyboard/drawer/navigation refinements and motion that responds to reduced-motion preferences.

Read [FIREBASE-STORAGE-SETUP.md](FIREBASE-STORAGE-SETUP.md) before configuring or testing live uploads. [storage.rules.example](storage.rules.example) is an example to review and merge, not a deployed ruleset.

## Verification and deployment

The 4 October Mac preview passed responsive read-only checks on the root pages, public-editor gating and signed-out admin redirects. Firestore owner-only write rules were published on 2 October and checked in Rules Playground, but real-auth owner saves, non-owner write denial and comment creation have not been tested end to end. See the latest [HANDOFF.md](HANDOFF.md) checkpoint for current checks and outstanding privacy/schema work; historical local-double tests are not production evidence.

Cloudflare Pages is the established deployment target. Deployment now runs from GitHub: a push to `main` builds the audited 50-file runtime package (`node deploy/build-package.mjs` → `dist/`) and deploys it to the existing `liuguangxuan-portfolio` Pages project via `.github/workflows/pages-deployment.yml`. Firebase browser config is injected from GitHub Actions secrets at build time and is never committed. [deploy/README.md](deploy/README.md) and [deploy/package-cloudbase.ps1](deploy/package-cloudbase.ps1) retain the explicit 50-file runtime allowlist (49 files plus the owner-supplied internship photo added on 22 October), including the two public Blog presentation files added on 18 October. The PowerShell recipe remains legacy and unexecuted on macOS. The September ZIP does not contain the current source changes.

**Do not deploy the repository root.** `firebase.json` now declares only the Firestore rules source and no Hosting target. Use an audited runtime package for hosting. A source push is not evidence of a site deployment; source development does not authorize Firebase writes or hosting changes.

Preserve real content, the established designs, existing Firebase data shapes and user edits. Additional imagery/models and portfolio entries need the user's relevant approval. The three project screenshots and three Sketchfab embeds documented in the handoff are already approved.
