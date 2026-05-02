#!/usr/bin/env node
/**
 * Glossary cron script — multi-mode discovery + generation engine.
 *
 * Modes:
 *   bootstrap    — one-time, ~30-40 starter terms (used at launch)
 *   weekly       — ongoing, ~5-10 new terms surfacing in the last 7-14 days,
 *                  via multi-vector pipeline (source-scan + gap-audit lite)
 *   manual       — read scripts/manual-terms.txt, generate definitions for
 *                  any term not yet in /content/glossary/. Deterministic
 *                  backstop. Layer 5.
 *   gap-audit    — adversarial pass: feed model existing corpus + explicit
 *                  gap categories, ask "what's missing?". Up to ~50 terms.
 *   topic-depth  — per-topic forcing function. Args: <mode> <topic>.
 *                  Generate 15-25 terms specifically scoped to one topic.
 *   source-scan  — web-search-grounded pass against deterministic source
 *                  aggregators (GitHub Trending, HN, Product Hunt, etc.) to
 *                  catch viral / post-cutoff products. The OpenClaw fix.
 *
 * Output: each mode writes one MD file per generated term to
 * /content/glossary/. The GitHub Actions workflow then commits and pushes.
 *
 * Spec: BUILD-SPEC.md (D2.1, D2.2, D2.3, D2.4, D4.3, D4.5, D4.6, plus the
 * May 1 currency-reliability upgrade discussion in chat).
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Anthropic from "@anthropic-ai/sdk";

// ---------- mode + args ----------

const MODE = (process.argv[2] || "weekly").toLowerCase();
const MODE_ARG = (process.argv[3] || "").trim();

const VALID_MODES = ["bootstrap", "weekly", "manual", "gap-audit", "topic-depth", "source-scan"];
if (!VALID_MODES.includes(MODE)) {
  console.error(`Invalid mode: "${MODE}". Use one of: ${VALID_MODES.join(", ")}`);
  process.exit(1);
}

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "glossary");
const MANUAL_QUEUE_FILE = path.join(ROOT, "scripts", "manual-terms.txt");
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY env var is required");
  process.exit(1);
}

// Per-mode config
const MODEL = "claude-sonnet-4-6";
const MODE_CONFIG = {
  bootstrap:    { target: 35, maxTokens: 24000, maxWebSearches: 8 },
  weekly:       { target: 8,  maxTokens: 12000, maxWebSearches: 10 },
  manual:       { target: 0,  maxTokens: 8000,  maxWebSearches: 4 }, // per-term
  "gap-audit":  { target: 50, maxTokens: 32000, maxWebSearches: 15 },
  "topic-depth":{ target: 22, maxTokens: 16000, maxWebSearches: 8 },
  "source-scan":{ target: 35, maxTokens: 24000, maxWebSearches: 18 },
};
const cfg = MODE_CONFIG[MODE];

// ---------- taxonomy ----------

const TOPICS = [
  "AI Models & Capabilities",
  "Agents & Automation",
  "Builder Tools",
  "Patterns & Practices",
  "Roles & Org",
  "Business Models",
  "Infrastructure",
];
const TYPES = ["Concept", "Tool", "Role"];
const FAMILIARITIES = ["Common", "Emerging", "Specialist"];

// ---------- existing corpus ----------

function readExistingTerms() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const out = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const parsed = matter(raw);
    if (parsed.data?.slug && parsed.data?.term) {
      out.push({
        slug: String(parsed.data.slug),
        term: String(parsed.data.term),
        topic: String(parsed.data.topic ?? ""),
        type: String(parsed.data.type ?? ""),
        aliases: Array.isArray(parsed.data.aliases) ? parsed.data.aliases.map(String) : [],
      });
    }
  }
  return out;
}

const existing = readExistingTerms();
const existingSlugs = new Set(existing.map((t) => t.slug));
console.log(`[glossary-cron] mode=${MODE}${MODE_ARG ? ` arg="${MODE_ARG}"` : ""}, existing terms=${existing.length}`);

// ---------- shared system prompt fragments ----------

const VOICE_AND_FORMAT_PROMPT = `VOICE — TNB-utility (NON-NEGOTIABLE):
- Plain English. Light. Doesn't claim authority.
- "When an AI doesn't just answer once, it keeps going. The model takes an action, sees what happens, decides what to do next, and repeats until the job is done." — that's the target tone.
- NOT encyclopedia voice. NOT "AI guru" voice. Peer-explaining, not lecturing.
- NEVER use em dashes (—). Use commas, colons, semicolons, or sentence breaks instead.
- NEVER use the words "platform" or "movement" to describe TNB or anything else in this domain.
- No "in summary," "to wrap up," "in conclusion."
- No filler like "It's worth noting that..." — just say it.

OUTPUT FORMAT (STRICT):
- Reply with a single JSON array. NO preamble, NO postamble, NO markdown code fences.
- Each array element has this exact schema:
  {
    "slug": "kebab-case-slug",
    "term": "Term as displayed (capitalize naturally, no all-caps unless acronym)",
    "type": one of ${JSON.stringify(TYPES)},
    "topic": one of ${JSON.stringify(TOPICS)},
    "familiarity": one of ${JSON.stringify(FAMILIARITIES)},
    "aliases": ["array", "of", "alternate names / spellings / expansions"],
    "related": ["array", "of", "related-term-slugs"],
    "shortDef": "2-3 line plain-English definition, ~30-50 words. Self-contained.",
    "longDef": ["paragraph 1", "paragraph 2", "paragraph 3 (optional)"]
  }

LONG-FORM RULES:
- 2 to 4 paragraphs, ~150-400 words total.
- WRITE SELF-CONTAINED DEFINITIONS. If you reference a term a hobbyist might not know (e.g. "fork", "VS Code", "API"), add a brief inline parenthetical clarification.
- No bullet lists. No headers. Plain prose.

TAXONOMY GUIDANCE:
- type=Concept: ideas, patterns, practices, protocols (agentic loop, RAG, vibecoding, MCP)
- type=Tool: software, products, platforms, services (Cursor, Claude Code, Vercel, Lovable)
- type=Role: job titles or functional roles (FDE, AI engineer, prompt engineer)
- topic: assign exactly ONE. If a term genuinely straddles, pick the most central topic and use related[] for cross-cluster relationships.
- familiarity: Common (most builders know it) / Emerging (actively adopted, you're not behind if you don't know it) / Specialist (niche)

ALIASES: Include alternate spellings, full-form expansions of acronyms, common variant phrasings. DO NOT include the term itself.

RELATED TERMS: 2-5 slugs. Use slugs of OTHER terms in this batch OR slugs from the existing-glossary list provided in the user message. DO NOT invent slugs that don't correspond to actual terms.

SLUG FORMAT: All lowercase. Hyphen-separated. ASCII only. No leading/trailing hyphens.`;

const TNB_AUDIENCE_PROMPT = `You are generating glossary entries for The New Builder (TNB), an AI-era builder community. The glossary is a public utility resource at thenewbuilder.ai/glossary.

AUDIENCE: warm readers — already TNB-aware, clicking through from a newsletter link, a Slack reference, a podcast show note, or another part of the site. They have baseline literacy about AI/startups but need plain-English clarity on emerging vocabulary.

SCOPE: terms a TNB-audience builder would reasonably encounter in conversations on TNB Slack, in LinkedIn posts of Brian and active community members (some technical), or while building with AI. Include both established AI/builder vocabulary and emerging terms surfacing in the wild. EXCLUDE: crypto/web3 terms, generic SaaS jargon, generic startup vocabulary unless AI-relevant.

${VOICE_AND_FORMAT_PROMPT}`;

// ---------- per-mode user prompts ----------

function existingSlugList() {
  return existing
    .map((t) => `${t.slug} (${t.type}, ${t.topic})`)
    .sort()
    .join("\n");
}

function buildUserPrompt() {
  switch (MODE) {
    case "bootstrap":
      return `Use the web search tool to ground your output in current (May 2026) AI/builder vocabulary. Make multiple searches as needed.

Generate a starter set of ~${cfg.target} terms a TNB-audience builder would expect to find in this glossary. Aim for breadth: cover the core taxonomy meaningfully, not just the obvious 10. Mix Common/Emerging/Specialist (most should be Common or Emerging — Specialist sparingly).

Distribute across ALL ${TOPICS.length} topics where possible.

Return ONLY the JSON array.`;

    case "weekly":
      return `Use the web search tool aggressively to find AI/builder terms surfacing in the last 7-14 days that should be added to the glossary. The cron runs weekly; this is the freshness layer.

Search strategy (use multiple targeted queries):
- "AI tool launch [current month] 2026"
- "AI agent [tool|product] viral 2026"
- "trending GitHub AI repository last 7 days"
- "Hacker News AI front page recent"
- "AI builder vocabulary new"
- "[Anthropic|OpenAI|Google|Meta] new feature 2026"
- Skim recent AI newsletter editions / Product Hunt AI category

DO NOT DUPLICATE the existing glossary. These are already in:
${existingSlugList()}

Generate up to ${cfg.target} NEW terms not in the list above. Prioritize: (a) products that have surged in usage in the last 30-60 days; (b) terms that have entered builder vernacular recently; (c) any "OpenClaw-class" miss — viral products mainstream training cutoffs may have missed. If you can't find that many genuinely new and relevant terms, return fewer; quality over quota.

Return ONLY the JSON array.`;

    case "manual":
      // Special: manual mode doesn't use this user prompt at all.
      // It calls the API once per term in a loop. See generateManualTerms().
      throw new Error("manual mode uses a different code path — see generateManualTerms()");

    case "gap-audit":
      return `ADVERSARIAL COMPLETENESS AUDIT.

Below is the existing TNB glossary corpus (${existing.length} terms). Your job: identify TERMS THAT ARE MISSING that a TNB-audience builder would reasonably expect to find.

Use web search aggressively. Check explicitly for:

(a) ANTHROPIC product/feature vocabulary: Claude.ai features (Artifacts, Projects, Memory, Skills), Claude Code features (subagents, slash commands, hooks, MCP servers), Cowork, Claude in Chrome, Anthropic's Agent SDK, Claude Apps.
(b) OPENAI product/feature vocabulary: ChatGPT features (Custom GPTs, Memory, Canvas, Tasks), Operator, AgentKit, o-series models, Sora, DALL·E, etc.
(c) GOOGLE AI vocabulary: Gemini features (Notebook LM, Deep Research, Gems, Workspace integrations), Google AI Studio, Vertex AI, Project Astra, etc.
(d) META AI vocabulary: Llama variants, Meta AI assistant, Llama Stack.
(e) VIRAL GitHub repos / open-source AI tools that went big in the last 90 days. Specifically check: trending AI agents, open-source coding agents, open-source assistants, evals frameworks, MCP servers ecosystem.
(f) TRENDING ROLES in AI hiring (last 90 days): job titles surfacing on LinkedIn / Hacker News Who's Hiring / AI startup job pages.
(g) EMERGING CONCEPTS spreading in builder communities: terms you'd hear in TNB Slack, on AI Twitter/X, in podcasts, in newsletters that haven't yet stabilized in mainstream AI vocabulary.
(h) Cross-cutting concepts the bootstrap may have categorically dropped (skills, artifacts, subagents, contexts).

EXISTING CORPUS — DO NOT DUPLICATE:
${existingSlugList()}

Generate up to ${cfg.target} terms that are MISSING from the list above and SHOULD be there. Use web search to verify each is real and current. Be specific — don't generate generic placeholder terms. If the corpus is already strong in some category, skip it; focus on real gaps.

Return ONLY the JSON array.`;

    case "topic-depth":
      if (!TOPICS.includes(MODE_ARG)) {
        console.error(`topic-depth mode requires a valid topic as second arg. Got: "${MODE_ARG}"`);
        console.error(`Valid topics: ${JSON.stringify(TOPICS)}`);
        process.exit(1);
      }
      const inTopic = existing.filter((t) => t.topic === MODE_ARG);
      return `TOPIC-DEPTH PASS for: "${MODE_ARG}"

Generate ${cfg.target} of the most relevant terms in the topic "${MODE_ARG}" that a TNB-audience builder would expect to find. Use web search to verify currency and capture emerging vocabulary.

Existing terms ALREADY in this topic (DO NOT DUPLICATE):
${inTopic.map((t) => `${t.slug} — ${t.term}`).sort().join("\n") || "(none yet)"}

Existing terms in OTHER topics (you can reference these in related[]):
${existing.filter((t) => t.topic !== MODE_ARG).map((t) => t.slug).sort().join(", ") || "(none)"}

Aim for breadth WITHIN the topic. Cover the obvious foundational terms IF they're missing, plus emerging terms specific to this topic. Mix Common/Emerging/Specialist appropriately for the topic.

ALL terms in your output MUST have topic = "${MODE_ARG}".

Return ONLY the JSON array.`;

    case "source-scan":
      return `SOURCE-AGGREGATOR SCAN: deterministic discovery of viral / emerging AI builder terminology.

Use the web search tool to fetch and synthesize from these specific source-aggregator surfaces. Make multiple searches targeting each source type:

(1) GitHub Trending (AI / agents / coding / ML repositories), last 30-90 days. Query patterns: "github trending AI agent 2026", "github trending coding assistant 2026", "github top stars AI tool last month".
(2) Hacker News front page items mentioning AI products / tools / launches in the last 60 days. Query: "hacker news AI [agent|tool|launch|product] 2026".
(3) Product Hunt AI category, last 60 days. Query: "product hunt AI [agent|tool|coding|productivity] 2026".
(4) Hugging Face Trending models / spaces / datasets, last 60 days.
(5) Recent AI newsletter / publication coverage (KDnuggets, TechCrunch AI, VentureBeat AI, The New Stack, The Verge AI, Latent Space, Stratechery): "AI tool of the month 2026", "AI products you should know 2026", "AI agents trending 2026".
(6) AI Twitter/X trending vocabulary: terms going viral in builder discourse.

EXTRACT candidate terms (product names, role names, concept names) that have surged in mention/usage. Filter to TNB-audience-relevant. Skip:
- Existing corpus (${existing.length} terms below)
- Crypto/web3
- Generic SaaS without AI angle
- Niche academic ML research without builder relevance

EXISTING CORPUS — DO NOT DUPLICATE:
${existingSlugList()}

Generate up to ${cfg.target} terms that are NEW (not in the corpus) and CURRENT (surfacing in the sources above). Use web search to verify each is real and gather facts. Focus on real viral momentum in the last 30-90 days, not commodity vocabulary.

Return ONLY the JSON array.`;

    default:
      throw new Error(`No prompt builder for mode: ${MODE}`);
  }
}

// ---------- Anthropic API ----------

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

async function callModel(systemPrompt, userPrompt, maxTokens, maxWebSearches) {
  console.log(`[glossary-cron] calling Anthropic (model=${MODEL}, max_tokens=${maxTokens}, max_searches=${maxWebSearches}, streaming)...`);
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search",
        max_uses: maxWebSearches,
      },
    ],
    messages: [{ role: "user", content: userPrompt }],
  });
  const response = await stream.finalMessage();
  console.log(`[glossary-cron] response: stop=${response.stop_reason}, blocks=${response.content.length}, in=${response.usage.input_tokens}, out=${response.usage.output_tokens}`);
  return response;
}

// ---------- output parsing ----------

function extractTextFromResponse(response) {
  const textBlocks = response.content.filter((b) => b.type === "text");
  if (textBlocks.length === 0) {
    console.error("[glossary-cron] No text blocks in response.");
    console.error(JSON.stringify(response.content, null, 2).slice(0, 2000));
    return null;
  }
  let raw = textBlocks.map((b) => b.text).join("\n").trim();
  const fenced = raw.match(/^```(?:json)?\s*\n([\s\S]*?)\n```\s*$/);
  if (fenced) raw = fenced[1].trim();
  return raw;
}

function parseJsonArray(rawText) {
  const firstBracket = rawText.indexOf("[");
  const lastBracket = rawText.lastIndexOf("]");
  if (firstBracket === -1 || lastBracket === -1 || lastBracket < firstBracket) {
    console.error("[glossary-cron] Could not find JSON array in response.");
    console.error(rawText.slice(0, 2000));
    return null;
  }
  try {
    const arr = JSON.parse(rawText.slice(firstBracket, lastBracket + 1));
    if (!Array.isArray(arr)) {
      console.error("[glossary-cron] Parsed JSON is not an array.");
      return null;
    }
    return arr;
  } catch (e) {
    console.error("[glossary-cron] JSON parse error:", e.message);
    console.error(rawText.slice(0, 1000));
    return null;
  }
}

function parseJsonObject(rawText) {
  const firstBrace = rawText.indexOf("{");
  const lastBrace = rawText.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    console.error("[glossary-cron] Could not find JSON object in response.");
    console.error(rawText.slice(0, 2000));
    return null;
  }
  try {
    return JSON.parse(rawText.slice(firstBrace, lastBrace + 1));
  } catch (e) {
    console.error("[glossary-cron] JSON parse error:", e.message);
    console.error(rawText.slice(0, 1000));
    return null;
  }
}

// ---------- candidate validation ----------

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validateCandidate(t, seenSlugs, requiredTopic = null) {
  const reasons = [];
  if (!t || typeof t !== "object") return { ok: false, reasons: ["not an object"] };
  const slug = String(t.slug || "").trim();
  const term = String(t.term || "").trim();
  const type = String(t.type || "").trim();
  const topic = String(t.topic || "").trim();
  const familiarity = String(t.familiarity || "").trim();
  const aliases = Array.isArray(t.aliases) ? t.aliases.map((a) => String(a).trim()).filter(Boolean) : [];
  const related = Array.isArray(t.related) ? t.related.map((r) => String(r).trim()).filter(Boolean) : [];
  const shortDef = String(t.shortDef || "").trim();
  const longDef = Array.isArray(t.longDef) ? t.longDef.map((p) => String(p).trim()).filter(Boolean) : [];

  if (!slug || !SLUG_RE.test(slug)) reasons.push(`bad slug "${slug}"`);
  if (!term) reasons.push("empty term");
  if (!TYPES.includes(type)) reasons.push(`bad type "${type}"`);
  if (!TOPICS.includes(topic)) reasons.push(`bad topic "${topic}"`);
  if (requiredTopic && topic !== requiredTopic) reasons.push(`topic should be "${requiredTopic}", got "${topic}"`);
  if (!FAMILIARITIES.includes(familiarity)) reasons.push(`bad familiarity "${familiarity}"`);
  if (!shortDef) reasons.push("empty shortDef");
  if (longDef.length === 0) reasons.push("empty longDef");
  if (existingSlugs.has(slug)) reasons.push("duplicates existing term");
  if (seenSlugs.has(slug)) reasons.push("duplicate within batch");

  if (reasons.length > 0) return { ok: false, reasons };
  return { ok: true, term: { slug, term, type, topic, familiarity, aliases, related, shortDef, longDef } };
}

function filterRelatedSlugs(valid, batchSlugs) {
  const allKnown = new Set([...existingSlugs, ...batchSlugs]);
  for (const t of valid) {
    const filtered = t.related.filter((r) => allKnown.has(r) && r !== t.slug);
    if (filtered.length !== t.related.length) {
      const dropped = t.related.filter((r) => !filtered.includes(r));
      console.log(`  - ${t.slug}: dropped invalid related slugs: ${dropped.join(", ")}`);
    }
    t.related = filtered;
  }
}

// ---------- MD file writer ----------

function writeTerms(valid) {
  if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const written = [];
  for (const t of valid) {
    const frontmatter = {
      slug: t.slug,
      term: t.term,
      type: t.type,
      topic: t.topic,
      familiarity: t.familiarity,
      aliases: t.aliases,
      related: t.related,
      dateAdded: today,
      shortDef: t.shortDef,
    };
    const body = t.longDef.join("\n\n") + "\n";
    const md = matter.stringify(body, frontmatter);
    fs.writeFileSync(path.join(CONTENT_DIR, `${t.slug}.md`), md, "utf8");
    written.push(t.slug);
    // Update in-process tracker so subsequent batches dedupe correctly
    existingSlugs.add(t.slug);
  }
  return written;
}

// ---------- standard batch flow (used by all modes except manual) ----------

async function generateBatch() {
  const userPrompt = buildUserPrompt();
  const response = await callModel(TNB_AUDIENCE_PROMPT, userPrompt, cfg.maxTokens, cfg.maxWebSearches);

  const rawText = extractTextFromResponse(response);
  if (!rawText) process.exit(1);

  const parsed = parseJsonArray(rawText);
  if (!parsed) process.exit(1);

  console.log(`[glossary-cron] parsed ${parsed.length} candidates from response`);

  const requiredTopic = MODE === "topic-depth" ? MODE_ARG : null;
  const seenSlugs = new Set();
  const valid = [];
  const rejected = [];

  for (const t of parsed) {
    const result = validateCandidate(t, seenSlugs, requiredTopic);
    if (result.ok) {
      valid.push(result.term);
      seenSlugs.add(result.term.slug);
    } else {
      rejected.push({ slug: t?.slug || "(no slug)", term: t?.term || "", reasons: result.reasons });
    }
  }

  if (rejected.length > 0) {
    console.warn(`[glossary-cron] rejected ${rejected.length} candidates:`);
    for (const r of rejected) {
      console.warn(`  - ${r.slug} :: ${r.term} :: ${r.reasons.join(", ")}`);
    }
  }

  if (valid.length === 0) {
    console.error("[glossary-cron] No valid terms produced. Aborting without writes.");
    process.exit(1);
  }

  filterRelatedSlugs(valid, seenSlugs);
  const written = writeTerms(valid);
  console.log(`[glossary-cron] wrote ${written.length} MD files:`);
  for (const s of written) console.log(`  + ${s}.md`);
  console.log(`[glossary-cron] done. mode=${MODE}, written=${written.length}, rejected=${rejected.length}`);
}

// ---------- manual mode ----------

function readManualQueue() {
  if (!fs.existsSync(MANUAL_QUEUE_FILE)) {
    console.log(`[glossary-cron] no manual queue file at ${MANUAL_QUEUE_FILE}`);
    return [];
  }
  const lines = fs.readFileSync(MANUAL_QUEUE_FILE, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
  return [...new Set(lines)]; // dedupe
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildManualUserPrompt(termName) {
  return `Generate a glossary entry for: "${termName}"

Use the web search tool to ground the definition in current (May 2026) facts. Make 3-4 targeted searches if needed. If after searching you find this term doesn't actually exist or has no meaningful presence in AI builder vocabulary, return an empty JSON array [].

Existing glossary terms (you can reference these in the related[] array):
${existingSlugList()}

Output schema: a JSON array containing EXACTLY ONE entry following the standard schema. The slug should be: "${slugify(termName)}" (use this exact slug unless web search reveals the term is canonically known by a different name, in which case use the canonical name).

Return ONLY the JSON array.`;
}

async function generateManualTerms() {
  const queue = readManualQueue();
  if (queue.length === 0) {
    console.log("[glossary-cron] manual queue is empty, nothing to generate");
    return;
  }
  console.log(`[glossary-cron] manual queue: ${queue.length} term(s)`);

  const seenSlugs = new Set();
  const valid = [];
  const skipped = [];

  for (const termName of queue) {
    const candidateSlug = slugify(termName);
    if (existingSlugs.has(candidateSlug)) {
      skipped.push({ termName, reason: "already exists" });
      console.log(`  - "${termName}" (slug: ${candidateSlug}) — already exists, skipping`);
      continue;
    }

    console.log(`  - "${termName}" (slug: ${candidateSlug}) — generating...`);
    const userPrompt = buildManualUserPrompt(termName);
    const response = await callModel(TNB_AUDIENCE_PROMPT, userPrompt, cfg.maxTokens, cfg.maxWebSearches);
    const rawText = extractTextFromResponse(response);
    if (!rawText) {
      console.warn(`    ! failed to extract text for "${termName}", skipping`);
      skipped.push({ termName, reason: "no text in response" });
      continue;
    }
    const parsed = parseJsonArray(rawText);
    if (!parsed || parsed.length === 0) {
      console.warn(`    ! empty/missing JSON array for "${termName}" — model may have determined term doesn't exist`);
      skipped.push({ termName, reason: "empty result (term may not exist)" });
      continue;
    }

    const result = validateCandidate(parsed[0], seenSlugs);
    if (!result.ok) {
      console.warn(`    ! validation failed for "${termName}": ${result.reasons.join(", ")}`);
      skipped.push({ termName, reason: `validation: ${result.reasons.join(", ")}` });
      continue;
    }
    valid.push(result.term);
    seenSlugs.add(result.term.slug);
    console.log(`    ✓ generated as ${result.term.slug}`);
  }

  if (valid.length > 0) {
    filterRelatedSlugs(valid, seenSlugs);
    const written = writeTerms(valid);
    console.log(`[glossary-cron] wrote ${written.length} MD files from manual queue:`);
    for (const s of written) console.log(`  + ${s}.md`);
  }

  if (skipped.length > 0) {
    console.log(`[glossary-cron] skipped ${skipped.length} from manual queue:`);
    for (const s of skipped) console.log(`  - "${s.termName}" — ${s.reason}`);
  }

  console.log(`[glossary-cron] done. mode=manual, written=${valid.length}, skipped=${skipped.length}`);
}

// ---------- dispatch ----------

if (MODE === "manual") {
  await generateManualTerms();
} else {
  await generateBatch();
}
