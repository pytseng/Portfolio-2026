#!/usr/bin/env node
/**
 * Upload a local file to Cloudflare R2 (portfolio media bucket).
 *
 * Usage:
 *   npm run r2:upload -- ./path/to/file.gif secret-stash/reasoning.gif
 *   npm run r2:list -- secret-stash/
 *
 * Auth: run `npx wrangler login` once (or set CLOUDFLARE_API_TOKEN).
 * Bucket: R2_BUCKET env (default portfolio-2026).
 * Public URL: VITE_MEDIA_BASE or R2_PUBLIC_BASE from .env / .env.local.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");

function loadEnvFiles() {
  for (const name of [".env.local", ".env"]) {
    const path = resolve(root, name);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] == null || process.env[key] === "") {
        process.env[key] = value;
      }
    }
  }
}

function contentTypeFor(filePath) {
  const ext = extname(filePath).toLowerCase();
  const map = {
    ".gif": "image/gif",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".pdf": "application/pdf",
  };
  return map[ext] ?? "application/octet-stream";
}

function publicUrl(key) {
  const base = (
    process.env.VITE_MEDIA_BASE ||
    process.env.R2_PUBLIC_BASE ||
    ""
  ).replace(/\/$/, "");
  return base ? `${base}/${key}` : null;
}

function runWrangler(args) {
  const result = spawnSync("npx", ["wrangler", ...args], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
  return result.status ?? 1;
}

function printHelp() {
  console.log(`R2 media helper for Portfolio-2026

Upload:
  npm run r2:upload -- <local-file> <object-key>
  npm run r2:upload -- ./reasoning.gif secret-stash/reasoning.gif

List:
  npm run r2:list
  npm run r2:list -- secret-stash/

Env:
  R2_BUCKET          (default: portfolio-2026)
  VITE_MEDIA_BASE    public CDN base (already in .env)
  CLOUDFLARE_API_TOKEN  optional instead of wrangler login
`);
}

loadEnvFiles();

const bucket = process.env.R2_BUCKET || "portfolio-2026";
const [, , cmdOrFile, maybeKey, ...rest] = process.argv;

if (!cmdOrFile || cmdOrFile === "--help" || cmdOrFile === "-h") {
  printHelp();
  process.exit(cmdOrFile ? 0 : 1);
}

// npm run r2:list -- [prefix]
// Wrangler has no object-list; verify public URLs / show bucket instead.
if (cmdOrFile === "list" || process.env.npm_lifecycle_event === "r2:list") {
  const prefixArg =
    process.env.npm_lifecycle_event === "r2:list"
      ? cmdOrFile === "list"
        ? maybeKey
        : cmdOrFile
      : maybeKey;
  const prefix =
    prefixArg && prefixArg !== "list" ? prefixArg.replace(/^\//, "") : "";

  console.log(`Bucket: ${bucket}`);
  runWrangler(["r2", "bucket", "list"]);

  const base = (
    process.env.VITE_MEDIA_BASE ||
    process.env.R2_PUBLIC_BASE ||
    ""
  ).replace(/\/$/, "");

  if (!base) {
    console.log("\nSet VITE_MEDIA_BASE to HEAD-check public object URLs.");
    process.exit(0);
  }

  const candidates = prefix
    ? [
        prefix.replace(/\/?$/, "/"),
        `${prefix.replace(/\/?$/, "")}/herobg.png`,
        `${prefix.replace(/\/?$/, "")}/reasoning.gif`,
      ]
    : ["secret-stash/herobg.png", "secret-stash/reasoning.gif"];

  console.log("\nPublic HEAD checks:");
  for (const key of candidates) {
    const url = `${base}/${key.replace(/^\//, "")}`;
    try {
      const res = await fetch(url, { method: "HEAD" });
      console.log(`  ${res.status}  ${url}`);
    } catch (err) {
      console.log(`  ERR  ${url}  (${err instanceof Error ? err.message : err})`);
    }
  }
  process.exit(0);
}

const localPath = resolve(process.cwd(), cmdOrFile);
const objectKey = (maybeKey || "").replace(/^\//, "");

if (!objectKey) {
  console.error("Missing object key.\n");
  printHelp();
  process.exit(1);
}

if (!existsSync(localPath)) {
  console.error(`File not found: ${localPath}`);
  process.exit(1);
}

const remote = `${bucket}/${objectKey}`;
const contentType = contentTypeFor(localPath);

console.log(`Uploading ${basename(localPath)} → ${remote}`);
console.log(`Content-Type: ${contentType}`);

const status = runWrangler([
  "r2",
  "object",
  "put",
  remote,
  "--file",
  localPath,
  "--remote",
  "--content-type",
  contentType,
]);

if (status !== 0) {
  console.error(`
Upload failed. Auth options:
  1) npx wrangler login
  2) export CLOUDFLARE_API_TOKEN=...  (Account → API Tokens → R2 Edit)
`);
  process.exit(status);
}

const url = publicUrl(objectKey);
console.log(`Uploaded: ${remote}`);
if (url) {
  console.log(`Public:  ${url}`);
} else {
  console.log("Set VITE_MEDIA_BASE to print the public URL.");
}
