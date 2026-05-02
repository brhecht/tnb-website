---
slug: agentic-coding
term: Agentic coding
type: Concept
topic: Agents & Automation
familiarity: Common
aliases:
  - autonomous coding
  - agent-driven software development
related:
  - coding-agent
  - agentic-ide
  - vibe-coding
  - claude-code
  - devin
dateAdded: '2026-05-02'
shortDef: >-
  A software development approach where AI agents don't just suggest code but
  autonomously plan, write, test, debug, and iterate across a codebase. The
  developer shifts from writing code to directing and reviewing what the agent
  produces.
---
Agentic coding sits between vibe coding (prompting an AI and accepting whatever it produces) and traditional development. The agent is given a goal, not just a prompt. It reads relevant files, reasons about what needs to change, writes code, runs tests, reads the output, and loops until the goal is met or it surfaces a question it can't answer without human input.

The developer's role changes substantially. Rather than writing code line by line, you're defining goals, reviewing agent-produced plans before execution, inspecting diffs (summaries of what changed in the code), and deciding whether to approve, redirect, or override. The human stays in control of what ships but delegates the execution work. Some describe it as moving from driver to navigator.

Agentic coding requires different habits from vibe coding. You need to give the agent enough context upfront (what the codebase does, what constraints to respect, what tests need to pass), watch for the agent accumulating technical debt (shortcuts that make future changes harder) by making locally reasonable but globally poor decisions, and build in review checkpoints for non-trivial changes. The agents that work best in this mode are the ones with large context windows and reliable code execution environments.
