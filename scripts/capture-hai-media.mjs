#!/usr/bin/env node
/**
 * Capture Human–AI collaboration media for SecretStash case study.
 * 1) prefs.gif — first-ask profile prompt (full phone)
 * 2) clarify.png — vague trip → ask for detail
 * 3) owned.gif — mark suggested item as owned
 *
 * Usage: node scripts/capture-hai-media.mjs
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "playwright";
import ffmpegPath from "ffmpeg-static";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/secret-stash");
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

function encodeGif(framesDir, outGif, { fps = 8, width = 390, height = 844 } = {}) {
  const frames = readdirSync(framesDir)
    .filter((f) => f.endsWith(".png"))
    .sort();
  if (frames.length < 4) {
    throw new Error(`Too few frames in ${framesDir} (${frames.length})`);
  }
  console.log(`Encoding ${frames.length} frames → ${outGif}`);
  const result = spawnSync(
    ffmpegPath,
    [
      "-y",
      "-framerate",
      String(fps),
      "-i",
      join(framesDir, "frame-%03d.png"),
      "-vf",
      `fps=${fps},scale=${width}:${height}:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer`,
      "-loop",
      "0",
      outGif,
    ],
    { stdio: "inherit" },
  );
  if (result.status !== 0) throw new Error(`ffmpeg failed for ${outGif}`);
}

async function dismissContinueIfNeeded(page) {
  const continueBtn = page.getByRole("button", { name: /continue/i });
  if (await continueBtn.isVisible({ timeout: 1200 }).catch(() => false)) {
    // Only auto-fill if this is the preference prompt with chips
    for (const label of ["Men", "Technical", "M"]) {
      const chip = page.getByRole("button", { name: label, exact: true });
      if (await chip.isVisible().catch(() => false)) await chip.click();
    }
    if (await continueBtn.isEnabled().catch(() => false)) {
      await continueBtn.click();
      await sleep(400);
    }
  }
}

async function openFreshApp(browser, { clearPrefs = true, setPrefs = false } = {}) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  await page.addInitScript(
    ({ setPrefs, prefs }) => {
      for (const key of [
        "secretstash-user-preferences",
        "secretstash-chat-history",
        "secretstash-active-chat-id",
        "secretstash-saved-products",
      ]) {
        localStorage.removeItem(key);
      }
      if (setPrefs) {
        localStorage.setItem(
          "secretstash-user-preferences",
          JSON.stringify(prefs),
        );
      }
    },
    { setPrefs, prefs: PREFS },
  );

  await page.goto(APP_URL, { waitUntil: "networkidle", timeout: 60000 });
  await sleep(500);
  return { context, page };
}

async function capturePrefsGif(browser) {
  const framesDir = join(root, "scripts/tmp-hai-prefs-frames");
  const outGif = join(outDir, "hai-prefs.gif");
  cleanDir(framesDir);
  mkdirSync(outDir, { recursive: true });

  console.log("\n=== 1) Preference prompt GIF ===");
  const { context, page } = await openFreshApp(browser, {
    clearPrefs: true,
    setPrefs: false,
  });

  let frame = 0;
  const shot = async () => {
    const path = join(framesDir, `frame-${String(frame).padStart(3, "0")}.png`);
    await page.screenshot({ path });
    frame += 1;
  };

  for (let i = 0; i < 4; i++) {
    await shot();
    await sleep(120);
  }

  const chip = page.locator(".suggestion-chip").first();
  await chip.waitFor({ state: "visible", timeout: 15000 });
  console.log("Sending starter:", (await chip.innerText()).trim());
  await chip.click();

  await page.locator(".pref-prompt").waitFor({ state: "visible", timeout: 15000 });
  console.log("Preference prompt visible");

  for (let i = 0; i < 6; i++) {
    await shot();
    await sleep(140);
  }

  // Pick Men → Technical → M → Continue, filming each step
  for (const label of ["Men", "Technical", "M"]) {
    const btn = page.getByRole("button", { name: label, exact: true });
    await btn.click();
    await shot();
    await sleep(220);
    await shot();
  }

  const continueBtn = page.getByRole("button", { name: /continue/i });
  await continueBtn.click();
  console.log("Continue clicked — capturing handoff");

  for (let i = 0; i < 18; i++) {
    await shot();
    await sleep(160);
  }

  await context.close();
  encodeGif(framesDir, outGif);
  rmSync(framesDir, { recursive: true, force: true });
  return outGif;
}

async function captureClarifyStill(browser) {
  const outPng = join(outDir, "hai-clarify.png");
  mkdirSync(outDir, { recursive: true });

  console.log("\n=== 2) Clarify screenshot ===");
  const { context, page } = await openFreshApp(browser, {
    clearPrefs: false,
    setPrefs: true,
  });

  const composer = page.getByRole("textbox", { name: "Message" });
  await composer.waitFor({ state: "visible", timeout: 15000 });
  // Vague ask with no place/activity → clarify path (not a packing match).
  await composer.fill("Going away soon");
  await composer.press("Enter");

  await page
    .getByText(/where are you traveling|love to help you pack/i)
    .waitFor({ state: "visible", timeout: 25000 });
  await sleep(500);

  await page.screenshot({ path: outPng });
  await context.close();
  console.log("Done:", outPng);
  return outPng;
}

async function captureOwnedGif(browser) {
  const framesDir = join(root, "scripts/tmp-hai-owned-frames");
  const outGif = join(outDir, "hai-owned.gif");
  cleanDir(framesDir);
  mkdirSync(outDir, { recursive: true });

  console.log("\n=== 3) Owned item GIF ===");
  const { context, page } = await openFreshApp(browser, {
    clearPrefs: false,
    setPrefs: true,
  });

  let frame = 0;
  const shot = async () => {
    const path = join(framesDir, `frame-${String(frame).padStart(3, "0")}.png`);
    await page.screenshot({ path });
    frame += 1;
  };

  const composer = page.getByRole("textbox", { name: "Message" });
  await composer.waitFor({ state: "visible", timeout: 15000 });
  const prompt = "packing to summit Mt.Fuji in September";
  console.log("Sending:", prompt);
  await composer.fill(prompt);
  await composer.press("Enter");

  // Wait for suggestion cards (can take a while with weather tools)
  await page
    .locator(".pack-suggestions")
    .waitFor({ state: "visible", timeout: 90000 });
  console.log("Suggestions visible");

  // Scroll suggestions into view and hold
  await page.locator(".pack-suggestions").scrollIntoViewIfNeeded();
  for (let i = 0; i < 8; i++) {
    await shot();
    await sleep(140);
  }

  const ownedBtn = page
    .locator('button[aria-label*="already owned"]')
    .first();
  await ownedBtn.waitFor({ state: "visible", timeout: 15000 });
  const label = await ownedBtn.getAttribute("aria-label");
  console.log("Marking owned:", label);
  await ownedBtn.click();

  // Capture list update + Already have section
  for (let i = 0; i < 10; i++) {
    await shot();
    await sleep(140);
  }

  const ownedToggle = page.locator(".pack-suggestions__owned-toggle");
  if (await ownedToggle.isVisible().catch(() => false)) {
    await ownedToggle.click();
    await sleep(200);
    for (let i = 0; i < 12; i++) {
      await shot();
      await sleep(150);
    }
  }

  await context.close();
  encodeGif(framesDir, outGif);
  rmSync(framesDir, { recursive: true, force: true });
  return outGif;
}

async function main() {
  if (!ffmpegPath || !existsSync(ffmpegPath)) {
    throw new Error("ffmpeg-static binary not found");
  }

  const browser = await chromium.launch({ headless: true });
  try {
    await capturePrefsGif(browser);
    await captureClarifyStill(browser);
    await captureOwnedGif(browser);
  } finally {
    await browser.close();
  }

  console.log("\nAll HAI media ready in", outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
