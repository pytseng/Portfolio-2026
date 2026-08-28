#!/usr/bin/env node
/**
 * Capture SecretStash commerce / payment-flow media.
 * 1) Eight full-phone stills (search → stash)
 * 2) MP4 of adding 3 products and checking out
 *
 * Usage: node scripts/capture-pay-flow.mjs
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  copyFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "playwright";
import ffmpegPath from "ffmpeg-static";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/secret-stash");
const framesDir = join(root, "scripts/tmp-pay-flow-frames");
const APP_URL = process.env.SECRETSTASH_URL || "https://chat-ai-ux.vercel.app";
const PROMPT = "packing for a 20-day Patagonia trek";

const PREFS = {
  gender: "men",
  style: "technical",
  size: "m",
};

const STILLS = [
  "pay-01-search.png",
  "pay-02-expand.png",
  "pay-03-add.png",
  "pay-04-cart.png",
  "pay-05-checkout.png",
  "pay-06-fill.png",
  "pay-07-complete.png",
  "pay-08-stash.png",
];

function cleanDir(dir) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

async function openFreshApp(browser, { recordVideoDir } = {}) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    recordVideo: recordVideoDir
      ? { dir: recordVideoDir, size: { width: 390, height: 844 } }
      : undefined,
  });
  const page = await context.newPage();

  await page.addInitScript((prefs) => {
    for (const key of [
      "secretstash-user-preferences",
      "secretstash-chat-history",
      "secretstash-active-chat-id",
      "secretstash-saved-products",
      "secretstash-list-inventory-v4",
      "secretstash-shipping-address",
    ]) {
      localStorage.removeItem(key);
    }
    localStorage.setItem(
      "secretstash-user-preferences",
      JSON.stringify(prefs),
    );
  }, PREFS);

  await page.goto(APP_URL, { waitUntil: "networkidle", timeout: 60000 });
  await sleep(400);
  return { context, page };
}

async function sendAdventure(page) {
  const composer = page.getByRole("textbox", { name: "Message" });
  await composer.waitFor({ state: "visible", timeout: 15000 });
  console.log("Sending:", PROMPT);
  await composer.fill(PROMPT);
  await composer.press("Enter");

  await page
    .locator(".pack-suggestions")
    .waitFor({ state: "visible", timeout: 120000 });
  console.log("Suggestions visible");
  await page.locator(".pack-suggestions").scrollIntoViewIfNeeded();
  await sleep(600);
}

async function waitForIdleComposer(page) {
  await page
    .getByRole("button", { name: "Send message" })
    .waitFor({ state: "visible", timeout: 120000 });
}

async function expandItem(page, index = 0) {
  const item = page.locator(".pack-suggestions__item").nth(index);
  await item.scrollIntoViewIfNeeded();
  const main = item.locator(".pack-suggestions__main");
  if ((await main.getAttribute("aria-expanded")) !== "true") {
    await main.click();
  }
  await item
    .locator(".pack-suggestions__detail--open")
    .waitFor({ state: "visible", timeout: 8000 });

  const loading = item.getByText("Searching products…");
  await loading.waitFor({ state: "visible", timeout: 4000 }).catch(() => {});
  await loading.waitFor({ state: "hidden", timeout: 90000 }).catch(() => {});

  const retry = item.locator(".pack-suggestions__retry");
  if (await retry.isVisible().catch(() => false)) {
    console.log("Product search retry…");
    await retry.click();
    await loading.waitFor({ state: "visible", timeout: 4000 }).catch(() => {});
    await loading.waitFor({ state: "hidden", timeout: 90000 }).catch(() => {});
  }

  await item.locator(".pack-suggestions__product").first().waitFor({
    state: "visible",
    timeout: 20000,
  });
  await page
    .waitForFunction(
      (i) => {
        const row = document.querySelectorAll(".pack-suggestions__item")[i];
        const img = row?.querySelector(".pack-suggestions__product img");
        return Boolean(img && img.complete && img.naturalWidth > 20);
      },
      index,
      { timeout: 12000 },
    )
    .catch(() => {});
  await sleep(700);
}

async function addFirstProductInItem(page, index = 0) {
  const item = page.locator(".pack-suggestions__item").nth(index);
  await item.scrollIntoViewIfNeeded();
  const save = item.locator(".pack-suggestions__save").first();
  await save.waitFor({ state: "visible", timeout: 10000 });
  await save.click();
  await sleep(350);
}

async function fillCard(page) {
  const toggle = page.locator(".checkout__card-toggle");
  await toggle.waitFor({ state: "visible", timeout: 10000 });
  if ((await toggle.getAttribute("aria-expanded")) !== "true") {
    await toggle.click();
    await sleep(250);
  }
  await page.locator('input[autocomplete="cc-number"]').fill("4242424242424242");
  await page.locator('input[autocomplete="cc-exp"]').fill("1228");
  await page.locator('input[autocomplete="cc-csc"]').fill("123");
  await page.locator('input[autocomplete="cc-name"]').fill("Alex Rivera");
  await sleep(250);
}

async function captureStills(browser) {
  mkdirSync(outDir, { recursive: true });
  const { context, page } = await openFreshApp(browser);

  const shot = async (name) => {
    const path = join(outDir, name);
    await page.screenshot({ path, type: "png" });
    console.log("Still:", name);
  };

  await sendAdventure(page);
  await waitForIdleComposer(page);
  await page.locator(".pack-suggestions").scrollIntoViewIfNeeded();
  await sleep(400);
  await shot(STILLS[0]);

  await expandItem(page, 0);
  await shot(STILLS[1]);

  await addFirstProductInItem(page, 0);
  await shot(STILLS[2]);

  await page.getByRole("button", { name: /open cart/i }).click();
  await page.locator(".stash-panel__sheet").waitFor({ state: "visible" });
  await sleep(400);
  await shot(STILLS[3]);

  await page.getByRole("button", { name: "Checkout", exact: true }).click();
  await page.locator(".checkout").waitFor({ state: "visible" });
  await sleep(400);
  await shot(STILLS[4]);

  await fillCard(page);
  await page.locator(".stash-panel__title").click();
  await sleep(200);
  await shot(STILLS[5]);

  await page.locator(".checkout__pay").click();
  await page
    .getByText("Payment received")
    .waitFor({ state: "visible", timeout: 10000 });
  await sleep(500);
  await shot(STILLS[6]);

  await page.getByRole("button", { name: "Done", exact: true }).click();
  await sleep(500);
  await page.getByRole("button", { name: "Open stash" }).click();
  await page.getByRole("dialog", { name: "Stash" }).waitFor({ state: "visible" });
  await sleep(700);
  await shot(STILLS[7]);

  await context.close();
}

async function captureVideo(browser) {
  if (!ffmpegPath || !existsSync(ffmpegPath)) {
    throw new Error("ffmpeg-static binary not found");
  }
  cleanDir(framesDir);
  mkdirSync(outDir, { recursive: true });

  const { context, page } = await openFreshApp(browser);
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

  await sendAdventure(page);
  await waitForIdleComposer(page);

  await expandItem(page, 0);
  const firstItem = page.locator(".pack-suggestions__item").first();
  await firstItem.scrollIntoViewIfNeeded();
  await sleep(400);

  console.log("Recording pay flow…");
  await hold(700);

  const saves = firstItem.locator(".pack-suggestions__save");
  const addCount = Math.min(3, await saves.count());
  for (let i = 0; i < addCount; i++) {
    await saves.nth(i).click();
    await hold(520);
  }

  await hold(400);
  await page.getByRole("button", { name: /open cart/i }).click();
  await page.locator(".stash-panel__sheet").waitFor({ state: "visible" });
  await hold(1100);

  await page.getByRole("button", { name: "Checkout", exact: true }).click();
  await page.locator(".checkout").waitFor({ state: "visible" });
  await hold(800);

  await fillCard(page);
  await hold(900);

  await page.locator(".checkout__pay").click();
  await page
    .getByText("Payment received")
    .waitFor({ state: "visible", timeout: 10000 });
  await hold(1400);

  await page.getByRole("button", { name: "Done", exact: true }).click();
  await hold(500);
  await page.getByRole("button", { name: "Open stash" }).click();
  await page.getByRole("dialog", { name: "Stash" }).waitFor({ state: "visible" });
  await hold(1600);

  await context.close();

  const frames = readdirSync(framesDir).filter((f) => f.endsWith(".png")).sort();
  if (frames.length < 8) {
    throw new Error(`Too few video frames (${frames.length})`);
  }

  const mp4 = join(outDir, "pay-flow.mp4");
  const poster = join(outDir, "pay-flow-poster.png");
  copyFileSync(join(framesDir, frames[Math.min(12, frames.length - 1)]), poster);

  console.log(`Encoding ${frames.length} frames → ${mp4}`);
  const result = spawnSync(
    ffmpegPath,
    [
      "-y",
      "-framerate",
      "8",
      "-i",
      join(framesDir, "frame-%04d.png"),
      "-vf",
      "scale=390:844:flags=lanczos",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-an",
      mp4,
    ],
    { stdio: "inherit" },
  );
  if (result.status !== 0) throw new Error("ffmpeg failed for pay-flow.mp4");
  rmSync(framesDir, { recursive: true, force: true });
  console.log("Video:", mp4);
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    channel: "chrome",
  });
  try {
    console.log("\n=== Payment stills ===");
    await captureStills(browser);
    console.log("\n=== Payment video ===");
    await captureVideo(browser);
  } finally {
    await browser.close();
  }
  console.log("\nPay-flow media ready in", outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
