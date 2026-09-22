# Liu GuangXuan Portfolio

Personal portfolio built with plain HTML, CSS and JavaScript, with Firebase-backed project/blog editors and a separate editorial site. The main site preserves the established dark grid design. The 3D Immersion page uses three approved Sketchfab embeds.

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

- Six public built-in projects and 19 retained catalog records; admin visibility controls preserve hidden records.
- Blog/project editing, authentication and comments using the existing Firebase integration; local fallback content renders while data loads.
- Main-site editors with validation, preview, chips and admin-account-scoped recoverable drafts. The editorial forms are older and do not offer the same local draft recovery.
- Explicit image selection, preview and Storage upload for both sites; Upload and Save/Publish remain separate actions.
- Newest-first Blog ordering and Featured / In Progress / Latest project views, with at most three projects per view.
- Keyboard/drawer/navigation refinements and motion that responds to reduced-motion preferences.

Read [FIREBASE-STORAGE-SETUP.md](FIREBASE-STORAGE-SETUP.md) before configuring or testing live uploads. [storage.rules.example](storage.rules.example) is an example to review and merge, not a deployed ruleset.

## Verification and deployment

On 22 September 2026, the 16 existing runtime JavaScript files passed `node --check`; the existing 14 September deployment ZIP's checksum was reverified. Earlier Windows browser checks used local Firebase test doubles for editor/upload workflows. Live authentication, production rules, billing, phone uploads and Mac behavior remain unverified. See [MAC-HANDOFF.md](MAC-HANDOFF.md) for the distinction between fresh and historical evidence.

Cloudflare Pages is the established deployment target. [deploy/README.md](deploy/README.md) and [deploy/package-cloudbase.ps1](deploy/package-cloudbase.ps1) describe the explicit 41-file runtime allowlist. ZIPs and archived deployment snapshots stay local and are not included in Git. The packaging script uses PowerShell; it has not been tested on macOS.

**Do not deploy the repository root.** The legacy `firebase.json` points Hosting at `.` and is not the approved deployment workflow. A source push is not evidence of a site deployment, and this transfer does not authorize Firebase writes or hosting changes.

Preserve real content, the established designs, existing Firebase data shapes and user edits. Additional imagery/models and portfolio entries need the user's relevant approval. The three project screenshots and three Sketchfab embeds documented in the handoff are already approved.
