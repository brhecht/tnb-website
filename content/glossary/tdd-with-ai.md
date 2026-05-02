---
slug: tdd-with-ai
term: TDD with AI
type: Concept
topic: Patterns & Practices
familiarity: Emerging
aliases:
  - test-driven development with AI
  - red-green TDD
  - AI-assisted TDD
  - test-first AI coding
related:
  - spec-driven-development
  - agentic-engineering
  - evals
  - claude-code
  - vibe-coding
dateAdded: '2026-05-02'
shortDef: >-
  Writing tests before asking the AI to write code, then letting the agent
  iterate until the tests pass. The tests become the specification, giving the
  model a clear, verifiable target rather than an open-ended instruction.
---
Test-driven development (TDD) is the practice of writing a failing test before writing the code to make it pass. With AI coding agents, this pattern becomes especially powerful. Instead of describing what you want in prose and hoping the model interprets it correctly, you define success in code: a test suite that passes when the job is done.

The agent gets a clear, executable goal. It can run the tests, see which ones fail, adjust its code, and keep iterating until everything passes. This tight feedback loop is more reliable than a single-shot code generation because the model can self-correct based on actual test results rather than just its own reasoning.

Builders working with Claude Code, Codex, and similar tools have found that writing tests or at minimum acceptance criteria before handing a task to an agent dramatically improves output quality and reduces the back-and-forth needed to get usable code. The test file is also a useful artifact: if the agent later breaks something while adding a new feature, the existing tests catch it immediately.
