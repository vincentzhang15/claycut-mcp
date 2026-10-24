import assert from "node:assert/strict";
import { merge, targets } from "./index.js";
import { symlinkSync, mkdtempSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

// keeps unrelated servers, overwrites a stale claycut entry
const before = { mcpServers: { other: { command: "foo" }, claycut: { command: "stale" } }, theme: "dark" };
const after = merge(before, "ck_123", "https://x.dev/mcp");
assert.deepEqual(after.mcpServers.other, { command: "foo" });
assert.equal(after.theme, "dark");
assert.deepEqual(after.mcpServers.claycut.args, [
  "-y", "mcp-remote", "https://x.dev/mcp", "--header", "Authorization: Bearer ck_123",
]);

// survives an empty or absent config
assert.ok(merge(null, "k").mcpServers.claycut);

// keyless install = free tier, no auth header
assert.deepEqual(merge({}, undefined, "https://x.dev/mcp").mcpServers.claycut.args, ["-y", "mcp-remote", "https://x.dev/mcp"]);

// per-OS paths
const byName = (os, env) => Object.fromEntries(targets("/h", os, env).map((t) => [t.name, t]));
assert.ok(byName("darwin")["Claude Desktop"].path.includes("Application Support"));
assert.ok(byName("win32", { APPDATA: "C:\\h\\AppData\\Roaming" })["Claude Desktop"].path.includes("AppData"));
assert.equal(byName("linux")["Claude Desktop"], undefined);
assert.equal(byName("darwin")["Claude Code"].path, join("/h", ".claude.json"));
assert.equal(byName("darwin")["Claude Code"].dir, join("/h", ".claude"));
assert.ok(byName("darwin")["Windsurf"].path.endsWith(join("windsurf", "mcp_config.json")));

// VS Code keys servers under "servers" with a type
const vs = byName("darwin")["VS Code (Copilot)"];
const vsCfg = merge({ servers: { other: {} } }, undefined, "https://x.dev/mcp", vs);
assert.deepEqual(vsCfg.servers.other, {});
assert.equal(vsCfg.servers.claycut.type, "stdio");
assert.equal(vsCfg.mcpServers, undefined);

// runs when invoked through a symlink, the way npx calls bins
const link = join(mkdtempSync(join(tmpdir(), "claycut-")), "setup-claycut");
symlinkSync(new URL("./index.js", import.meta.url).pathname, link);
const run = spawnSync(process.execPath, [link, "--key"]);
assert.equal(run.status, 1);
assert.match(run.stderr.toString(), /usage: npx setup-claycut/);

console.log("ok");
