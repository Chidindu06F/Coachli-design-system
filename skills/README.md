# Skills for AI coding tools

These skills teach AI tools (Claude Code, Cursor, Copilot and others) to design and build Coachli with the design system, the way a Coachli designer would.

| Skill | What it does |
| --- | --- |
| `coachli-ui` | Uses the right component for each job, tokens only, and the decided patterns. Works in code and in Figma |
| `coachli-copy` | Writes copy the Coachli way, and formats money, dates, times and numbers |
| `coachli-gaps` | What to do when a screen or state isn't designed: copy the closest screen, mark it, tell the designer |
| `coachli-review` | A checklist before a pull request or a design handover |

The skills read the guides in [`guidelines/`](../guidelines/README.md), the same text as the Figma *How to use* page and Storybook's Guidelines.

## Claude Code: install the plugin (recommended)

```
/plugin marketplace add Chidindu06F/Coachli-design-system
/plugin install coachli-design-system@coachli-design-system
/reload-plugins
```

This adds all four skills and connects Figma's MCP server. Then run `/mcp`, choose **figma**, then **Authenticate**. Update from `/plugin` → Installed → Update now, or turn on auto-update in the Marketplaces tab.

## Other tools (Cursor, Copilot, Codex)

Copy [`AGENTS.app.md`](AGENTS.app.md) to the root of the app repository as `AGENTS.md` (or paste it into the one you have). Most AI coding tools read that file at the start of every task. Connect Figma's MCP server (`https://mcp.figma.com/mcp`) in the tool's MCP settings.

## Changing a skill

Change the guideline in `guidelines/` and the Figma *How to use* page together. Change a `SKILL.md` only for how the AI should work, not for the rules themselves.
