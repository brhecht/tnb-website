# HANDOFF — TNB Website (thenewbuilder.ai)
*Last updated: April 15, 2026*

## Project Overview
The New Builder homepage at thenewbuilder.ai. Public-facing website for the TNB brand. Homepage implemented and ready to deploy.

## Tech Stack
Next.js 16.2.1 (App Router), Tailwind CSS 4, Vercel hosting. Email capture wired to Beehiiv via `/api/subscribe`. Bootstrapped from the `tnb-coming-soon` branch of `hc-website`.

## Repo History
Created April 15, 2026 to separate the TNB website from `hc-website`. Previously, the thenewbuilder.ai placeholder lived on the `tnb-coming-soon` branch of `brhecht/hc-website`. That branch is now deprecated and deleted.

## Folder Structure
- `src/app/page.tsx` — main homepage
- `src/app/layout.tsx` — metadata (title: "The New Builder")
- `src/app/globals.css` — base styles (system font, no animations)
- `src/app/api/subscribe/route.ts` — Beehiiv email capture endpoint
- `public/images/headshot.jpg` — Brian's headshot (hero photo)

## Current Status
Homepage implemented and built (0 TypeScript errors). Needs:
1. GitHub repo `brhecht/tnb-website` created by Brian
2. Beehiiv env vars added in Vercel: `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`
3. Vercel project reconnected from hc-website to tnb-website

## Homepage Sections (Approved April 15)
1. **Nav** — "THE NEW BUILDER" wordmark left, YouTube/LinkedIn/Contact right (hidden mobile)
2. **Hero** — Brian's photo left, bold tagline right: "Navigating the AI era. Together." + one-liner
3. **Why I'm building this** — stacked layout, max-width 720px
4. **Builders Figuring it Out. Together.** — 3x2 card grid. Podcast + YouTube link to YouTube channel. Newsletter links to #subscribe anchor. War Room, Meetups, Curated Events are non-clickable.
5. **Latest Episode** — YouTube embed (hardcoded: `_3601d3OpYY`, the pitching video from HC channel)
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

## Deploy Steps
1. Brian creates `brhecht/tnb-website` on GitHub
2. Push this code: `git remote add origin https://github.com/brhecht/tnb-website.git && git push -u origin main`
3. In Vercel: disconnect thenewbuilder.ai from hc-website, connect to tnb-website
4. Add env vars in Vercel project settings
5. Deploy

## Known Bugs / Issues
None.

## Backlog
- Swap YouTube embed to actual TNB podcast episodes when ready
- Wire War Room, Meetups, Curated Events cards when those pages exist
- Consider auto-pull for latest YouTube episode

## Session Log
### April 15, 2026 — Homepage built
- **What shipped:** Full Next.js implementation of approved homepage design. Beehiiv subscribe route. Zero build errors.
- **Source of truth:** `tnb-homepage-preview.html` in hc-website/main (approved design). `bhub/NICO-BRIEF-TNB-WEBSITE.md` (build spec).
- **Next:** Brian creates GitHub repo, add Beehiiv env vars, reconnect Vercel, deploy.
