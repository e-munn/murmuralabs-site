---
name: handoff
description: Commit, push, and write session context so you can resume on another machine
user-invocable: true
---

# Session Handoff

The user is switching machines or ending this session. Perform ALL of the following steps:

## 1. Commit & Push

- Run `git status` to see all pending changes (staged, unstaged, untracked)
- Stage all relevant project files (exclude large binaries, generated media, node_modules, .env)
- Write a clear commit message summarizing what was done this session
- Push to the current branch on origin
- If push fails (no upstream), set upstream with `git push -u origin <branch>`

## 2. Write HANDOFF.md

Create or overwrite `HANDOFF.md` in the repo root with this structure:

```markdown
# Session Handoff — [date]

## What was done this session
[Bullet list of concrete accomplishments — files created, features built, bugs fixed]

## Current state
[What works, what's broken, what's partially complete]

## Next steps (priority order)
[Numbered list of what to do next, with enough detail that a fresh Claude session can pick up immediately]

## Key decisions made
[Any architectural or design choices that affect future work]

## Open questions
[Anything unresolved that needs user input]
```

Populate it from the conversation history — be specific about file paths, function names, and technical details. This file is the primary context bridge for the next session.

## 3. Update memory

Update the auto memory files in the persistent memory directory to reflect any new:
- Architectural patterns or conventions discovered
- File paths or data pipeline changes
- Known issues or gotchas
- User preferences learned this session

## 4. Confirm

After completing all steps, show the user:
- The commit hash and what was pushed
- A brief summary of what HANDOFF.md contains
- Any files that were intentionally NOT committed (and why)

$ARGUMENTS
