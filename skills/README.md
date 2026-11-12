# Skills for AI coding tools

These files teach AI coding tools (Claude Code, Cursor, Copilot and others) to build Coachli screens with the design system instead of writing their own UI.

## Add them to the dashboard app

1. Copy the `coachli-ui` folder into the app repository at `.claude/skills/coachli-ui/`. Claude Code loads it by itself whenever a task touches the UI.
2. Copy [`AGENTS.app.md`](AGENTS.app.md) to the root of the app repository as `AGENTS.md` (or paste it into the one you have). Most AI coding tools read that file at the start of every task. For Claude Code, also add a `CLAUDE.md` with one line: `@AGENTS.md`.

Update both when the design system changes: the skill here is the source, so copy it again after pulling a new version.
