---
slug: agent-checkpoint
term: Agent checkpoint
type: Concept
topic: Agents & Automation
familiarity: Specialist
aliases:
  - workflow checkpoint
  - agent state snapshot
  - checkpointing
related:
  - agent-state
  - langgraph
  - human-in-the-loop
  - agentic-loop
  - orchestration
dateAdded: '2026-05-02'
shortDef: >-
  A saved snapshot of an agent's state at a specific point in its execution. If
  the agent fails or needs to pause, it can resume from the last checkpoint
  rather than starting over from scratch.
---
Long-running agents face a reliability problem: a task that takes fifty steps has fifty chances to fail. Without checkpointing, any failure means restarting from zero, re-spending all the API calls and compute. A checkpoint saves the agent's full state at a given step, including what tools returned, what decisions were made, and what remains to be done.

LangGraph has checkpointing built in, including a 'time travel' capability that lets you replay a run from any earlier checkpoint, optionally with modified state. This is valuable not just for failure recovery but for debugging: you can replay a specific decision point with altered inputs to understand why the agent went down a wrong path.

Checkpointing also enables human-in-the-loop workflows that span long time periods. An agent can complete step one, save a checkpoint, and pause for a human to review before continuing. The human might approve, add instructions, or redirect the agent entirely. This pattern is common in enterprise workflows where compliance requires sign-off before high-stakes actions.
