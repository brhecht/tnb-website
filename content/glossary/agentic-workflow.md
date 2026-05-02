---
slug: agentic-workflow
term: Agentic workflow
type: Concept
topic: Agents & Automation
familiarity: Common
aliases:
  - agentic automation
  - agent-driven workflow
related:
  - agentic-loop
  - orchestration
  - multi-agent
  - task-decomposition
  - human-in-the-loop
dateAdded: '2026-05-02'
shortDef: >-
  A sequence of steps where an AI agent plans, acts, and adjusts on its own
  rather than following a fixed script. The agent decides what to do next based
  on what happened in the previous step.
---
Traditional automation follows rules: if X happens, do Y. Agentic workflows are different. The AI agent reads the situation, forms a plan, takes an action, checks the result, and decides what comes next. It can branch, retry, or change direction mid-task without a human re-prompting it.

The distinction matters in practice. A rule-based workflow that hits an unexpected response will break or stall. An agentic workflow can reason through the ambiguity, try a different tool, or ask for clarification. That flexibility is what makes it useful for real-world tasks that don't follow a clean, predictable path.

Builders encounter this term when setting up automations in tools like n8n, designing a multi-step agent in LangGraph, or describing what Claude Code is doing when it works through a coding task. The word 'agentic' signals that the workflow has some degree of autonomous decision-making baked in, not just a chain of hardcoded steps.
