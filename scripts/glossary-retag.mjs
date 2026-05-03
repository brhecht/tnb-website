#!/usr/bin/env node
/**
 * Glossary familiarity retag — one-shot recalibration pass.
 *
 * Why this exists: the original cron used a builder-anchored rubric for the
 * `familiarity` field ("Common = most builders know it"). For an AI-builder
 * model that bar is too low — half the corpus landed in Common. Result: the
 * "Hide expert-only" toggle (which only hid Specialist) was leaving 87 Common
 * terms visible, many of them still engineer-flavored (cursor, function-
 * calling, model-weights, ai-engineer, etc.).
 *
 * This script re-classifies all terms against a sharper, non-technical-reader-
 * anchored rubric. Output goes to scripts/retag-proposal.json — a separate
 * apply step (--apply flag) writes the new familiarity values into each MD
 * file's frontmatter. Two-step is intentional: you spot-check the diff before
 * committing 287 file changes.
 *
 * Usage:
 *   node scripts/glossary-retag.mjs           # propose only — writes retag-proposal.json + diff
 *   node scripts/glossary-retag.mjs --apply   # apply proposal to MD files (idempotent rewrite)
 *
 * Cost: one Anthropic call, ~60k input tokens + ~6k output. ~$1-2.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Anthropic from "@anthropic-ai/sdk";

const MODE = process.argv.includes("--apply") ? "apply" : "propose";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "glossary");
const PROPOSAL_FILE = path.join(ROOT, "scripts", "retag-proposal.json");
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const MODEL = "claude-sonnet-4-6";
const FAMILIARITIES = ["Common", "Emerging", "Specialist"];

// ---------- read existing corpus ----------

function readCorpus() {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const out = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const parsed = matter(raw);
    if (parsed.data?.slug && parsed.data?.term) {
      out.push({
        file,
        slug: String(parsed.data.slug),
        term: String(parsed.data.term),
        type: String(parsed.data.type),
        topic: String(parsed.data.topic),
        currentFamiliarity: String(parsed.data.familiarity || ""),
        shortDef: String(parsed.data.shortDef || ""),
      });
    }
  }
  return out.sort((a, b) => a.slug.localeCompare(b.slug));
}

// ---------- propose mode: call Anthropic with sharp rubric ----------

const SYSTEM_PROMPT = `You re-classify glossary terms by who actually needs them.

The audience for The New Builder glossary is mixed — some readers are technical
builders, but a meaningful slice are non-technical curious readers (founders,
PMs, marketers, journalists, operators) who want to be conversant in the AI
moment without becoming engineers. The familiarity tier anchors on the
non-technical reader's likely encounter pattern.

Mental model for naming (used in chat, not in this output): the three tiers
function as Beginner / Builder / Engineer. The internal labels remain
"Common" / "Emerging" / "Specialist" — return those exact strings — but
think of the audience as Beginner / Builder / Engineer when classifying.

TARGET DISTRIBUTION: roughly thirds. Aim for ~85-95 Common, ~95-110 Emerging,
~85-100 Specialist. The corpus is 287 terms. Don't artificially force the
distribution, but don't be stingy with Common — a beginner-friendly tier with
only 15 entries is too thin to be useful as a browsing surface.

THREE TIERS — strict definitions:

COMMON / BEGINNER (~85-95 terms): A curious non-technical reader (founder, PM,
marketer, journalist, operator) would plausibly encounter this term in normal
AI-moment discourse — tech podcasts, founder content, business news, AI
newsletters, conversations with builder friends — and benefit from a
plain-English entry. They don't need to build with it; they need to be
conversant. This tier should INCLUDE:
  - Mainstream-reaching tools the audience hears about (Cursor, Perplexity,
    Claude Code, Copilot, ChatGPT, Replit, Notion AI, NotebookLM, Sora, Bolt,
    Custom GPTs, Claude Artifacts, Claude Projects)
  - Major model families and named models (Claude family, GPT family, Gemini
    family, Llama family, DeepSeek, o3/o4)
  - Concepts at conversational level (RAG, system prompt, hallucination,
    jailbreak, alignment, agentic coding, agent memory at high level,
    fine-tuning at high level, MCP server at high level, vibe coding,
    prompt injection, generative AI, LLM, foundation model, frontier
    model, context window, multimodal)
  - Roles broadly named in builder/business discourse (AI engineer, prompt
    engineer, head of AI, ML engineer, AI product manager, applied AI
    engineer)
  - Business strategy concepts a founder would care about (AI wrapper, AI
    cost of goods sold / AI COGS, GTM motion at high level, freemium AI,
    seat-based vs credit-based pricing — these are board-level conversations)
  - Mainstream regulatory / policy (EU AI Act, AI safety, red teaming at
    high level)

EMERGING / BUILDER (~95-110 terms): Working builder vocabulary. Useful for
someone actively shipping AI products or making technical tooling/architecture
decisions. Shows up in dev tooling blog posts, hiring posts for builder roles,
hands-on tutorials, builder forums. A non-technical reader CAN look it up but
won't usefully deploy it. Examples: agent observability, agent handoff, agent
state, agent framework, agentic workflow, agentic IDE, function calling, tool
calling pattern, structured output, prompt chaining, role prompting, task
decomposition, multi-turn conversation design, vector database, embedding
model, fine-tuning (when paired with implementation), Hugging Face, Vercel,
Supabase, Figma, JetBrains AI, Tabnine, Amazon Q Developer, Google AI Studio,
LLM benchmarks, base model vs instruct model, model card, model weights at
implementation level, design-to-code, iterative prototyping, human-in-the-loop
design, Cursor rules, model serving (introductory), red teaming as a practice.

SPECIALIST / ENGINEER (~85-100 terms): Engineer/researcher deep cut.
Under-the-hood mechanics, infra primitives, niche tools, or research jargon.
Useful only to people directly implementing AI systems at the framework,
model, or infra layer. Examples: KV cache, attention mechanism, transformer
architecture internals, mechanistic interpretability, DPO, SFT, RLHF, vLLM,
continuous batching, speculative decoding, LoRA, quantization, mixture of
experts, world model, scaling laws, post-training, agent checkpoint, agent
scaffold, model distillation, A2A protocol, Constitutional AI, vLLM, e2b,
git worktree, KV cache, LPU, TTFT, OpenTelemetry for AI, serverless inference,
ReAct prompting (the algorithm), tree of thought, OpenAI-compatible API,
inference API plumbing, GPU cloud specifics like CoreWeave, model-internal
constants like temperature/token/sampling parameters, fine-grained safety
internals, prompt-injection technique deep dives, niche frameworks
(smolagents, Windsurf Cascade specifics).

CRITICAL CALIBRATION RULES:
- The bar for Common is "would a beginner ENCOUNTER this in AI-moment
  discourse and benefit from looking it up?" — NOT "is this term in the New
  York Times?" Tech podcasts, founder Twitter, AI newsletters, builder Slack
  channels all count as discourse a curious reader is exposed to.
- Tool names that have crossed into beginner-encounter territory (Cursor,
  Perplexity, Claude Code, Replit, Bolt, NotebookLM) → Common. Tool names
  that are still purely builder-internal (Tabnine, JetBrains AI, Amazon Q
  Developer, e2b) → Emerging or Specialist.
- Roles that show up in mainstream tech press hiring/career discourse (AI
  engineer, prompt engineer, head of AI, ML engineer, AI PM, applied AI
  engineer) → Common. Specialized engineering roles (AI safety engineer, AI
  red teamer, AI research scientist, AI ethicist) → Emerging or Specialist.
- Concepts at conversational level (what is RAG, what is fine-tuning, what
  is an agent) → Common. Same concepts at implementation level (RAG with
  reranking, fine-tuning data prep, agent state machine design) → Emerging.
  When the term itself IS the implementation detail (KV cache,
  speculative decoding) → Specialist.
- Model internals split: high-level model families and capabilities → Common.
  Model architecture internals (transformer layers, attention, scaling
  laws, mixture of experts) → Specialist. Mid-level (base vs instruct model,
  model card, fine-tuning) → Emerging.
- Patterns/techniques split: named at high level (prompt engineering, system
  prompt, agentic coding) → Common. Named at implementation level (function
  calling, tool calling pattern, structured output, prompt chaining, role
  prompting) → Emerging. Algorithm names (ReAct, tree-of-thought) →
  Specialist.
- When in doubt between Common and Emerging: ask "would the typical TNB
  reader (founder/PM/curious operator) hit this term in their normal
  information diet?" If yes → Common. If they'd only hit it when they go
  hands-on → Emerging.

OUTPUT FORMAT — strict JSON, no prose, no markdown fences:
{
  "classifications": [
    { "slug": "ai-agent", "familiarity": "Common", "reason": "ubiquitous in mainstream AI discourse" },
    { "slug": "kv-cache", "familiarity": "Specialist", "reason": "model-internal optimization" }
  ]
}

Every input slug must appear exactly once in the output. Reasons should be
≤15 words. Familiarity must be exactly one of: "Common", "Emerging", "Specialist".`;

async function proposeRetag(corpus) {
  if (!ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY env var is required for propose mode");
    process.exit(1);
  }
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  // Compact term list for the prompt — slug + term + type + topic + shortDef.
  // We include shortDef so the model has signal about what the term actually
  // means rather than just guessing from slug.
  const termList = corpus
    .map((t) => `- ${t.slug} | ${t.term} (${t.type}, ${t.topic}) — ${t.shortDef}`)
    .join("\n");

  const userPrompt = `Classify each of these ${corpus.length} terms into Common / Emerging / Specialist using the rubric in the system prompt. Output strict JSON only.

TERMS:
${termList}`;

  console.log(`[retag] sending ${corpus.length} terms to ${MODEL}…`);
  const t0 = Date.now();
  const stream = await client.messages.stream({
    model: MODEL,
    max_tokens: 32000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });
  const final = await stream.finalMessage();
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`[retag] response received in ${elapsed}s. usage:`, final.usage);

  // Extract JSON
  const text = final.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("[retag] no JSON found in response:");
    console.error(text.slice(0, 500));
    process.exit(1);
  }
  const parsed = JSON.parse(jsonMatch[0]);
  if (!Array.isArray(parsed.classifications)) {
    console.error("[retag] response missing classifications array");
    process.exit(1);
  }

  // Validate every term got a tier
  const bySlug = new Map(parsed.classifications.map((c) => [c.slug, c]));
  const missing = corpus.filter((t) => !bySlug.has(t.slug));
  const invalid = parsed.classifications.filter(
    (c) => !FAMILIARITIES.includes(c.familiarity),
  );
  if (missing.length > 0) {
    console.error(`[retag] ${missing.length} terms missing from response:`, missing.slice(0, 10).map((t) => t.slug));
    process.exit(1);
  }
  if (invalid.length > 0) {
    console.error(`[retag] ${invalid.length} invalid familiarity values:`, invalid.slice(0, 5));
    process.exit(1);
  }

  return parsed.classifications;
}

// ---------- diff report ----------

function buildDiff(corpus, classifications) {
  const bySlug = new Map(classifications.map((c) => [c.slug, c]));
  const changes = [];
  const unchanged = [];
  for (const t of corpus) {
    const c = bySlug.get(t.slug);
    if (c.familiarity !== t.currentFamiliarity) {
      changes.push({
        slug: t.slug,
        term: t.term,
        from: t.currentFamiliarity,
        to: c.familiarity,
        reason: c.reason || "",
      });
    } else {
      unchanged.push({ slug: t.slug, familiarity: c.familiarity });
    }
  }

  // Distribution before/after
  const distBefore = { Common: 0, Emerging: 0, Specialist: 0 };
  const distAfter = { Common: 0, Emerging: 0, Specialist: 0 };
  for (const t of corpus) {
    distBefore[t.currentFamiliarity] = (distBefore[t.currentFamiliarity] || 0) + 1;
    distAfter[bySlug.get(t.slug).familiarity]++;
  }

  return { changes, unchanged, distBefore, distAfter };
}

// ---------- apply mode: write proposal to MD files ----------

function applyProposal(corpus, classifications) {
  const bySlug = new Map(classifications.map((c) => [c.slug, c]));
  let touched = 0;
  for (const t of corpus) {
    const c = bySlug.get(t.slug);
    if (!c) {
      console.warn(`[apply] no classification for ${t.slug}, skipping`);
      continue;
    }
    if (c.familiarity === t.currentFamiliarity) continue;
    const filepath = path.join(CONTENT_DIR, t.file);
    const raw = fs.readFileSync(filepath, "utf8");
    const parsed = matter(raw);
    parsed.data.familiarity = c.familiarity;
    const rebuilt = matter.stringify(parsed.content, parsed.data);
    fs.writeFileSync(filepath, rebuilt, "utf8");
    touched++;
  }
  return touched;
}

// ---------- main ----------

async function main() {
  const corpus = readCorpus();
  console.log(`[retag] loaded ${corpus.length} terms from ${CONTENT_DIR}`);

  if (MODE === "propose") {
    const classifications = await proposeRetag(corpus);
    fs.writeFileSync(
      PROPOSAL_FILE,
      JSON.stringify({ generatedAt: new Date().toISOString(), classifications }, null, 2),
      "utf8",
    );
    console.log(`[retag] wrote ${classifications.length} classifications to ${PROPOSAL_FILE}`);

    const { changes, distBefore, distAfter } = buildDiff(corpus, classifications);
    console.log("\n=== DISTRIBUTION ===");
    console.log("Before:", distBefore);
    console.log("After: ", distAfter);
    console.log(`\n=== ${changes.length} CHANGES PROPOSED ===`);
    // Group changes by transition
    const byTransition = {};
    for (const c of changes) {
      const key = `${c.from} → ${c.to}`;
      (byTransition[key] = byTransition[key] || []).push(c);
    }
    for (const [transition, items] of Object.entries(byTransition).sort()) {
      console.log(`\n${transition} (${items.length}):`);
      for (const c of items) {
        console.log(`  ${c.slug.padEnd(38)} ${c.reason}`);
      }
    }
    console.log(`\n[retag] propose mode complete. Review proposal then run with --apply.`);
  } else if (MODE === "apply") {
    if (!fs.existsSync(PROPOSAL_FILE)) {
      console.error(`[retag] no proposal file at ${PROPOSAL_FILE}. Run propose mode first.`);
      process.exit(1);
    }
    const data = JSON.parse(fs.readFileSync(PROPOSAL_FILE, "utf8"));
    const touched = applyProposal(corpus, data.classifications);
    console.log(`[retag] applied to ${touched} files (idempotent — unchanged terms skipped)`);
  }
}

main().catch((err) => {
  console.error("[retag] FAILED:", err);
  process.exit(1);
});
