# HANDOFF — TNB Website (thenewbuilder.ai)
*Last updated: April 30, 2026*

## Project Overview
The New Builder homepage at thenewbuilder.ai. Public-facing website for the TNB brand. **LIVE as of April 15, 2026.**

## Tech Stack
Next.js 16.2.1 (App Router), Tailwind CSS 4, Vercel hosting. Email capture wired to Beehiiv via `/api/subscribe`. Bootstrapped from the `tnb-coming-soon` branch of `hc-website`.

## Repo History
Created April 15, 2026 to separate the TNB website from `hc-website`. Previously, the thenewbuilder.ai placeholder lived on the `tnb-coming-soon` branch of `brhecht/hc-website`. That branch is now deprecated and deleted.

## Folder Structure
- `src/app/page.tsx` — main homepage
- `src/app/layout.tsx` — metadata (title: "The New Builder")
- `src/app/globals.css` — base styles (system font, no animations)
- `src/app/api/subscribe/route.ts` — Beehiiv email capture endpoint
- `src/app/api/latest-video/route.ts` — YouTube RSS fetch, returns latest video ID (1h cache)
- `public/images/headshot.jpg` — Brian's headshot (hero photo)

## Current Status
**LIVE at thenewbuilder.ai** — deployed April 15, 2026 via Vercel CLI to project `brian-hechts-projects/newbuilder`.

Pending:
1. Add Beehiiv env vars in Vercel (subscribe form returns error without them): `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`
2. Push code to `brhecht/tnb-website` on GitHub + connect to Vercel project for auto-deploys (Brian needs to add Nico as collaborator)

## Homepage Sections (Approved April 15)
1. **Nav** — "THE NEW BUILDER" wordmark left, YouTube/LinkedIn/Contact right (hidden mobile)
2. **Hero** — Brian's photo left, bold tagline right: "Navigating the AI era. Together." + one-liner
3. **Why I'm building this** — stacked layout, max-width 720px
4. **Builders Figuring it Out. Together.** — 3x2 card grid. Podcast + YouTube link to YouTube channel. Newsletter links to #subscribe anchor. War Room, Meetups, Curated Events are non-clickable.
5. **Latest Episode** — YouTube embed (auto-fetched via `/api/latest-video` from channel RSS, fallback `bKFXxGx6JhI`)
6. **Stay in the loop** — email capture (Email + First name + Subscribe), wired to Beehiiv (utm_source: "newbuilder-homepage")
7. **About Brian** — short bio
8. **Footer** — copyright left, LinkedIn/YouTube/Email links right

## Design Decisions
- White background, black type, gray accents (#6b7280, #9ca3af, #e5e7eb dividers)
- System fonts only: -apple-system stack, no Google Fonts
- Photo: rounded corners (border-radius 16px), hero LEFT column
- No animations or transitions
- No em dashes in copy
- Mobile: hero stacks (photo top), grid 2-col tablet / 1-col phone, nav links hidden

## Environment Variables (Vercel)
```
BEEHIIV_API_KEY=          # from Beehiiv Settings > API
BEEHIIV_PUBLICATION_ID=   # from Beehiiv dashboard URL: pub_xxxxxxxx
```

## Deploy
Site is live. Deployed via `vercel deploy --prod` from local repo to Vercel project `brian-hechts-projects/newbuilder`.

**To add Beehiiv env vars:**
```bash
cd ~/Developer/clients/hc/B-Suite/tnb-website
vercel env add BEEHIIV_API_KEY production
vercel env add BEEHIIV_PUBLICATION_ID production
vercel deploy --prod
```

**To connect GitHub (for auto-deploys):**
1. Brian adds Nico as collaborator on `brhecht/tnb-website`
2. `git remote add origin https://github.com/brhecht/tnb-website.git && git push -u origin main`
3. In Vercel dashboard: Settings > Git > Connect to `brhecht/tnb-website`

## Known Bugs / Issues
None.

## Backlog
- Wire War Room, Meetups, Curated Events cards when those pages exist
- Add Beehiiv env vars (`BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`) in Vercel — subscribe form broken until then

## Session Log
### April 30, 2026 — Favicon swapped to TNB orange grid mark
- **What shipped:** Replaced default Next.js `favicon.ico` with `src/app/icon.svg` — 5x5 orange grid (#EE7C2A / #B0431F), strict checkerboard, 30x30 viewBox. Next.js App Router auto-serves it at `/icon.svg`. Old default favicon.ico removed.
- **Known issues:** Pattern is a recreation from a screenshot Brian shared — if the canonical TNB icon source asset surfaces, swap `icon.svg` content directly. At 16px the grid reads as orange static (expected for any detailed favicon).
- **Next:** Beehiiv env vars still pending (independent of this change).

### April 15, 2026 — Homepage built, deployed, and iterated
- **What shipped:** Full Next.js implementation deployed to thenewbuilder.ai. All sections from approved design (nav, hero, story, 6-card grid, YouTube embed, subscribe, bio, footer).
- Brian's photo: clean headshot (BRH.png, no watermark), rounded corners 16px.
- Podcast card links to Riverside episode (`share.riverside.fm/episode/7e6dc792...`).
- YouTube + nav/footer links → `@HumbleConvictionStartups`.
- Contact email → `brian@thenewbuilder.ai`.
- War Room / Meetups / Curated Events: non-clickable (`cursor: default`).
- `tnb-coming-soon` branch deleted from hc-website (local + remote).
- `bsync.sh` v2.1 conflict resolved in bhub, pushed.
- `HANDOFF-MASTER.md` updated and pushed to bhub.
- Vercel project renamed `newbuilder` → `thenewbuilder`.
- Code on `nmejiawork/tnb-website` (transfer to `brhecht` pending).
- **Next:** Brian provides Beehiiv API key + publication ID. Brian adds Nico as collaborator for GitHub auto-deploy.

### April 27, 2026 — YouTube embed → auto-update via RSS
- **What shipped:** Eliminado `LATEST_VIDEO_ID` hardcodeado. El embed ahora se auto-actualiza al video más reciente del canal `@the_new_builder` (channel ID: `UCqAhVRJlLyY86vWAE5s_xhA`).
- Nuevo endpoint `/api/latest-video`: fetcha RSS de YouTube, cachea 1 hora en Vercel, fallback `bKFXxGx6JhI`. `page.tsx` usa `useEffect` para llamarlo on mount.
- `YT_CHANNEL` corregido de `@HumbleConvictionStartups` → `@the_new_builder`.
- Resolvió conflicto de merge (remote tenía `fbAOEBio9QY`, eliminado a favor del sistema dinámico).
- **Resultado:** Cuando Brian suba un episodio nuevo, la página lo muestra en ≤1 hora sin tocar código.
- **Next:** Beehiiv env vars siguen pendientes.

### April 20, 2026 — Homepage YouTube embed swapped
- **What shipped:** `LATEST_VIDEO_ID` updated from `_3601d3OpYY` (HC pitching video) to `fbAOEBio9QY` in `src/app/page.tsx`. Latest Episode section on thenewbuilder.ai now shows the new video.
- **Known issues:** Beehiiv env vars (`BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`) still missing in Vercel Production — subscribe form still broken (5 days). Task open in B Things (Today, HC Admin). Unrelated to this change.
- **Next:** Add Beehiiv env vars + redeploy. GitHub repo transfer `nmejiawork` → `brhecht` still pending.
