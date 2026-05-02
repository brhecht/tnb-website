---
slug: task-decomposition
term: Task decomposition
type: Concept
topic: Patterns & Practices
familiarity: Common
aliases:
  - problem decomposition
  - sub-task planning
  - task breakdown
related:
  - prompt-chaining
  - orchestration
  - subagents
  - spec-driven-development
  - agentic-engineering
dateAdded: '2026-05-02'
shortDef: >-
  Breaking a large, complex task into smaller, well-defined subtasks before
  handing them to an AI system. Better decomposition means cleaner context, more
  predictable outputs, and easier debugging.
---
Models do better on focused tasks than sprawling ones. Task decomposition is the practice of taking a big goal, like 'build a feature' or 'research this topic and write a report', and explicitly splitting it into steps before any AI work begins. Each step gets its own prompt, its own context, and its own success criteria.

This matters even more in agentic workflows, where a poorly framed initial task can cause the agent to go off in the wrong direction for many steps before anyone notices. A well-decomposed task lets you inspect the work at each stage, catch errors early, and isolate exactly where things went wrong when they do.

Good decomposition is a skill that compounds. Engineers who work with coding agents daily develop intuitions for which kinds of subtasks models handle reliably, like implementing a known algorithm or writing tests for a specified interface, versus which need more human involvement, like architectural decisions or tasks with implicit business logic. Learning those boundaries is part of what it means to work effectively with AI systems.
