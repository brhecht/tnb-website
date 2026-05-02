# HANDOFF — TNB Website (thenewbuilder.ai)
*Last updated: May 2, 2026 (post-topic-depth)*

## Project Overview
The New Builder homepage at thenewbuilder.ai. Public-facing website for the TNB brand. **LIVE as of April 15, 2026.** Now includes a full **Dynamic Glossary** at `/glossary` (shipped May 1-2): **287 AI/builder terms** with weekly auto-update via Anthropic-grounded GitHub Actions cron.

## Tech Stack
Next.js 16.2.1 (App Router), Tailwind CSS 4, Vercel hosting. Substack subscribe embed (Beehiiv pivot Apr 21). Glossary uses `gray-matter` for MD frontmatter parsing, `@anthropic-ai/sdk` for the cron (installed in workflow only, not in app deps).

## Repo History
Created April 15, 2026 to separate the TNB website from `hc-website`. Previously, the thenewbuilder.ai placeholder lived on the `tnb-coming-soon` branch of `brhecht/hc-website`. That branch is deprecated and deleted.

## Folder Structure
- `src/app/page.tsx` — main homepage (includes Glossary nav link, glossary CTA band, footer link)
- `src/app/layout.tsx` — metadata (title: "The New Builder")
- `src/app/globals.css` — base styles (system font, no animations)
- `src/app/icon.svg` — favicon: 5x5 orange grid mark (#EE7C2A / #B0431F checkerboard)
- `src/app/api/subscribe/route.ts` — Beehiiv email capture endpoint (legacy; subscribe form now uses Substack iframe)
- `src/app/api/latest-video/route.ts` — YouTube RSS fetch, returns latest video ID (1h cache)
- `src/app/glossary/page.tsx` — `/glossary` index (SSG, browse-first card grid)
- `src/app/glossary/GlossaryControls.tsx` — client component: search/sort/topic-filter with URL state
- `src/app/glossary/[slug]/page.tsx` — per-term article (SSG via `generateStaticParams`). Top "← Back to glossary" link, clickable topic chip in meta strip
- `src/app/sitemap.ts` — auto-generated sitemap, includes all glossary terms
- `src/app/robots.ts` — robots.txt
- `src/lib/glossary.ts` — filesystem reader for `/content/glossary/*.md`, addedLabel helpers
- `src/lib/glossary-autolink.ts` — whole-word cross-reference linkifier (longest-first, self-excluding)
- `src/types/glossary.ts` — TypeScript types + topic/type/familiarity taxonomies
- `content/glossary/[slug].md` — one Markdown file per glossary term (cron-managed, frontmatter + body)
- `scripts/glossary-cron.mjs` — multi-mode discovery + generation engine (bootstrap, weekly, manual, gap-audit, topic-depth, source-scan)
- `scripts/manual-terms.txt` — manual seed queue. Add a term name, push, run workflow with `mode=manual`. Layer 5 deterministic backstop.
- `.github/workflows/glossary-cron.yml` — GitHub Actions workflow (Mon 13:00 UTC schedule + manual `workflow_dispatch` with mode + topic inputs)
- `BUILD-SPEC.md` — locked spec for the dynamic glossary (5 spec tracks, all decisions logged in repo)
- `public/images/brian.png` — Brian's headshot (hero photo, ~4MB)

## Current Status

**LIVE at thenewbuilder.ai** — auto-deploys from `brhecht/tnb-website` main via Vercel.

**Dynamic Glossary (May 1-2):** SHIPPED. Live at `/glossary` with **287 terms**, expanding via weekly cron.
- Bootstrap (May 1): 42 starter terms.
- OpenClaw (May 1, manual fill): +1.
- Source-scan (May 2 AM): +42 (viral / post-cutoff products: Cursor, Windsurf, Zed, Ollama, Claude Code, MCP servers, etc.).
- Gap-audit (May 2 AM): +52 (Anthropic/OpenAI/Google product specifics: Claude Skills, Claude Artifacts, NotebookLM, Custom GPTs, Project Astra, Llama 4, etc.).
- Topic-depth × 7 (May 2 PM, post-credit-top-up): +152 across all 7 topics. Roles & Org +22, Business Models +22, Infrastructure +23, Patterns & Practices +22, AI Models & Capabilities +22, Agents & Automation +21, Builder Tools +20.
- Self-audit dedup (May 2): -2 total (`moe` and `agent-loop` removed; both covered by other entries' aliases).

Weekly cron is on auto-pilot — fires Mondays 13:00 UTC. Multi-vector discovery (source-scan + targeted-search + adversarial-audit + manual-queue check). Failure pings Brain Inbox `/api/handoff-notify` (recipient: nico).

Pending:
1. Add Beehiiv env vars in Vercel (legacy `/api/subscribe` returns error without them): `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`. Subscribe form on the live site now uses a Substack iframe and is unaffected — these are only for the legacy API route.
2. **Anthropic API key rotation pending.** Brian exposed the key value in chat during initial setup. Recommended: console.anthropic.com → revoke + regenerate → update `ANTHROPIC_API_KEY` in `brhecht/tnb-website` GitHub Secrets + Vercel env vars on hc-funnel and builder-bot (which share the same key).
3. War Room / Meetups / Curated Events homepage cards remain non-clickable until those pages exist.

## Glossary Cron Modes (workflow_dispatch)

The workflow supports six modes, dispatchable from the Actions tab:

| Mode | Purpose | When to use |
|---|---|---|
| `bootstrap` | Generate ~30-40 starter terms in one shot | One-time at launch (already run May 1) |
| `weekly` | Multi-vector discovery, ~5-10 new terms surfacing in last 7-14 days | Auto-runs Mondays 13:00 UTC |
| `manual` | Read `scripts/manual-terms.txt`, generate definitions for listed terms | Anytime you spot a missing term — append to file, push, run workflow. Deterministic backstop. |
| `gap-audit` | Adversarial completeness check against existing corpus, up to ~50 missing terms | Periodically when you suspect coverage gaps |
| `topic-depth` | Per-topic forcing function, 15-25 terms scoped to one topic (REQUIRES topic input) | Run once per topic for breadth. **6 of 7 deferred — see Pending #2.** |
| `source-scan` | Deterministic source-aggregator polling (GitHub Trending, HN, Product Hunt, etc.) | Quarterly, or when feeling out-of-currency |

## Glossary Topic Distribution (May 2, post-topic-depth)

| Topic | Count |
|---|---|
| Agents & Automation | 54 |
| Builder Tools | 53 |
| AI Models & Capabilities | 48 |
| Patterns & Practices | 45 |
| Infrastructure | 37 |
| Roles & Org | 26 |
| Business Models | 25 |

Total: **287 terms.** Distribution is balanced — topic-depth × 7 successfully filled out the previously-light buckets (Roles & Org went from 4→26, Business Models 3→25).

## Glossary Spec Decisions (locked in BUILD-SPEC.md)

Top-level locked calls — refer to BUILD-SPEC.md for the full decision log:
- **Primary user**: warm reader (TNB-aware, clicking from newsletter/Slack/podcast). NOT cold-SEO traffic.
- **Voice**: TNB-utility (plain, peer, doesn't claim authority; no em dashes; no "platform"/"movement" language; inline parentheticals for jargon).
- **Type taxonomy**: Concept / Tool / Role (three; collapsed from earlier proposal of six).
- **Topic taxonomy**: 7 buckets, single-topic per term, related-terms array carries cross-cluster relationships.
- **Familiarity (Common/Emerging/Specialist)**: data-only, NOT displayed in v1 UI. Cron uses for re-evaluation logic.
- **Storage**: MD files in repo (`/content/glossary/[slug].md`). No external DB. SSG via Next.js App Router.
- **Cron host**: GitHub Actions (not Vercel cron — avoids 5-min timeout on long generation runs).
- **Quality grounding**: web-search-grounded via Anthropic `web_search_20250305` tool.
- **AI disclaimer**: shown on every per-term page. Reframes glossary as a utility, not editorial.
- **Auto-linking**: glossary terms in long-form definitions wrap as Links to their slug pages. Whole-word match, longest-first, self-excluding.
- **Failure mode**: deprecate-not-delete (planned for v1.1). v1 deletions are manual.

## Homepage Sections (Approved April 15, refreshed May 1)
1. **Nav** — TNB wordmark left; Glossary / YouTube / LinkedIn / Contact right (hidden mobile)
2. **Hero** — Brian's photo left, bold tagline right: "Navigating the AI era. Together." + one-liner
3. **Why I'm building this** — stacked layout, max-width 720px
4. **Builders Figuring it Out. Together.** — 3x2 card grid (Podcast, YouTube, Newsletter, War Room, Meetups, Curated Events)
5. **Glossary CTA band** — "New AI words coming at you fast?" with Browse the Glossary → button
6. **Latest Episode** — YouTube embed (auto-fetched via `/api/latest-video` from channel RSS)
7. **Stay in the loop** — Substack iframe embed (Beehiiv → Substack pivot Apr 21)
8. **About Brian** — short bio
9. **Footer** — copyright left; Glossary / LinkedIn / YouTube / Email links right

## Design Decisions
- White background, black type, gray accents (#6b7280, #9ca3af, #e5e7eb dividers)
- System fonts only: -apple-system stack, no Google Fonts
- Photo: rounded corners (16px), hero LEFT column
- No animations or transitions
- No em dashes in copy (TNB style rule)
- Mobile: hero stacks (photo top), grid 2-col tablet / 1-col phone, nav links hidden
- Glossary inherits all the above. Card grid 2-col desktop / 1-col mobile. Search input 280px fixed-width with magnifier glyph. Sort = text-link toggles (Recency / A-Z), not dropdown. Topic filter chips in pill row.

## Environment Variables

**Vercel (production):**
```
BEEHIIV_API_KEY=          # legacy — only needed if /api/subscribe is wired in (it's not currently used; Substack iframe replaces)
BEEHIIV_PUBLICATION_ID=
```

**GitHub Actions Secrets on `brhecht/tnb-website`:**
```
ANTHROPIC_API_KEY=        # required for glossary cron. Same key used in hc-funnel and builder-bot.
HANDOFF_SECRET=           # OPTIONAL. If brain-inbox handoff-notify endpoint is secret-protected.
```

## Deploy
Auto-deploys from `brhecht/tnb-website` main via Vercel. No manual deploy steps for code changes — push and it goes live in ~60s.

**To re-trigger a cron run manually:**
1. github.com/brhecht/tnb-website/actions/workflows/glossary-cron.yml
2. Run workflow → choose mode → for `topic-depth` also choose topic
3. Run

**Vercel Git connection** (verified May 1): `brhecht/tnb-website` → Vercel project `brian-hechts-projects/thenewbuilder`. Auto-deploy enabled.

## Known Bugs / Issues
- Mount has a stale `src/app/favicon.ico` (FUSE EPERM blocks deletion locally; absent in repo so Vercel deploys are correct — pure local-mount nuisance, not a deploy problem).

## Backlog
- **Resume topic-depth × 7** when Anthropic credits restored (6 topics deferred: AI Models & Capabilities, Agents & Automation, Builder Tools, Patterns & Practices, Roles & Org, Business Models, Infrastructure).
- Replace `src/app/icon.svg` with the canonical TNB icon source asset (current is a recreation from a screenshot Brian shared April 30).
- Wire War Room / Meetups / Curated Events cards when those pages exist.
- v1.1 glossary additions: deprecate-not-delete logic in cron; familiarity re-classification quarterly pass; AI copilot Q&A on per-term pages (V2 stretch, see BUILD-SPEC.md D1.5).
- Optional: connect Vercel Analytics for term-page view tracking (D5.2 in BUILD-SPEC.md).

## Open Questions / Decisions Pending
- None blocking. Open questions are all "Brian + future Claude session" things on his timeline (eyeball-pass on the corpus, ad-hoc term additions via manual queue, Anthropic credit top-up for topic-depth resumption).

## Session Log

### May 2, 2026 (PM) — Topic-depth × 7 complete + final dedup. Corpus 136 → 287
- **What shipped:** All 7 topic-depth passes ran successfully after Brian added $25 Anthropic credits.
  - Roles & Org: +22 (4 → 26)
  - Business Models: +22 (3 → 25)
  - Infrastructure: +23 (14 → 37)
  - Patterns & Practices: +22 (23 → 45)
  - AI Models & Capabilities: +22 (26 → 48)
  - Agents & Automation: +21 (33 → 54)
  - Builder Tools: +20 (33 → 53)
  - Total topic-depth additions: **+152**
- **Self-audit:** Found and removed `agent-loop` (duplicate of `agentic-loop` which already had "agent loop" as alias). Final corpus: **287 terms**.
- **Spend:** ~$5-7 in Anthropic credits across the 7 runs. Each topic-depth was 16K max tokens + 8 web searches, ~$0.50-1 each.
- **Distribution now balanced:** all 7 topics in the 25-54 range. No topic is anemic.
- **Voice spot-check:** continued to pass — TNB-utility tone consistent, inline parentheticals for jargon, no em dashes, no encyclopedia voice.
- **Known issues:** None new. Anthropic API key rotation still pending.
- **Next:** Glossary is in a strong steady state. Weekly cron will continue adding ~5-10 emerging terms per Monday. Manual queue available for spot-fills when Brian sees missing terms in the wild.

### May 2, 2026 (AM) — Glossary corpus expanded 42 → 136 + multi-mode cron + UX iteration
- **What shipped:**
  - **Multi-mode cron infrastructure.** Added 4 new modes to `scripts/glossary-cron.mjs` and `.github/workflows/glossary-cron.yml`: `manual` (queue-based deterministic adds), `gap-audit` (adversarial completeness against existing corpus), `topic-depth` (per-topic forcing function with topic input), `source-scan` (deterministic source-aggregator polling — GitHub Trending, HN, Product Hunt, AI publication coverage). Refactored `weekly` mode to use multi-vector discovery prompt.
  - **Manual queue file** at `scripts/manual-terms.txt` with usage instructions in comments. Forever-pattern for spot-fills.
  - **OpenClaw added manually** as proof-of-concept for Layer 5 (manual queue) — bootstrap had missed it because OpenClaw emerged Nov 2025, post-Sonnet-4.6 training cutoff.
  - **Source-scan run**: +42 terms (Cursor, Windsurf, Zed, Claude Code, MCP servers, Ollama, Codex CLI, Gemini CLI, agentic-engineering, vibe-stack, swe-bench, eu-ai-act, etc.).
  - **Gap-audit run**: +52 terms (Claude Skills, Claude Artifacts, Claude Hooks, Claude Projects, NotebookLM + audio overview, Custom GPTs, OpenAI Operator, AgentKit, Project Astra/Mariner, Google Gems, Llama 4, Llama Stack, Devin, OpenHands, Aider, Cline, Bolt, Replit, Perplexity, Constitutional AI, Mixture of Experts, Function Calling, etc.).
  - **Per-term page UX iteration**: replaced bottom-only back link with prominent "← Back to glossary" at top of article (where breadcrumb was). Made topic in meta strip a Link to filtered index. Type badge stays static.
  - **Self-audit dedup**: removed `moe.md` (duplicate of `mixture-of-experts` which already aliases MoE). Final corpus 136. Voice spot-checked across 5 random samples — TNB-utility tone consistent, inline parentheticals working.
- **Known issues:**
  - **Anthropic API credit balance exhausted.** Topic-depth #5 (Business Models) failed in 36s with `BadRequestError: 400 — Your credit balance is too low`. 6 of 7 topic-depth passes deferred until Brian adds credits. Roles & Org (4 terms) and Business Models (3 terms) remain the light buckets that topic-depth would have filled.
  - Anthropic API key rotation still recommended (exposed in chat during May 1 setup).
- **Next:** When Brian adds Anthropic credits, run topic-depth × 6 remaining (skip Business Models since it's been attempted; or retry it). Each adds 15-25 terms in that topic. Final corpus probably 230-280 terms after all 7 complete.

### May 1, 2026 — Dynamic Glossary feature shipped end-to-end
- **What shipped:** Full dynamic glossary feature per `BUILD-SPEC.md` (5 spec tracks locked, all decisions logged in repo). Live at `thenewbuilder.ai/glossary` with 42 terms generated by the bootstrap cron run.
  - **Pages:** `/glossary` (SSG browse-first card grid w/ search, sort, topic-filter, URL state, mobile responsive); `/glossary/[slug]` (article-style per-term pages w/ glossary-term auto-linking in long-form); `/sitemap.xml` (auto-includes all term pages); `/robots.txt`.
  - **Data layer:** Markdown files in `/content/glossary/[slug].md` with strict frontmatter; gray-matter for parsing; in-process cache.
  - **Cron:** GitHub Actions workflow with weekly schedule (Mon 13:00 UTC) + manual `workflow_dispatch` for bootstrap or weekly modes. Calls Anthropic API (claude-sonnet-4-6) with `web_search_20250305` tool grounded. Streams response (avoids 10-min synchronous timeout). Strict JSON validation. Commits new MD files + auto-deploys via Vercel. Failure pings Brain Inbox `/api/handoff-notify` (recipient: nico).
  - **Homepage discoverability:** Glossary nav link, dedicated CTA band ("New AI words coming at you fast?") between 6-card grid and YouTube embed, footer link.
  - **Bootstrap output (May 1):** 42 terms across 7 topics.
  - **Per-term UX iteration:** Replaced bottom-only back link with prominent "← Back to glossary" at top of article (where breadcrumb was). Made the topic in the meta strip clickable — lands on `/glossary?topic=...` filtered index. Type badge stays static (no hidden filter dimension).
- **Known issues:**
  - Mount has stale `src/app/favicon.ico` (FUSE EPERM blocks deletion locally; absent in repo so deploys are correct — pure local-mount nuisance).
  - Anthropic API key exposed in chat during GitHub Secret setup — rotation recommended.
- **Build issues caught and fixed during the session (chronological):**
  - PAT `workflow` scope missing → user updated `cowork` PAT to add `workflow` scope; workflow file now pushable from Cowork.
  - `gray-matter` dependency missing from package.json (had been installed without `--save`) → fixed.
  - Cron model name `claude-sonnet-4-5` (stale) → corrected to `claude-sonnet-4-6`.
  - Anthropic SDK requires streaming for long-running calls → switched from `messages.create()` to `messages.stream()` + `finalMessage()`.
- **Next:** Brian's content-completeness audit (review the 42 corpus terms, identify gaps or unwanted entries). Then weekly cron is hands-off forever. (Audit subsequently ran May 2 — see entry above.)

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
- Code on `nmejiawork/tnb-website` (transfer to `brhecht` pending — completed Apr 30).
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
