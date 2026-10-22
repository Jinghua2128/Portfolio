# Project continuity

- Before starting work, read `HANDOFF.md` completely if it exists. Treat its latest checkpoint as context; the user's newest instructions take precedence.
- Keep `HANDOFF.md` current after each meaningful verified stage, before changing tasks, and before a likely context or usage limit. Do not wait until the final response; exact cutoffs are not predictable.
- If the user says "handoff", stop implementation and update `HANDOFF.md` so a new task can continue without the conversation.
- Record the current objective and constraints, completed changes and files, checks actually run and their results, unfinished work, blockers/required approvals, and a concrete next step. Clearly separate current state from historical notes.
- Preserve user changes. Never include secrets, tokens, `.env` contents, or private credentials in handoff documentation. Do not claim untested behavior works or mark incomplete work as finished.
- At the end of a task, link to the updated `HANDOFF.md` and mention any important pending approval or verification.

This continuity policy is reusable: copy it into another project's `AGENTS.md` (merge with any existing instructions rather than replacing them).


<!-- BEGIN:codex-handoff-workflow -->
## Project handoff workflow

- Read `HANDOFF.md`, `PROJECT_MAP.md`, `DECISIONS.md`, and `FAILURE_LOG.md` before substantive project work. Reconcile them with the actual files and Git status; historical next steps do not authorize new work.
- Keep these four files at this project's root. Create missing files with verified facts; never replace existing history with templates. `HANDOFF.md` holds current progress, `PROJECT_MAP.md` verified paths, `DECISIONS.md` enduring choices, and `FAILURE_LOG.md` evidence-backed lessons.
- Update the handoff at meaningful checkpoints, before risky or lengthy operations, and before a substantive final response. Record changed files, actual verification results, unresolved issues, and the exact first next action. Update the other records when relevant.
- Preserve user changes and established folders. Place new files consistently; broad moves, renames, deletion, or deduplication require user authorization. Preserve asset references and metadata.
- Keep secrets and private personal data out of these records. Distinguish verified results from assumptions and tests not run. For a read-only question, do not rewrite memory unless new facts affect the project.
<!-- END:codex-handoff-workflow -->
