#!/usr/bin/env node
/**
 * Capture SecretStash panel media:
 * 1) Browse: open stash (demo kit loaded), card/list toggle, rename, filter
 * 2) Pack: open pack mode, add and remove a few items
 *
 * Usage: node scripts/capture-stash-panel.mjs
 */
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
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

const PREFS = { gender: "men", style: "technical", size: "m" };

const DEMO_ITEMS = [
  { id: "demo-nano-puff", name: "Nano Puff insulated jacket", category: "top", imageKey: "secret-stash/demo/demo-nano-puff.jpg" },
  { id: "demo-rain-shell", name: "Rain shell", category: "top", imageKey: "secret-stash/demo/demo-rain-shell.jpg" },
  { id: "demo-hiking-pants", name: "Softshell hiking pants", category: "bottom", imageKey: "secret-stash/demo/demo-hiking-pants.jpg" },
  { id: "demo-trail-shorts", name: "Trail running shorts", category: "bottom", imageKey: "secret-stash/demo/demo-trail-shorts.jpg" },
  { id: "demo-trail-shoes", name: "Trail running shoes", category: "footwear", imageKey: "secret-stash/demo/demo-trail-shoes.jpg" },
  { id: "demo-camp-sandals", name: "Camp sandals", category: "footwear", imageKey: "secret-stash/demo/demo-camp-sandals.jpg" },
  { id: "demo-merino-base", name: "Merino base layer", category: "innerwear", imageKey: "secret-stash/demo/demo-merino-base.jpg" },
  { id: "demo-merino-socks", name: "Merino hiking socks", category: "innerwear", imageKey: "secret-stash/demo/demo-merino-socks.jpg" },
  { id: "demo-sun-cap", name: "Sun cap", category: "accessories", imageKey: "secret-stash/demo/demo-sun-cap.jpg" },
  { id: "demo-light-gloves", name: "Lightweight gloves", category: "accessories", imageKey: "secret-stash/demo/demo-light-gloves.jpg" },
  { id: "demo-daypack", name: "22L daypack", category: "gear", imageKey: "secret-stash/demo/demo-daypack.jpg" },
  { id: "demo-headlamp", name: "Rechargeable headlamp", category: "gear", imageKey: "secret-stash/demo/demo-headlamp.jpg" },
  { id: "demo-water-filter", name: "Squeeze water filter", category: "gear", imageKey: "secret-stash/demo/demo-water-filter.jpg" },
  { id: "demo-power-bank", name: "Power bank", category: "other", imageKey: "secret-stash/demo/demo-power-bank.jpg" },
];

function cleanDir(dir) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

async function openSeededApp(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.addInitScript(
    ({ prefs, items }) => {
      for (const key of [
        "secretstash-user-preferences",
        "secretstash-chat-history",
        "secretstash-active-chat-id",
        "secretstash-saved-products",
        "secretstash-list-inventory-v4",
        "secretstash-game-loadout",
      ]) {
        localStorage.removeItem(key);
      }
      localStorage.setItem(
        "secretstash-user-preferences",
        JSON.stringify(prefs),
      );
      localStorage.setItem(
        "secretstash-list-inventory-v4",
        JSON.stringify(items),
      );
    },
    { prefs: PREFS, items: DEMO_ITEMS },
  );
  await page.goto(APP_URL, { waitUntil: "networkidle", timeout: 60000 });
  await sleep(500);
  return { context, page };
}

async function openStash(page) {
  await page.getByRole("button", { name: "Open stash" }).click();
  await page.getByRole("dialog", { name: "Stash" }).waitFor({ state: "visible" });
  await page.locator(".stash__items").waitFor({ state: "visible", timeout: 10000 });
  await page
    .waitForFunction(
      () => {
        const imgs = [...document.querySelectorAll(".stash__items img")];
        return (
          imgs.length >= 3 &&
          imgs.slice(0, 4).every((img) => img.complete && img.naturalWidth > 0)
        );
      },
      { timeout: 12000 },
    )
    .catch(() => {});
  await sleep(400);
}

function makeRecorder(page, framesDir) {
  let frame = 0;
  const shot = async () => {
    const path = join(framesDir, `frame-${String(frame).padStart(4, "0")}.png`);
    await page.screenshot({ path, type: "png" });
    frame += 1;
  };
  const hold = async (ms, fps = 8) => {
    const n = Math.max(1, Math.round((ms / 1000) * fps));
    for (let i = 0; i < n; i++) {
      await shot();
      await sleep(1000 / fps);
    }
  };
  return { shot, hold, framesDir };
}

function encodeMp4(framesDir, outMp4, posterPng, posterAt = 8) {
  const frames = readdirSync(framesDir)
    .filter((f) => f.endsWith(".png"))
    .sort();
  if (frames.length < 8) {
    throw new Error(`Too few frames in ${framesDir} (${frames.length})`);
  }
  const posterIdx = Math.min(
    Math.max(0, posterAt),
    frames.length - 1,
  );
  copyFileSync(join(framesDir, frames[posterIdx]), posterPng);
  console.log(`Encoding ${frames.length} frames → ${outMp4}`);
  const result = spawnSync(
    ffmpegPath,
    [
      "-y",
      "-framerate",
      "8",
      "-i",
      join(framesDir, "frame-%04d.png"),
      "-vf",
      "scale=390:844:flags=lanczos,setpts=1.6*PTS",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-an",
      outMp4,
    ],
    { stdio: "inherit" },
  );
  if (result.status !== 0) throw new Error(`ffmpeg failed for ${outMp4}`);
  rmSync(framesDir, { recursive: true, force: true });
}

async function captureBrowse(browser) {
  const framesDir = join(root, "scripts/tmp-stash-browse-frames");
  cleanDir(framesDir);
  mkdirSync(outDir, { recursive: true });
  const { context, page } = await openSeededApp(browser);
  const { hold } = makeRecorder(page, framesDir);

  console.log("Browse: empty chat");
  await hold(600);
  await openStash(page);
  await hold(1100);

  console.log("Toggle card view");
  await page.getByRole("button", { name: "Switch to card view" }).click();
  await sleep(250);
  await hold(1000);

  console.log("Toggle list view");
  await page.getByRole("button", { name: "Switch to list view" }).click();
  await sleep(250);
  await hold(800);

  console.log("Rename first item");
  const edit = page.getByRole("button", { name: /^Edit / }).first();
  await edit.click();
  await hold(500);
  const rename = page.getByRole("textbox", { name: /^Rename / });
  await rename.waitFor({ state: "visible" });
  await rename.fill("Nano Puff");
  await hold(800);
  await rename.press("Enter");
  await page.getByText("Nano Puff", { exact: true }).waitFor({ state: "visible" });
  await hold(900);

  console.log("Filter Footwear");
  await page.getByRole("button", { name: "Filters" }).click();
  const filters = page.getByRole("dialog", { name: "Filters" });
  await filters.waitFor({ state: "visible" });
  await hold(500);
  await filters.getByRole("button", { name: "Footwear", exact: true }).click();
  await page.getByText("Rain shell").waitFor({ state: "hidden", timeout: 5000 });
  await hold(700);
  await page.keyboard.press("Escape");
  await filters.waitFor({ state: "hidden" });
  await hold(2200);

  await context.close();
  encodeMp4(
    framesDir,
    join(outDir, "stash-browse.mp4"),
    join(outDir, "stash-browse-poster.png"),
  );
}

async function capturePack(browser) {
  const framesDir = join(root, "scripts/tmp-stash-pack-frames");
  cleanDir(framesDir);
  mkdirSync(outDir, { recursive: true });
  const { context, page } = await openSeededApp(browser);
  const { hold } = makeRecorder(page, framesDir);

  await openStash(page);
  await hold(700);

  console.log("Open pack mode");
  await page.getByRole("button", { name: "Show pack" }).click();
  await page.locator(".pack-board").waitFor({ state: "visible" });
  await hold(900);

  for (let i = 0; i < 4; i++) {
    const btn = page.locator('button[aria-label^="Pack "]').first();
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await hold(520);
  }
  await hold(800);

  console.log("Unpack a couple");
  const unpackBtns = page.locator('button[aria-label^="Unpack "]');
  const unpackCount = Math.min(2, await unpackBtns.count());
  for (let i = 0; i < unpackCount; i++) {
    await unpackBtns.first().click();
    await hold(600);
  }
  await hold(1200);

  await context.close();
  encodeMp4(
    framesDir,
    join(outDir, "stash-pack.mp4"),
    join(outDir, "stash-pack-poster.png"),
    Math.floor((readdirSync(framesDir).filter((f) => f.endsWith(".png")).length) * 0.55),
  );
}

async function main() {
  if (!ffmpegPath || !existsSync(ffmpegPath)) {
    throw new Error("ffmpeg-static binary not found");
  }
  mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    channel: "chrome",
  });
  const browseOnly = process.argv.includes("--browse-only");
  const packOnly = process.argv.includes("--pack-only");
  try {
    if (!packOnly) {
      console.log("\n=== Stash browse ===");
      await captureBrowse(browser);
    }
    if (!browseOnly) {
      console.log("\n=== Stash pack ===");
      await capturePack(browser);
    }
  } finally {
    await browser.close();
  }
  console.log("\nStash panel media ready in", outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
