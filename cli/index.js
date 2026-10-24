#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { homedir, platform } from "node:os";
import { join, dirname } from "node:path";

const ENDPOINT = process.env.CLAYCUT_URL || "https://claycut.dev/mcp";

/**
 * Config files to register into, per host OS. An editor counts as installed when its config
 * folder exists; the file itself is created if missing. VS Code (Copilot) keys servers under
 * "servers" and wants a type; everyone else uses "mcpServers".
 */
export function targets(home = homedir(), os = platform(), env = process.env) {
  const appData = env.APPDATA || join(home, "AppData", "Roaming");
  const appSupport =
    os === "win32" ? appData : os === "darwin" ? join(home, "Library", "Application Support") : join(home, ".config");
  return [
    { name: "Claude Code", path: join(home, ".claude.json"), dir: join(home, ".claude") },
    ...(os === "linux" ? [] : [{ name: "Claude Desktop", path: join(appSupport, "Claude", "claude_desktop_config.json") }]),
    { name: "Cursor", path: join(home, ".cursor", "mcp.json") },
    { name: "Windsurf", path: join(home, ".codeium", "windsurf", "mcp_config.json") },
    { name: "VS Code (Copilot)", path: join(appSupport, "Code", "User", "mcp.json"), field: "servers", type: "stdio" },
  ].map((t) => ({ field: "mcpServers", dir: dirname(t.path), ...t }));
}

/** Adds the claycut server to an existing config without touching anything else. */
export function merge(existing, key, endpoint = ENDPOINT, { field = "mcpServers", type } = {}) {
  const config = existing && typeof existing === "object" ? existing : {};
  config[field] = { ...config[field] };
  config[field].claycut = {
    ...(type ? { type } : {}),
    command: "npx",
    args: ["-y", "mcp-remote", endpoint, ...(key ? ["--header", `Authorization: Bearer ${key}`] : [])],
  };
  return config;
}

function install(key) {
  let n = 0;
  for (const t of targets()) {
    const { name, path } = t;
    if (!existsSync(t.dir)) continue;
    let existing = null;
    if (existsSync(path)) {
      const raw = readFileSync(path, "utf8").trim();
      if (raw) {
        try {
          existing = JSON.parse(raw);
        } catch {
          console.error(`✗ ${name}: ${path} is not valid JSON — fix or move it, then re-run.`);
          continue;
        }
      }
    }
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify(merge(existing, key, ENDPOINT, t), null, 2) + "\n");
    console.log(`✓ ${name} → ${path}`);
    n++;
  }
  if (!n) {
    console.error("No supported editor found (Claude Code, Claude Desktop, Cursor, Windsurf, VS Code). Install one, then re-run.");
    process.exit(1);
  }
  console.log("\nRestart your editor, then ask it for an icon.");
  if (!key) console.log("Free icons only. For custom ones, buy at https://claycut.dev/app and run the command under “Connect your editor”.");
}

// npx runs bins through a symlink in node_modules/.bin, so compare real paths.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  // No --key = free catalogue only; --key ck_… unlocks generation.
  const key = argv.includes("--key") ? argv[argv.indexOf("--key") + 1] : undefined;
  if (argv.includes("--key") && (!key || key.startsWith("--"))) {
    console.error("usage: npx setup-claycut [--key ck_…]   (copy it from https://claycut.dev/app)");
    process.exit(1);
  }
  install(key);
}
