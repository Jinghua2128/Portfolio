# Project continuity

- Before starting work, read `HANDOFF.md` completely if it exists. Treat its latest checkpoint as context; the user's newest instructions take precedence.
- Keep `HANDOFF.md` current after each meaningful verified stage, before changing tasks, and before a likely context or usage limit. Do not wait until the final response; exact cutoffs are not predictable.
- If the user says "handoff", stop implementation and update `HANDOFF.md` so a new task can continue without the conversation.
- Record the current objective and constraints, completed changes and files, checks actually run and their results, unfinished work, blockers/required approvals, and a concrete next step. Clearly separate current state from historical notes.
- Preserve user changes. Never include secrets, tokens, `.env` contents, or private credentials in handoff documentation. Do not claim untested behavior works or mark incomplete work as finished.
- At the end of a task, link to the updated `HANDOFF.md` and mention any important pending approval or verification.

This continuity policy is reusable: copy it into another project's `AGENTS.md` (merge with any existing instructions rather than replacing them).
