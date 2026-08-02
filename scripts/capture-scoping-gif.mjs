#!/usr/bin/env node
/**
 * Capture SecretStash multi-turn scoping conversation → GIF (messages area).
 * Usage: node scripts/capture-scoping-gif.mjs
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
const framesDir = join(root, "scripts/tmp-scoping-frames");
const outGif = join(root, "public/secret-stash/scoping.gif");
const APP_URL = process.env.SECRETSTASH_URL || "https://chat-ai-ux.vercel.app";

const PROMPTS = [
  "What's the fifa result",
  "can you talk about other topics",
  "what is the latest outfit trend in tokyo",
  "packing to summit Mt.Fuji in September",
];

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

  let frame = 0;

  const shot = async () => {
    const path = join(framesDir, `frame-${String(frame).padStart(3, "0")}.png`);
    await page.screenshot({ path });
    frame += 1;
  };

  // Settle on empty state briefly
  for (let i = 0; i < 4; i++) {
    await shot();
    await sleep(120);
  }

  for (let p = 0; p < PROMPTS.length; p++) {
    const prompt = PROMPTS[p];
    console.log(`Turn ${p + 1}: ${prompt}`);

    await composer.click();
    await composer.fill("");
    // Type a bit so the ask is readable in the GIF
    for (const ch of prompt) {
      await composer.pressSequentially(ch, { delay: 0 });
      if (frame % 2 === 0) {
        await shot();
        await sleep(30);
      }
    }
    await shot();
    await sleep(200);
    await shot();

    const userCountBefore = await page.locator(".message--user").count();
    await composer.press("Enter");

    // Wait for this turn's user bubble, then for assistant text / idle
    await page
      .locator(".message--user")
      .nth(userCountBefore)
      .waitFor({ state: "visible", timeout: 15000 });

    // Capture while generating
    const deadline = Date.now() + (p === PROMPTS.length - 1 ? 22000 : 10000);
    let sawAssistantGrow = false;
    let stable = 0;
    let lastText = "";

    while (Date.now() < deadline) {
      await shot();
      await sleep(160);

      const generating = await page
        .getByRole("button", { name: /stop generating/i })
        .isVisible()
        .catch(() => false);
      const assistantText = (
        await page.locator(".message--assistant").last().innerText().catch(() => "")
      ).trim();

      if (assistantText && assistantText !== lastText) {
        sawAssistantGrow = true;
        lastText = assistantText;
        stable = 0;
      } else if (sawAssistantGrow && !generating) {
        stable += 1;
        if (stable >= 8) break;
      } else if (!generating && sawAssistantGrow && Date.now() > deadline - 2000) {
        break;
      }
    }

    // Hold a beat on the settled turn
    for (let i = 0; i < 6; i++) {
      await shot();
      await sleep(140);
    }
  }

  await browser.close();

  const frames = readdirSync(framesDir)
    .filter((f) => f.endsWith(".png"))
    .sort();
  if (frames.length < 12) {
    throw new Error(`Too few frames captured (${frames.length})`);
  }

  console.log(`Encoding ${frames.length} frames → ${outGif}`);
  const result = spawnSync(
    ffmpegPath,
    [
      "-y",
      "-framerate",
      "8",
      "-i",
      join(framesDir, "frame-%03d.png"),
      "-vf",
      "fps=8,scale=390:844:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer",
      "-loop",
      "0",
      outGif,
    ],
    { stdio: "inherit" },
  );

  if (result.status !== 0) {
    throw new Error("ffmpeg failed");
  }

  console.log(`Done: ${outGif} (${frames.length} frames)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
