---
slug: supervisor-pattern
term: Supervisor pattern
type: Concept
topic: Agents & Automation
familiarity: Emerging
aliases:
  - supervisor agent
  - orchestrator-worker pattern
  - manager-agent pattern
related:
  - multi-agent
  - orchestration
  - subagents
  - parallel-agents
  - agent-handoff
dateAdded: '2026-05-02'
shortDef: >-
  A multi-agent architecture where one 'supervisor' agent breaks down a goal,
  delegates subtasks to specialized worker agents, and integrates their outputs.
  The supervisor controls the overall flow; workers handle narrow execution
  tasks.
---
In the supervisor pattern, one agent sits above the others. It receives the user's goal, decomposes it into subtasks, decides which worker agent is best suited for each one, dispatches those tasks, and then assembles the results into a final output. Workers are typically specialized: one reads documents, one writes code, one searches the web. They execute their subtask and report back.

This is different from a flat multi-agent setup where all agents are peers. The supervisor gives the system a clear chain of command, which makes debugging easier. When something goes wrong, you can trace it to a specific delegation decision or a specific worker's failure. LangGraph, CrewAI, and Google's ADK (Agent Development Kit) all support this pattern, though each calls it something slightly different.

The tradeoff is that the supervisor becomes a bottleneck and a single point of failure. If the supervisor misdecomposes a task or delegates to the wrong worker, the whole run goes sideways. Teams building production systems using this pattern often invest heavily in testing the supervisor's decomposition logic and in fallback rules for when worker agents fail or return low-confidence outputs.
