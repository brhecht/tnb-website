---
slug: coding-agent
term: Coding agent
type: Concept
topic: Agents & Automation
familiarity: Common
aliases:
  - code agent
  - software engineering agent
  - SWE agent
related:
  - agentic-loop
  - tool-use
  - sandboxing
  - claude-code
  - devin
  - swe-bench
dateAdded: '2026-05-02'
shortDef: >-
  An AI agent built to write, run, test, and fix code autonomously. It goes
  beyond autocomplete by reading your codebase, making changes across files,
  running tests, and iterating until the task is done.
---
A coding agent doesn't just suggest lines of code. It reads relevant files, reasons about what needs to change, writes the changes, runs a build or test suite, interprets the output, and loops back to fix whatever broke. The loop continues until either the task succeeds or the agent surfaces a question it can't resolve on its own.

The shift from copilot (reactive, suggestion-based) to coding agent (proactive, execution-based) is one of the defining changes in developer tooling in 2025. Tools like Claude Code, OpenAI Codex CLI, and Devin operate in this mode. They treat a task description as a goal and work toward it across multiple steps and tool calls.

Builders working with coding agents quickly discover that the bottleneck moves from writing code to reviewing it. The agent can produce a working pull request (a set of code changes ready for review) overnight. The human job becomes reading the output, catching mistakes, and deciding whether the approach is sound.
