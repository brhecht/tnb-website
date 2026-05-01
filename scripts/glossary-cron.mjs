#!/usr/bin/env node
/**
 * Glossary cron script — bootstrap and weekly modes.
 *
 * Run from GitHub Actions (.github/workflows/glossary-cron.yml).
 * Modes:
 *   - bootstrap: one-time, generate ~30-40 starter terms.
 *   - weekly: ongoing, find ~5-10 NEW terms surfacing in the last week,
 *             dedupe against existing glossary.
 *
 * Calls Anthropic API with web search tool enabled (D2.4 / B1).
 * Outputs structured JSON, validates, writes one MD file per term to
 * content/glossary/[slug].md. The workflow then commits + pushes.
 *
 * Spec: BUILD-SPEC.md (D2.1, D2.2, D2.3, D2.4, D4.3, D4.5, D4.6)
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Anthropic from "@anthropic-ai/sdk";

// ---------- config ----------

const MODE = (process.argv[2] || "weekly").toLowerCase();
const VALID_MODES = ["bootstrap", "weekly"];
if (!VALID_MODES.includes(MODE)) {
  console.error(`Invalid mode: "${MODE}". Use one of: ${VALID_MODES.join(", ")}`);
  process.exit(1);
}

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "glossary");
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY env var is required");
  process.exit(1);
}

const TARGET_COUNT = MODE === "bootstrap" ? 35 : 7;
const MODEL = "claude-sonnet-4-6"; // Sonnet 4.6 — cron-class workload, web-search-capable
const MAX_TOKENS = MODE === "bootstrap" ? 24000 : 8000;
const MAX_WEB_SEARCHES = MODE === "bootstrap" ? 8 : 5;

// ---------- taxonomy (mirror of src/types/glossary.ts) ----------

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
console.log(`[glossary-cron] mode=${MODE}, existing terms=${existing.length}, target=${TARGET_COUNT}`);

// ---------- prompt construction ----------

const SYSTEM_PROMPT = `You are generating glossary entries for The New Builder (TNB), an AI-era builder community. The glossary is a public utility resource at thenewbuilder.ai/glossary.

AUDIENCE: warm readers — already TNB-aware, clicking through from a newsletter link, a Slack reference, a podcast show note, or another part of the site. They have baseline literacy about AI/startups but need plain-English clarity on emerging vocabulary.

SCOPE: terms a TNB-audience builder would reasonably encounter in conversations on TNB Slack, in LinkedIn posts of Brian and active community members (some technical), or while building with AI. Include both established AI/builder vocabulary and emerging terms surfacing in the wild. EXCLUDE: crypto/web3 terms, generic SaaS jargon, generic startup vocabulary unless AI-relevant.

VOICE — TNB-utility (NON-NEGOTIABLE):
- Plain English. Light. Doesn't claim authority.
- "When an AI doesn't just answer once, it keeps going. The model takes an action, sees what happens, decides what to do next, and repeats until the job is done." — that's the target tone.
- NOT encyclopedia voice. NOT "AI guru" voice. Peer-explaining, not lecturing.
- NEVER use em dashes (—). Use commas, colons, semicolons, or sentence breaks instead.
- NEVER use the words "platform" or "movement" to describe TNB or anything else in this domain.
- No "in summary," "to wrap up," "in conclusion."
- No filler like "It's worth noting that..." — just say it.

OUTPUT FORMAT (STRICT):
- Reply with a single JSON array. NO preamble, NO postamble, NO markdown code fences.
- Each array element is a term object with this exact schema:
  {
    "slug": "kebab-case-slug",
    "term": "Term as displayed (capitalize naturally, no all-caps unless acronym)",
    "type": one of ${JSON.stringify(TYPES)},
    "topic": one of ${JSON.stringify(TOPICS)},
    "familiarity": one of ${JSON.stringify(FAMILIARITIES)},
    "aliases": ["array", "of", "alternate names / spellings / expansions"],
    "related": ["array", "of", "related-term-slugs"],
    "shortDef": "2-3 line plain-English definition, ~30-50 words. Self-contained — readable without surrounding context.",
    "longDef": ["paragraph 1", "paragraph 2", "paragraph 3 (optional)"]
  }

LONG-FORM RULES:
- 2 to 4 paragraphs, ~150-400 words total.
- Each paragraph stands alone (single coherent thought).
- First paragraph = the core definition expanded. Subsequent paragraphs = how it shows up in practice, common variations, important caveats, or how it connects to other concepts.
- WRITE SELF-CONTAINED DEFINITIONS. If you reference a term a hobbyist might not know (e.g. "fork", "VS Code", "API"), add a brief inline parenthetical clarification — don't assume the reader knows.
- No bullet lists. No headers. Plain prose.

TAXONOMY GUIDANCE:
- type=Concept: ideas, patterns, practices, protocols (e.g. agentic loop, RAG, vibecoding, MCP)
- type=Tool: software, products, platforms, services (e.g. Cursor, Claude Code, Vercel, Lovable)
- type=Role: job titles or functional roles (e.g. FDE, AI engineer, prompt engineer)
- topic: assign exactly ONE. If a term genuinely straddles, pick the most central topic and use the related[] array for cross-cluster relationships.
- familiarity:
  - Common = most builders know this; foundational vocabulary (LLM, API, context window today)
  - Emerging = actively being adopted; you're not behind if you don't know it yet (FDE, agentic loop, MCP today)
  - Specialist = niche; only relevant if doing specific work (RLHF internals, mixture-of-experts architecture)

ALIASES:
- Include alternate spellings, full-form expansions of acronyms (e.g. for "MCP" include "Model Context Protocol"), and common variant phrasings.
- DO NOT include the term itself in aliases.

RELATED TERMS:
- Suggest 2-5 related-term slugs that the reader might also want to look up.
- For BOOTSTRAP: refer to other slugs you are generating in this batch (use the slugs you're about to assign). Cross-references self-resolve when the array is parsed.
- For WEEKLY: refer to slugs from the existing-glossary list provided in the user message, OR to slugs of other terms in this batch.
- DO NOT invent slugs that don't correspond to actual terms (existing or in this batch).

SLUG FORMAT:
- All lowercase.
- Hyphen-separated.
- ASCII only.
- No leading/trailing hyphens.
- Examples: "agentic-loop", "fde", "mcp", "claude-code", "context-window".`;

function buildUserPrompt() {
  if (MODE === "bootstrap") {
    return `Use the web search tool to ground your output in current (May 2026) AI/builder vocabulary. Make multiple searches as needed.

Generate a starter set of ~${TARGET_COUNT} terms a TNB-audience builder would expect to find in this glossary. Aim for breadth: cover the core taxonomy meaningfully, not just the obvious 10. Mix Common/Emerging/Specialist (most should be Common or Emerging — Specialist sparingly).

Distribute across ALL ${TOPICS.length} topics where possible. It's fine if some topics have fewer entries than others — go where the actual builder vocabulary is.

Return ONLY the JSON array. No prose around it.`;
  }
  // weekly
  const existingSlugList = existing
    .map((t) => `${t.slug} (${t.type}, ${t.topic})`)
    .sort()
    .join("\n");
  return `Use the web search tool to find AI/builder terms that have emerged or risen significantly in usage in the last 7-14 days (early-to-mid May 2026 zeitgeist). Focus on terms a TNB-audience builder would encounter that they might need a precise definition of.

DO NOT DUPLICATE the existing glossary — these terms are already in:

${existingSlugList || "(empty — no existing terms yet)"}

Generate ~${TARGET_COUNT} NEW terms not in the list above. If you can't find that many genuinely new and relevant terms, return fewer — quality over quota.

Return ONLY the JSON array. No prose around it.`;
}

// ---------- API call ----------

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

console.log(`[glossary-cron] calling Anthropic API (model=${MODEL}, max_tokens=${MAX_TOKENS}, streaming)...`);

// Use streaming because long web-search-grounded calls can exceed the SDK's
// 10-minute synchronous threshold. .finalMessage() reassembles the streamed
// chunks into the same shape messages.create() would have returned, so the
// downstream parsing logic is unchanged.
const stream = client.messages.stream({
  model: MODEL,
  max_tokens: MAX_TOKENS,
  system: SYSTEM_PROMPT,
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: MAX_WEB_SEARCHES,
    },
  ],
  messages: [
    {
      role: "user",
      content: buildUserPrompt(),
    },
  ],
});
const response = await stream.finalMessage();

console.log(`[glossary-cron] response stop_reason=${response.stop_reason}, content blocks=${response.content.length}`);
console.log(`[glossary-cron] usage: input=${response.usage.input_tokens}, output=${response.usage.output_tokens}`);

// ---------- parse ----------

// Extract the final assistant text (after any tool_use / tool_result rounds).
// Anthropic returns content blocks; we want the text from the final assistant turn.
const textBlocks = response.content.filter((b) => b.type === "text");
if (textBlocks.length === 0) {
  console.error("[glossary-cron] No text blocks in response. Aborting.");
  console.error(JSON.stringify(response.content, null, 2).slice(0, 2000));
  process.exit(1);
}
let rawText = textBlocks.map((b) => b.text).join("\n").trim();

// Strip markdown code fences if the model wrapped in them despite the prompt.
const fenced = rawText.match(/^```(?:json)?\s*\n([\s\S]*?)\n```\s*$/);
if (fenced) rawText = fenced[1].trim();

// Find the first '[' and last ']' for additional defensiveness against pre/post text.
const firstBracket = rawText.indexOf("[");
const lastBracket = rawText.lastIndexOf("]");
if (firstBracket === -1 || lastBracket === -1 || lastBracket < firstBracket) {
  console.error("[glossary-cron] Could not find JSON array in response. Aborting.");
  console.error("Raw response (first 2000 chars):");
  console.error(rawText.slice(0, 2000));
  process.exit(1);
}
const jsonText = rawText.slice(firstBracket, lastBracket + 1);

let parsed;
try {
  parsed = JSON.parse(jsonText);
} catch (e) {
  console.error("[glossary-cron] JSON parse error:", e.message);
  console.error("First 1000 chars of jsonText:");
  console.error(jsonText.slice(0, 1000));
  process.exit(1);
}

if (!Array.isArray(parsed)) {
  console.error("[glossary-cron] Parsed JSON is not an array. Aborting.");
  process.exit(1);
}
console.log(`[glossary-cron] parsed ${parsed.length} candidate terms from response`);

// ---------- validate ----------

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const existingSlugs = new Set(existing.map((t) => t.slug));
const seenSlugs = new Set(); // dedupe within this batch
const valid = [];
const rejected = [];

for (const t of parsed) {
  const reasons = [];
  if (!t || typeof t !== "object") { rejected.push({ t, reasons: ["not an object"] }); continue; }
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
  if (!FAMILIARITIES.includes(familiarity)) reasons.push(`bad familiarity "${familiarity}"`);
  if (!shortDef) reasons.push("empty shortDef");
  if (longDef.length === 0) reasons.push("empty longDef");
  if (existingSlugs.has(slug)) reasons.push("duplicates existing term");
  if (seenSlugs.has(slug)) reasons.push("duplicate within batch");

  if (reasons.length > 0) {
    rejected.push({ slug, term, reasons });
    continue;
  }
  seenSlugs.add(slug);
  valid.push({ slug, term, type, topic, familiarity, aliases, related, shortDef, longDef });
}

if (rejected.length > 0) {
  console.warn(`[glossary-cron] rejected ${rejected.length} candidates:`);
  for (const r of rejected) {
    console.warn(`  - ${r.slug || "(no slug)"} :: ${r.term || ""} :: ${r.reasons.join(", ")}`);
  }
}

if (valid.length === 0) {
  console.error("[glossary-cron] No valid terms produced. Aborting without writes.");
  process.exit(1);
}

// Filter related[] to only include slugs that exist (existing) OR are in this batch.
const allKnownSlugs = new Set([...existingSlugs, ...seenSlugs]);
for (const t of valid) {
  const filtered = t.related.filter((r) => allKnownSlugs.has(r) && r !== t.slug);
  if (filtered.length !== t.related.length) {
    const dropped = t.related.filter((r) => !filtered.includes(r));
    console.log(`  - ${t.slug}: dropped invalid related slugs: ${dropped.join(", ")}`);
  }
  t.related = filtered;
}

console.log(`[glossary-cron] ${valid.length} valid terms ready to write`);

// ---------- write MD files ----------

if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

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
  const target = path.join(CONTENT_DIR, `${t.slug}.md`);
  fs.writeFileSync(target, md, "utf8");
  written.push(t.slug);
}

console.log(`[glossary-cron] wrote ${written.length} MD files:`);
for (const s of written) console.log(`  + ${s}.md`);

console.log(`[glossary-cron] done. mode=${MODE}, written=${written.length}, rejected=${rejected.length}`);
