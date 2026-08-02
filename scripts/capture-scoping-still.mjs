#!/usr/bin/env node
/**
 * Capture a cropped still of the SecretStash scoping redirect.
 * Usage: node scripts/capture-scoping-still.mjs
 */
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outPng = join(root, "public/secret-stash/scoping.png");
const APP_URL = process.env.SECRETSTASH_URL || "https://chat-ai-ux.vercel.app";
const PROMPT = "what's the result of Fifa 2026";

const PREFS = {
  gender: "men",
  style: "technical",
  size: "m",
};

async function main() {
  mkdirSync(dirname(outPng), { recursive: true });

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

  const continueBtn = page.getByRole("button", { name: /continue/i });
  if (await continueBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
    for (const label of ["Men", "Technical", "M"]) {
      const chip = page.getByRole("button", { name: label, exact: true });
      if (await chip.isVisible().catch(() => false)) await chip.click();
    }
    await continueBtn.click();
    await sleep(400);
  }

  const composer = page.getByRole("textbox", { name: "Message" });
  await composer.waitFor({ state: "visible", timeout: 15000 });
  await composer.fill(PROMPT);
  await composer.press("Enter");

  await page
    .getByText(/help you pack/i)
    .waitFor({ state: "visible", timeout: 20000 });
  await sleep(400);

  const userMsg = page.locator(".message--user").last();
  const assistantMsg = page.locator(".message--assistant").last();
  await userMsg.waitFor({ state: "visible", timeout: 5000 });
  await assistantMsg.waitFor({ state: "visible", timeout: 5000 });

  const userBox = await userMsg.boundingBox();
  const asstBox = await assistantMsg.boundingBox();
  if (!userBox || !asstBox) throw new Error("Could not measure messages");

  const padX = 18;
  const padY = 14;
  const left = Math.max(0, Math.min(userBox.x, asstBox.x) - padX);
  const top = Math.max(0, Math.min(userBox.y, asstBox.y) - padY);
  const right = Math.min(
    390,
    Math.max(userBox.x + userBox.width, asstBox.x + asstBox.width) + padX,
  );
  const bottom = Math.min(
    844,
    Math.max(userBox.y + userBox.height, asstBox.y + asstBox.height) + padY,
  );

  const clip = {
    x: left,
    y: top,
    width: Math.max(160, right - left),
    height: Math.max(120, bottom - top),
  };

  console.log("Clip", clip);
  await page.screenshot({ path: outPng, clip });
  await browser.close();

  if (!existsSync(outPng)) throw new Error("Screenshot missing");
  console.log(`Done: ${outPng}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
