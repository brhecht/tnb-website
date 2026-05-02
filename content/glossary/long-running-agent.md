---
slug: long-running-agent
term: Long-running agent
type: Concept
topic: Agents & Automation
familiarity: Emerging
aliases:
  - async agent
  - persistent agent
  - overnight agent
related:
  - background-agent
  - agent-checkpoint
  - agent-state
  - sandboxing
  - per-agent-pricing
dateAdded: '2026-05-02'
shortDef: >-
  An agent that runs for minutes, hours, or longer to complete a task, often
  asynchronously and without a human actively watching. The user submits a task,
  the agent works, and reports back when done.
---
Most early AI tools were synchronous: you type, you wait, you get a response. Long-running agents break that pattern. You submit a task (refactor this module, research this market, generate a week of content) and the agent works in the background, potentially for hours, using compute you're not watching in real time. You come back to results.

Tools like OpenAI Codex CLI, Google Jules, and GitHub Copilot's coding agent mode operate this way. A developer can queue up a task at the end of the day and find a completed pull request (a set of code changes ready for review) in the morning. The appeal is obvious. The challenges are also real: long runs are expensive if something goes wrong early, hard to monitor, and prone to silent failures that only surface in the final output.

Infrastructure for long-running agents is still maturing. Builders need persistent execution environments (the agent can't just be a serverless function with a ten-second timeout), reliable state persistence, cost guardrails that stop a runaway agent before it burns through a month's budget in one night, and notification mechanisms so the agent can surface a blocker rather than silently spinning. Pricing for these agents has moved toward per-task or outcome-based models to reflect the value delivered rather than raw compute consumed.
