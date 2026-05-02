---
slug: ai-rules-file
term: AI rules file
type: Concept
topic: Patterns & Practices
familiarity: Emerging
aliases:
  - .cursorrules
  - rules.md
  - AI instructions file
  - cursor rules
  - .windsurfrules
  - .clinerules
related:
  - claude-md
  - agents-md
  - system-prompt
  - context-engineering
  - agentic-ide
  - spec-driven-development
dateAdded: '2026-05-02'
shortDef: >-
  A file in your project repo that sets persistent rules, preferences, and
  context for your AI coding tool. The tool reads it automatically on every
  session, so your conventions don't have to be repeated in every prompt.
---
AI coding tools like Cursor, Windsurf, and Cline look for specific files in your project directory to load persistent instructions. In Cursor these are called `.cursorrules`; other tools have their own equivalents. The idea is the same: write your coding standards, project context, architectural decisions, and preferences once, and have the tool respect them without re-prompting every session.

This pattern extends the concept of a system prompt down to the project level. Instead of the AI starting from scratch each session, it starts already knowing your stack, naming conventions, how you handle errors, which packages you prefer, and what patterns to avoid. That consistency makes AI-generated code much more likely to fit your existing codebase without manual cleanup.

CLAUDE.md and AGENTS.md are standardized versions of this pattern for Claude Code and multi-agent setups respectively. As these conventions mature, rules files are becoming a first-class artifact of AI-assisted development: something teams version-control, review, and maintain alongside the rest of their codebase. Good rules files are increasingly seen as a form of institutional knowledge about how the team builds.
