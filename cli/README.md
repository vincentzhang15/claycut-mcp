<p align="center"><img src="https://claycut.dev/assets/brand/logo-v2.png" width="96" alt="Claycut"></p>

# setup-claycut

Custom icons for your app, built into Claude Code, Cursor, Windsurf, VS Code (Copilot) and Claude Desktop. This installs the [Claycut](https://claycut.dev) MCP server, so your coding agent can add finished icons to your project as it builds: clay, plush, editorial, or your own style.

```sh
npx setup-claycut                      # free icons, no account
npx setup-claycut --key ck_…   # also make your own (packs from $5)
```

Finds every supported editor you have installed (macOS, Windows, Linux) and adds one server entry —
merging into the existing JSON rather than overwriting it. Restart your editor afterwards.

| Editor | Config written |
|---|---|
| Claude Code | `~/.claude.json` |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)<br>`%APPDATA%\Claude\claude_desktop_config.json` (Windows) |
| Cursor | `~/.cursor/mcp.json` |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` |
| VS Code (Copilot) | `~/Library/Application Support/Code/User/mcp.json` (macOS)<br>`%APPDATA%\Code\User\mcp.json` (Windows)<br>`~/.config/Code/User/mcp.json` (Linux) |

Your editor then exposes `find_free_icon` (free, no account) and `generate_app_icon`. Ask for an icon and a
1024×1024 transparent PNG lands in your project, background already cut.

Custom icons follow your project's style. On the first one, the agent reads your design system (theme tokens,
Tailwind config, brand colours, existing icons), or works out what your app is for when there isn't one, and writes
a `CLAYCUT.md` style guide at the repo root. It shows you a sample icon to approve, then every icon after that uses
the same style line, so they all match. Edit `CLAYCUT.md` to change the style; commit it so your team gets the same
icons. The house styles (`clay`, `editorial`, `plush`) are used only when one fits.

```text
› make a webpage for my bakery, use Claycut icons
  ⏺ claycut.find_free_icon × 3  coffee cup, clock, map pin
✓ index.html + 3 clay icons in public/icons
```

Buy icons at [claycut.dev/app](https://claycut.dev/app): the exact `--key` command is under
“Connect your editor”, and you can make and download icons there too. [Terms](https://claycut.dev/terms) · MIT licensed.
