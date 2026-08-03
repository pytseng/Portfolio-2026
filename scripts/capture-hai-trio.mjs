#!/usr/bin/env node
/**
 * Capture Human–AI trio media at matching crop size (interaction only).
 * Outputs: hai-prefs.gif, hai-clarify.png, hai-owned.gif
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
const APP_URL = process.env.SECRETSTASH_URL || "http://localhost:5174";
const PREFS = { gender: "men", style: "technical", size: "m" };

// Shared crop: phone content band (no status chrome), same zoom for all three.
const CLIP = { x: 16, y: 56, width: 358, height: 480 };

function cleanDir(dir) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

function encodeGif(framesDir, outGif) {
  const frames = readdirSync(framesDir).filter((f) => f.endsWith(".png")).sort();
  if (frames.length < 6) throw new Error(`Too few frames (${frames.length})`);
  console.log(`Encoding ${frames.length} → ${outGif}`);
  const r = spawnSync(
    ffmpegPath,
    [
      "-y",
      "-framerate",
      "8",
      "-i",
      join(framesDir, "frame-%03d.png"),
      "-vf",
      `fps=8,scale=${CLIP.width}:${CLIP.height}:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer`,
      "-loop",
      "0",
      outGif,
    ],
    { stdio: "inherit" },
  );
  if (r.status !== 0) throw new Error("ffmpeg failed");
}

async function openApp(browser, { setPrefs }) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.addInitScript(
    ({ setPrefs, prefs }) => {
      for (const k of [
        "secretstash-user-preferences",
        "secretstash-chat-history",
        "secretstash-active-chat-id",
        "secretstash-saved-products",
      ]) {
        localStorage.removeItem(k);
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
  await sleep(400);
  return { context, page };
}

async function capturePrefs(browser) {
  const framesDir = join(root, "scripts/tmp-hai-prefs");
  const outGif = join(outDir, "hai-prefs.gif");
  cleanDir(framesDir);
  mkdirSync(outDir, { recursive: true });

  console.log("\n=== Profile baseline GIF ===");
  const { context, page } = await openApp(browser, { setPrefs: false });
  let frame = 0;
  const shot = async () => {
    await page.screenshot({
      path: join(framesDir, `frame-${String(frame).padStart(3, "0")}.png`),
      clip: CLIP,
    });
    frame += 1;
  };

  for (let i = 0; i < 3; i++) {
    await shot();
    await sleep(120);
  }

  const chip = page.locator(".suggestion-chip").first();
  await chip.waitFor({ state: "visible", timeout: 15000 });
  console.log("chip:", (await chip.innerText()).trim());
  await chip.click();

  await page.locator(".pref-prompt").waitFor({ state: "visible", timeout: 15000 });
  for (let i = 0; i < 5; i++) {
    await shot();
    await sleep(140);
  }

  for (const label of ["Men", "Technical", "M"]) {
    await page.getByRole("button", { name: label, exact: true }).click();
    await shot();
    await sleep(200);
    await shot();
  }

  await page.getByRole("button", { name: /continue/i }).click();
  console.log("Continue — waiting for real answer (API healthy)");

  // Confirm credits work: reasoning or assistant prose appears
  await Promise.race([
    page.locator(".reasoning-pills").waitFor({ state: "visible", timeout: 45000 }),
    page.locator(".message--assistant, .message-prose").waitFor({
      state: "visible",
      timeout: 45000,
    }),
  ]);

  for (let i = 0; i < 16; i++) {
    await shot();
    await sleep(160);
  }

  const body = await page.locator(".messages").innerText();
  if (/credit balance|invalid_request_error|too low/i.test(body)) {
    throw new Error("API still out of credits — aborting prefs capture");
  }

  await context.close();
  encodeGif(framesDir, outGif);
  rmSync(framesDir, { recursive: true, force: true });
  return outGif;
}

async function captureClarify(browser) {
  const outPng = join(outDir, "hai-clarify.png");
  console.log("\n=== Clarify still ===");
  const { context, page } = await openApp(browser, { setPrefs: true });
  const composer = page.getByRole("textbox", { name: "Message" });
  await composer.fill("Going away soon");
  await composer.press("Enter");
  await page
    .getByText(/where are you traveling|love to help you pack/i)
    .waitFor({ state: "visible", timeout: 20000 });
  await sleep(400);
  await page.screenshot({ path: outPng, clip: CLIP });
  await context.close();
  console.log("Done", outPng);
  return outPng;
}

async function captureOwned(browser) {
  const framesDir = join(root, "scripts/tmp-hai-owned");
  const outGif = join(outDir, "hai-owned.gif");
  cleanDir(framesDir);
  console.log("\n=== Owned GIF ===");
  const { context, page } = await openApp(browser, { setPrefs: true });
  let frame = 0;
  const shot = async () => {
    await page.screenshot({
      path: join(framesDir, `frame-${String(frame).padStart(3, "0")}.png`),
      clip: CLIP,
    });
    frame += 1;
  };

  const composer = page.getByRole("textbox", { name: "Message" });
  await composer.fill("packing to summit Mt.Fuji in September");
  await composer.press("Enter");
  await page.locator(".pack-suggestions").waitFor({ state: "visible", timeout: 120000 });
  await page.locator(".pack-suggestions").scrollIntoViewIfNeeded();
  // After scroll, keep same clip for consistent zoom (content may shift into band)
  for (let i = 0; i < 8; i++) {
    await shot();
    await sleep(140);
  }

  const ownedBtn = page.locator('button[aria-label*="already owned"]').first();
  await ownedBtn.click();
  for (let i = 0; i < 8; i++) {
    await shot();
    await sleep(140);
  }

  const toggle = page.locator(".pack-suggestions__owned-toggle");
  if (await toggle.isVisible().catch(() => false)) {
    await toggle.click();
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
    throw new Error("ffmpeg-static missing");
  }
  const browser = await chromium.launch({ headless: true });
  try {
    await capturePrefs(browser);
    await captureClarify(browser);
    await captureOwned(browser);
  } finally {
    await browser.close();
  }
  console.log("\nTrio ready");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
