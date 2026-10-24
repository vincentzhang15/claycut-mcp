<p align="center"><img src="https://claycut.dev/assets/brand/logo-v2.png" width="96" alt="Claycut"></p>

# Claycut

Custom icons for your app, added by your coding agent over MCP. Works in Claude Code, Cursor, Windsurf,
VS Code (Copilot) and Claude Desktop.

Ask your agent for "an inbox icon for the empty state" and a 1024×1024 transparent PNG lands in your
project in about six seconds. On the first icon the agent reads your design system (theme tokens,
Tailwind config, brand colours) and writes a one-line style guide to `CLAYCUT.md`; every icon after
that uses it, so icon 20 matches icon 1.

## Install

```sh
npx setup-claycut                 # free icons, no account
npx setup-claycut --key ck_…      # also generate your own (packs from $5)
```

The installer finds your editors and merges one server entry into each config. Source: [`cli/`](cli).

Any other MCP client can connect to the remote server directly.

**Endpoint:** `https://claycut.dev/mcp` (streamable HTTP). Free tools need no auth; for paid tools send
`Authorization: Bearer ck_…` from [claycut.dev/app](https://claycut.dev/app).

## Tools

| Tool | What it does | Cost |
|---|---|---|
| `find_free_icon` | Picks an icon from the free catalogue (clay, editorial, plush styles) and saves it to your project | Free, no key |
| `generate_app_icon` | Generates a new icon in your project's style | 1 icon from your pack |
| `edit_app_icon` | Changes an icon you made ("make it blue", "add a sparkle") | 1 icon from your pack |
| `find_my_icon` | Finds an icon you generated before | Free with a key |

Packs: 75 icons for $5, 200 for $12, 400 for $15, at [claycut.dev](https://claycut.dev). Designers can also make and download icons in the browser there.

## Known weak spot

Concrete objects ("wallet", "headphones") come out far better than abstract software nouns
("database", "terminal").

## Feedback

Bugs and requests: [open an issue](../../issues). [Terms](https://claycut.dev/terms) · CLI is MIT licensed.
