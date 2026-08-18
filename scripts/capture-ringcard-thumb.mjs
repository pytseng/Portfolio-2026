#!/usr/bin/env node
/**
 * Capture the square Side quests thumbnail for RingCard.
 * Usage: node scripts/capture-ringcard-thumb.mjs
 */
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outPng = join(root, "public/side-quests/ringcard.png");
const APP_URL = process.env.RINGCARD_URL || "https://muaythai-schedule.vercel.app";
const SIZE = 1024;

async function main() {
  mkdirSync(dirname(outPng), { recursive: true });

  console.log(`Opening ${APP_URL}`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: SIZE, height: SIZE },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  await page.goto(APP_URL, { waitUntil: "networkidle", timeout: 60000 });
  await sleep(5000);

  await page.screenshot({ path: outPng });
  await browser.close();

  if (!existsSync(outPng)) throw new Error("Screenshot missing");
  console.log(`Done: ${outPng}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
