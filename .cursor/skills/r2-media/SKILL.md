---
name: r2-media
description: >-
  Upload and wire Cloudflare R2 media for Portfolio-2026. Use when the user
  asks to upload to R2/Cloudflare, put assets in portfolio-2026/secret-stash,
  list R2 objects, or replace MediaPlaceholder with a live mediaUrl asset.
---

# R2 media (Portfolio-2026)

## Defaults

- Bucket: `portfolio-2026` (override with `R2_BUCKET`)
- Public base: `VITE_MEDIA_BASE` in `.env` / `.env.local`
- Object keys: e.g. `secret-stash/reasoning.gif`, `secret-stash/herobg.png`
- Registry: `src/data/mediaAssets.ts` + `mediaUrl()` from `src/lib/media.ts`

## Auth

Prefer Wrangler session:

```bash
npx wrangler login
```

Or set in **`.env.local` only** (gitignored via `*.local`):

- `CLOUDFLARE_API_TOKEN` (R2 Edit permission)
- `CLOUDFLARE_ACCOUNT_ID` (if wrangler asks)
- `R2_BUCKET=portfolio-2026`

Never commit tokens. Never print secret values in chat.

## Upload

From repo root, with `required_permissions: ["all"]` (or network + all as needed):

```bash
npm run r2:upload -- <local-file> <object-key>
```

Example:

```bash
npm run r2:upload -- ./reasoning.gif secret-stash/reasoning.gif
```

List / verify (Wrangler has no object listing):

```bash
npm run r2:list -- secret-stash/
```

This lists buckets and HEAD-checks common public keys under the prefix.

After upload, verify:

`curl -sI "$VITE_MEDIA_BASE/<object-key>"` → expect HTTP 200

## Wire into the site

1. Add/confirm key in `src/data/mediaAssets.ts`
2. Use `mediaUrl(mediaAssets.<key>)` in the page (hero, figure, etc.)
3. Replace `MediaPlaceholder` when the real asset is live
4. Restart Vite if `.env` / `.env.local` just changed

## When the user says “upload to R2”

1. Confirm local file path exists
2. Confirm object key (default folder `secret-stash/` for SecretStash)
3. Run `r2:upload`
4. If auth fails, ask them to run `npx wrangler login` once
5. Wire the asset in code when they want it on the page
