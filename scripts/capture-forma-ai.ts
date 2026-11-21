/**
 * Capture Forma AI stills and clips from the live demo.
 *
 *   node --experimental-strip-types scripts/capture-forma-ai.ts
 *
 * Writes scripts/captures/forma-ai/. Re-runnable. Each run resets the demo first.
 */
import { spawnSync } from 'node:child_process'
import { mkdir, rename, rm, stat } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright'

const require = createRequire(import.meta.url)
const ffmpeg = require('ffmpeg-static') as string

const DEMO = 'https://forma-cloud-rework.vercel.app/'
const OUT = path.resolve('scripts/captures/forma-ai')
const RULE =
  'When a new version of the 2026 collection arrives, publish to staging and Shopify, and ask Sofia before Salesforce.'
const FIFA = 'What was the FIFA World Cup score last night?'
const QUESTION = 'Which storefronts are behind the current version?'
const TYPE_DELAY = 50

type Crop = { x: number; y: number; width: number; height: number }

const missing: string[] = []
const made: string[] = []

function even(n: number) {
  return n - (n % 2)
}

function run(args: string[]) {
  const result = spawnSync(ffmpeg, args, { encoding: 'utf8' })
  if (result.status !== 0) {
    throw new Error(result.stderr || `ffmpeg exited ${result.status}`)
  }
  return result.stderr ?? ''
}

function durationOf(file: string) {
  const result = spawnSync(ffmpeg, ['-i', file], { encoding: 'utf8' })
  const match = /Duration:\s*(\d+):(\d+):(\d+\.\d+)/.exec(result.stderr ?? '')
  if (!match) return 0
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3])
}

async function encode(options: {
  webm: string
  out: string
  start: number
  end: number
  crop?: Crop
}) {
  let start = Math.max(0, options.start - 0.12)
  const end = options.end + 0.45
  if (end - start > 7.9) start = Math.max(0, end - 7.9)
  const vf = options.crop
    ? `crop=${options.crop.width}:${options.crop.height}:${options.crop.x}:${options.crop.y}`
    : undefined
  const args = ['-y', '-i', options.webm, '-ss', start.toFixed(3), '-to', end.toFixed(3), '-an']
  if (vf) args.push('-vf', vf)
  args.push(
    '-c:v',
    'libx264',
    '-crf',
    '23',
    '-preset',
    'veryfast',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    options.out,
  )
  run(args)
  const duration = durationOf(options.out)
  if (duration <= 0 || duration > 8.05) {
    throw new Error(`${path.basename(options.out)} is ${duration.toFixed(2)}s`)
  }
  made.push(`${path.basename(options.out)} ${duration.toFixed(2)}s`)
}

async function poster(mp4: string, png: string, at: number) {
  run(['-y', '-ss', Math.max(0, at).toFixed(3), '-i', mp4, '-frames:v', '1', png])
  made.push(path.basename(png))
}

async function optimizePng(file: string) {
  const tmp = `${file}.opt.png`
  run(['-y', '-i', file, '-compression_level', '100', tmp])
  const [before, after] = await Promise.all([stat(file), stat(tmp)])
  if (after.size < before.size) await rename(tmp, file)
  else await rm(tmp, { force: true })
}

async function reset(page: Page) {
  await page.goto(DEMO, { waitUntil: 'networkidle' })
  const opener = page.getByRole('button', { name: 'Reset demo' })
  const dialog = page.getByRole('heading', { name: 'Reset the demo?', exact: true })
  await opener.waitFor()
  for (let attempt = 0; attempt < 3; attempt++) {
    await opener.click()
    try {
      await dialog.waitFor({ timeout: 2500 })
      break
    } catch (error) {
      if (attempt === 2) throw error
    }
  }
  await page.getByRole('button', { name: 'Reset demo' }).last().click()
  await dialog.waitFor({ state: 'hidden' })
  await page.getByText('DOGMA XM').first().waitFor()
}

async function openAi(page: Page) {
  await page.getByRole('button', { name: 'Forma AI' }).click()
  await page.getByRole('button', { name: /Automate publishing/ }).waitFor()
}

async function panelCrop(page: Page): Promise<Crop> {
  const box = await page.locator('aside[aria-label="Forma AI"]').boundingBox()
  if (!box) throw new Error('Forma AI panel has no box')
  const pad = 24
  let x = Math.max(0, Math.floor(box.x - pad))
  let y = Math.max(0, Math.floor(box.y - pad))
  x = even(x)
  y = even(y)
  let width = Math.min(1280 - x, Math.ceil(box.width + pad * 2))
  let height = Math.min(800 - y, Math.ceil(box.height + pad * 2))
  width = even(width)
  height = even(height)
  if (width < 2 || height < 2) throw new Error('panel crop collapsed')
  return { x, y, width, height }
}

async function typeAndSend(page: Page, placeholder: string | RegExp, text: string) {
  const box = page.getByPlaceholder(placeholder)
  await box.click()
  await page.keyboard.type(text, { delay: TYPE_DELAY })
  await page.keyboard.press('Enter')
}

async function draftRule(page: Page, typed: boolean) {
  await page.getByRole('button', { name: /Automate publishing/ }).click()
  await page.getByPlaceholder('Describe it in one sentence').waitFor()
  if (typed) {
    await typeAndSend(page, 'Describe it in one sentence', RULE)
  } else {
    const box = page.getByPlaceholder('Describe it in one sentence')
    await box.click()
    await box.fill(RULE)
    await page.keyboard.press('Enter')
  }
  await page.getByRole('button', { name: 'Publish now', exact: true }).first().waitFor()
}

async function reachTest(page: Page) {
  await draftRule(page, false)
  await page.getByRole('button', { name: 'Maya', exact: true }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).waitFor()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('button', { name: 'Test', exact: true }).waitFor()
}

async function saveAgent(page: Page) {
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await page.getByPlaceholder('Name this agent').waitFor()
  const name = page.getByPlaceholder('Name this agent')
  await name.click()
  await name.fill('Publish the 2026 collection')
  await page.keyboard.press('Enter')
  await page.getByRole('button', { name: 'Run it', exact: true }).click()
  await page.getByRole('button', { name: 'Agents' }).click()
  await page.getByRole('button', { name: 'Pause', exact: true }).waitFor()
  await page.getByRole('button', { name: 'Delete', exact: true }).waitFor()
}

async function shot(page: Page, file: string, crop?: Crop) {
  await page.screenshot({
    path: path.join(OUT, file),
    clip: crop,
    animations: 'disabled',
  })
  await optimizePng(path.join(OUT, file))
  made.push(file)
}

async function clip(
  browser: Browser,
  file: string,
  crop: Crop | undefined,
  action: (page: Page, mark: () => number) => Promise<{ start: number; end: number }>,
) {
  const context: BrowserContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: { dir: OUT, size: { width: 1280, height: 800 } },
  })
  const page = await context.newPage()
  const t0 = Date.now()
  const mark = () => (Date.now() - t0) / 1000
  const video = page.video()
  try {
    const range = await action(page, mark)
    await page.close()
    const webm = await video?.path()
    await context.close()
    if (!webm) throw new Error('no video')
    const out = path.join(OUT, file)
    await encode({ webm, out, start: range.start, end: range.end, crop })
    await poster(out, out.replace(/\.mp4$/, '-poster.png'), Math.max(0, durationOf(out) - 0.35))
    await rm(webm, { force: true })
  } catch (error) {
    await page.close().catch(() => {})
    await context.close().catch(() => {})
    throw error
  }
}

async function main() {
  if (!ffmpeg) throw new Error('ffmpeg-static did not resolve')
  await mkdir(OUT, { recursive: true })
  const only = process.argv[2]
  const browser = await chromium.launch({ headless: true })
  const stills = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  })
  const page = await stills.newPage()
  page.setDefaultTimeout(20000)

  let crop: Crop | null = null
  if (!only) try {
    await reset(page)
    await openAi(page)
    crop = await panelCrop(page)
    console.log('crop', crop)
    await shot(page, 'forma-ai-chips.png', crop)
  } catch (error) {
    missing.push(`forma-ai-chips.png (${error instanceof Error ? error.message : error})`)
  }

  if (!only) try {
    await reset(page)
    await openAi(page)
    crop ??= await panelCrop(page)
    await draftRule(page, false)
    await shot(page, 'forma-ai-step-review.png')
    const row = page.getByRole('button', { name: 'Ask Sofia', exact: true }).last()
    await row.scrollIntoViewIfNeeded()
    await row.hover()
    await page.getByText("You said 'ask Sofia before Salesforce'").waitFor()
    await shot(page, 'forma-ai-rule-hover.png', crop)
  } catch (error) {
    missing.push(`review/hover stills (${error instanceof Error ? error.message : error})`)
  }

  if (!only) try {
    await reset(page)
    await openAi(page)
    await reachTest(page)
    await page.getByRole('button', { name: 'Test', exact: true }).click()
    await page.getByText(/without .* approval/i).waitFor()
    await page
      .getByText('Writing summary')
      .waitFor({ state: 'hidden', timeout: 4000 })
      .catch(() => {})
    await shot(page, 'forma-ai-step-test.png')
    await saveAgent(page)
    await shot(page, 'forma-ai-step-on.png')
  } catch (error) {
    missing.push(`test/agents stills (${error instanceof Error ? error.message : error})`)
  }

  await stills.close()

  if (!crop) {
    try {
      const clipPage = await browser.newPage({ viewport: { width: 1280, height: 800 } })
      await reset(clipPage)
      await openAi(clipPage)
      crop = await panelCrop(clipPage)
      await clipPage.close()
    } catch (error) {
      missing.push(`panel crop (${error instanceof Error ? error.message : error})`)
    }
  }

  if (!crop) {
    missing.push('clips skipped: panel crop was not measured')
  } else {
    const panel = crop
    const jobs: Array<[string, Crop | undefined, (page: Page, mark: () => number) => Promise<{ start: number; end: number }>]> = [
      [
        'forma-ai-offtopic.mp4',
        panel,
        async (clipPage, mark) => {
          await reset(clipPage)
          await openAi(clipPage)
          const start = mark()
          await typeAndSend(clipPage, 'Message Forma AI', FIFA)
          const aside = clipPage.locator('aside[aria-label="Forma AI"]')
          const reply = aside.getByText(/only (answer|help with) questions about Forma Cloud/)
          try {
            await reply.waitFor({ timeout: 20000 })
          } catch (error) {
            console.log('OFFTOPIC PANEL\n', await aside.innerText())
            await clipPage.screenshot({ path: path.join(OUT, 'offtopic-fail.png') })
            throw error
          }
          await reply.scrollIntoViewIfNeeded()
          await clipPage.waitForTimeout(900)
          return { start, end: mark() }
        },
      ],
      [
        'forma-ai-reasoning.mp4',
        panel,
        async (clipPage, mark) => {
          await reset(clipPage)
          await openAi(clipPage)
          const start = mark()
          await typeAndSend(clipPage, 'Message Forma AI', QUESTION)
          await clipPage.getByText(/Shopify is behind/).waitFor()
          await clipPage.waitForTimeout(900)
          return { start, end: mark() }
        },
      ],
      [
        'forma-ai-step-describe.mp4',
        undefined,
        async (clipPage, mark) => {
          await reset(clipPage)
          await openAi(clipPage)
          await clipPage.getByRole('button', { name: /Automate publishing/ }).click()
          await clipPage.getByPlaceholder('Describe it in one sentence').waitFor()
          const start = mark()
          await typeAndSend(clipPage, 'Describe it in one sentence', RULE)
          await clipPage.getByText('Reading rule').waitFor()
          await clipPage.waitForTimeout(700)
          return { start, end: mark() }
        },
      ],
      [
        'forma-ai-step-test.mp4',
        undefined,
        async (clipPage, mark) => {
          await reset(clipPage)
          await openAi(clipPage)
          await reachTest(clipPage)
          const start = mark()
          await clipPage.getByRole('button', { name: 'Test', exact: true }).click()
          await clipPage.getByText(/without .* approval/i).waitFor()
          await clipPage.waitForTimeout(900)
          return { start, end: mark() }
        },
      ],
    ]

    for (const [file, clipCrop, action] of jobs) {
      if (only && !file.includes(only)) continue
      try {
        await clip(browser, file, clipCrop, action)
      } catch (error) {
        const detail = error instanceof Error ? error.message.split('\n')[0] : String(error)
        missing.push(`${file} (${detail})`)
      }
    }
  }

  await browser.close()
  console.log('\nMADE')
  for (const item of made) console.log(' ', item)
  console.log('\nMISSING')
  for (const item of missing) console.log(' ', item)
  if (missing.length) process.exitCode = 1
}

await main()
