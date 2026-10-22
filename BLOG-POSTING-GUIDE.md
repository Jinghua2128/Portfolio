# Blog posting guide

How the owner posts, and how the owner and the agent work together on the journal.
This documents the fields the site actually stores and renders; it is not a new CMS feature.
No uploads or video are part of this workflow (declined 22 October 2026) — media is an existing
approved path under `imgs/`, or no image.

## 1. Working flow

1. **You send a brief** using the intake template in §2 (bullet points, voice-note transcript, or rough notes are fine).
2. **I draft** the title, category, date, excerpt, body paragraphs, media paths and links, and return them as a filled field table.
3. **You review and correct** anything factual. Nothing is published until you approve.
4. **You publish** from `/admin/blog.html` while signed in as the owner (the owner-only Firestore rule is the real permission boundary). I can walk you through it field by field.
5. **I verify** the live result on `/blog.html` (card, topic count, search, article, comments) and note anything relevant in `HANDOFF.md`.
6. **Edits** reopen the existing post in the editor and keep its document ID and URL — no duplicates.

I do not write to Firestore, change rules, or publish without your explicit approval in that turn.

## 2. Send me this (copy and fill)

```text
Working title:
Category:                 # Internship | Capstone / Pitch | Cultural Storytelling | Overseas Learning | new theme
Date:                     # actual date of the event, YYYY-MM-DD
What happened:            # 2–5 bullets
My role / what I did:     # bullets
Outcome or what I learned:
Next step (optional):
Cover image:              # path under imgs/... , or "none"
Extra images (optional):  # one existing path per line
Related project (optional): # project name or its projects.html#project-<id> link
External link (optional):
Do not say:               # anything to avoid, names to omit, claims that are not confirmed
```

## 3. What the site stores and shows

| Editor field | Stored field | Required | Where it appears |
|---|---|---|---|
| Title | `title` | Yes | Card heading + article heading |
| Category | `category` | Yes | Card label, article meta, topic filter and its count |
| Post date | `date` (plus legacy `day`/`month`, preserved) | Strongly recommended | Card/article date; newest-first order |
| Excerpt | `excerpt` | Yes | Card summary (3-line clamp) and article intro |
| Body | `body` | Expected | Article paragraphs |
| Cover image URL | `coverImage` | No | Card image + article image; blank = text-only fallback |
| Body image URLs | `imageUrls` | No | Image grid in the article; duplicates of the cover are suppressed |
| Related project link | `relatedProject` | No | “Related project” button in the article |
| Primary link | `link` | No | “Open Link” button in the article |
| Save destination | `publicationState` | Yes | “Local draft” = browser-only; “Publish to website” = live |

The editor also keeps a hidden post ID (unchanged when editing) and writes `createdAt` / `updatedAt` / `sortOrder` automatically. Do not type IDs or dates into the legacy day/month fields — they are preserved for old posts only.

## 4. How I will shape it

- **Title** — 3–8 words, specific and plain, e.g. `EchoWorks: Singapore Red Cross Playbook Pitch`. No clickbait, no all-caps.
- **Category** — reuse one of the current four unless you genuinely plan a recurring new theme; every new category becomes a filter with a count. `Journal` is only the fallback when a category is missing.
- **Date** — the real date the event happened; it controls newest-first order and is shown as e.g. `7 Sept 2026`. No invented or rounded dates.
- **Excerpt** — one or two sentences, roughly 100–180 characters. This is the card text and the article intro, so write it as a summary, not as the first paragraph (if it is identical to the body it is shown only once).
- **Body** — 120–350 words, usually 3–5 short paragraphs. Plain text only: a blank line starts a new paragraph, single line breaks become spaces, and Markdown/HTML is escaped and shown literally. Suggested flow:
  1. Context — what this was and where it happened.
  2. What you did — your specific contribution (never someone else’s).
  3. Outcome — what was made or delivered, honestly.
  4. Reflection / next step — what you learned or what comes next (optional).
- **Media** — only approved existing files, exact path and case, e.g. `imgs/Blogs/EchoWorks/photo.JPG`. If there is no suitable approved image, leave it blank: cards show a text fallback and the article hides a failed image. Do not invent paths for missing files. (The remote Empire AI record still points at missing `imgs/EmpireAI/photo.JPG`; do not copy that.)
- **Links** — related project uses the real project link `projects.html#project-<id>` (or pick it from the editor dropdown); the primary link is any `https://` or relative page path.
- **Length** — reading time is calculated at 200 words per minute (minimum 1 min). Most entries will read “1 min read”; that is normal.
- **Field limits** — body up to 100,000 characters; title/category/excerpt/link fields up to 4,000; comments up to 2,000.

## 5. House style and do-nots

- Professional portfolio wording. Never use `ASG`, `CA`, `assignment`, `coursework`, `school project`, `submission`.
- No invented clients, commissions, dates, metrics, results, images or collaborators. If a detail is unconfirmed, leave it out or mark it for you to confirm.
- First person, past tense for events; present tense for standing facts.
- Keep names and credits accurate (credit teammates only for their own work).
- No public personal contact details, no passwords, no screenshots containing private information.
- No emoji or decorative characters in body copy; keep the restrained editorial tone.
- New images or video are not part of this workflow. Adding an image asset needs separate approval and must follow the existing `imgs/` structure.

## 6. Publish checklist (owner)

1. Open `/admin/blog.html`, sign in as the owner.
2. **New Post** (or choose an existing post to edit — keep the same record).
3. Fill the overview fields, date, media paths and links in the editor.
4. Set **Save destination** to `Publish to website`, then **Save Post**.
5. Check `/blog.html`: card text/image, topic count, search, open the article, comments, Back/Forward.
6. For an edit: confirm the old wording was replaced and the article URL did not change.

A local draft is stored only in that browser for that admin account. It is not a cloud backup and does not unpublish a live post.

## 7. Division of work

| I can | I cannot (without a new explicit approval) |
|---|---|
| Draft, rewrite, structure and fact-check against existing public content | Publish, edit or delete live posts/projects |
| Propose category, date, excerpt, media path and related links | Change Firebase rules, billing, Storage or hosting |
| Check the rendered card/article and record verification | Add new images, video or external embeds |
| Update `HANDOFF.md` and related records | Push or deploy anything |

Related: [HANDOFF.md](HANDOFF.md), [README.md](README.md), [DECISIONS.md](DECISIONS.md).
