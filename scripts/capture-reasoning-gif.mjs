#!/usr/bin/env node
/**
 * Capture SecretStash reasoning pills → GIF.
 * Usage: node scripts/capture-reasoning-gif.mjs
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import ffmpegPath from "ffmpeg-static";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const framesDir = join(root, "scripts/tmp-reasoning-frames");
const outGif = join(root, "public/secret-stash/reasoning.gif");
const APP_URL = process.env.SECRETSTASH_URL || "https://chat-ai-ux.vercel.app";

const PREFS = {
  gender: "men",
  style: "technical",
  size: "m",
};

function cleanDir(dir) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

async function main() {
  if (!ffmpegPath || !existsSync(ffmpegPath)) {
    throw new Error("ffmpeg-static binary not found");
  }

  cleanDir(framesDir);
  mkdirSync(dirname(outGif), { recursive: true });

  console.log(`Opening ${APP_URL}`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  await page.addInitScript((prefs) => {
    localStorage.setItem(
      "secretstash-user-preferences",
      JSON.stringify(prefs),
    );
  }, PREFS);

  await page.goto(APP_URL, { waitUntil: "networkidle", timeout: 60000 });

  // Dismiss preference prompt if it still appears
  const continueBtn = page.getByRole("button", { name: /continue/i });
  if (await continueBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
    for (const label of ["Men", "Technical", "M"]) {
      const chip = page.getByRole("button", { name: label, exact: true });
      if (await chip.isVisible().catch(() => false)) await chip.click();
    }
    await continueBtn.click();
    await page.waitForTimeout(500);
  }

  const suggestion = page.locator(".suggestion-chip").first();
  await suggestion.waitFor({ state: "visible", timeout: 15000 });
  const promptText = (await suggestion.innerText()).trim();
  console.log(`Starting chat: ${promptText}`);
  await suggestion.click();

  await page.locator(".reasoning-pills").waitFor({
    state: "visible",
    timeout: 30000,
  });
  console.log("Reasoning pills visible — capturing frames");

  // Full phone UI (viewport), hold through reasoning (~6s).
  const frameCount = 40;
  const intervalMs = 160;
  for (let i = 0; i < frameCount; i++) {
    const path = join(framesDir, `frame-${String(i).padStart(3, "0")}.png`);
    await page.screenshot({ path });
    await page.waitForTimeout(intervalMs);
  }

  // Prefer stopping generation to keep GIF focused if still running
  const stop = page.getByRole("button", { name: /stop generating/i });
  if (await stop.isVisible().catch(() => false)) {
    await stop.click().catch(() => {});
  }

  await browser.close();

  const frames = readdirSync(framesDir)
    .filter((f) => f.endsWith(".png"))
    .sort();
  if (frames.length < 4) {
    throw new Error(`Too few frames captured (${frames.length})`);
  }

  console.log(`Encoding ${frames.length} frames → ${outGif}`);
  const result = spawnSync(
    ffmpegPath,
    [
      "-y",
      "-framerate",
      "6",
      "-i",
      join(framesDir, "frame-%03d.png"),
      "-vf",
      "fps=6,scale=390:844:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer",
      "-loop",
      "0",
      outGif,
    ],
    { stdio: "inherit" },
  );

  if (result.status !== 0) {
    throw new Error("ffmpeg failed");
  }

  console.log(`Done: ${outGif}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
