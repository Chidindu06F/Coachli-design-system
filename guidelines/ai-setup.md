# AI setup

AI tools can read the Figma files, use these guidelines and build with the design system. Set them up once.

## What you install

| Piece | What it does | Who needs it |
| --- | --- | --- |
| **Coachli plugin for Claude Code** | Adds the Coachli skills (components, copy, design gaps, review) and connects Figma's MCP server in one install | Designers and developers using Claude Code |
| **Figma MCP server** | Lets an AI tool read Figma screens, layers, variables and components (and, for designers, edit the canvas) | Anyone using AI with Figma |
| **`AGENTS.md` in the app repository** | The short rules for tools that don't use Claude skills (Cursor, Copilot, Codex) | Developers |
| **The npm packages** | The components and tokens themselves | Developers (see Developer setup in Storybook) |

## Claude Code: install the Coachli plugin

In Claude Code, run:

```
/plugin marketplace add Chidindu06F/Coachli-design-system
/plugin install coachli-design-system@coachli-design-system
```

Then run `/reload-plugins`. This adds:

- `coachli-ui`: which component to use and the decided patterns.
- `coachli-copy`: how Coachli writes, and the formats for money, dates and numbers.
- `coachli-gaps`: what to do when a screen or state isn't designed.
- `coachli-review`: a check before a pull request or a design handover.
- The Figma MCP server.

The skills turn on by themselves when a task needs them. To get updates: `/plugin`, Installed, Update now (or turn on auto-update in the Marketplaces tab).

## Connect Figma (once)

After installing the plugin (or adding Figma yourself with `claude mcp add --transport http figma https://mcp.figma.com/mcp --scope user`):

1. Start a new Claude Code session and run `/mcp`.
2. Select **figma**, then **Authenticate**.
3. In the browser, click **Allow access** with your Coachli Figma account.
4. Run `/mcp` again: figma shows as connected.

Now paste a Figma link (right-click a frame, **Copy link to selection**) and ask Claude to build it, explain it or check it.

In the Claude desktop app you can instead turn on Figma under **Settings → Connectors**.

**Seats:** developers need at least a Dev seat to read the files; designers need a Full seat to let AI edit the canvas.

## Designers: designing with Claude and Figma

With Figma connected, Claude can work directly in the Coachli file and the design system file.

1. Open Claude Code in this repository (so it reads `AGENTS.md` and the guidelines).
2. Give it a Figma link to the page or frame and say what you want: "Add the error state for step 2 to the Live events row", "Make the mobile version of this screen".
3. It must follow these guidelines: only COACHLI DESIGN SYSTEM components, no detaching, tokens only, every state, auto layout, section and screen labels.
4. Check the result in Figma before you publish. AI makes mistakes; you own the design.
5. When a component or token changes, ask Claude to mirror it in the React package and the changelog, then check it in Storybook (`pnpm dev`).

## Developers: building with AI

1. Install the packages (Storybook → Developer setup).
2. Install the Coachli plugin in Claude Code, or copy `skills/AGENTS.app.md` to your app's root as `AGENTS.md` for other tools.
3. Connect Figma.
4. Give the AI the Figma link of the screen you are building. It reads the layers (each layer name is the component) and builds with `@chidindu06f/coachli-react`.
5. When something isn't designed, the AI follows [Design gaps](design-gaps.md): it copies the closest screen, marks it `// DESIGN GAP`, and you tell the designer.
