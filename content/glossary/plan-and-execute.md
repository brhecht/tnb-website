---
slug: plan-and-execute
term: Plan-and-execute
type: Concept
topic: Agents & Automation
familiarity: Emerging
aliases:
  - plan-act pattern
  - plan-then-execute
  - planner-executor pattern
related:
  - agentic-loop
  - task-decomposition
  - react-prompting
  - orchestration
  - subagents
dateAdded: '2026-05-02'
shortDef: >-
  An agent design pattern where a model first creates a complete plan for a
  task, then hands off execution of each step to a separate (often cheaper)
  model. Separates high-level strategy from tactical execution.
---
Most agents reason and act in an interleaved loop: think about what to do, do it, observe the result, repeat. Plan-and-execute breaks this apart. A high-capability model (the planner) takes the user's goal, decomposes it into a sequence of subtasks, and maps out dependencies. Then a smaller, faster model (the executor) works through each subtask in order. The planner may re-engage at the end to synthesize results or adjust the plan if something failed.

The main advantage is cost and speed. If you use a frontier reasoning model only for planning and a cheaper model for execution, token costs per run can drop significantly. Some implementations report around five times better token efficiency on certain benchmark tasks compared to always looping through the frontier model. The tradeoff is flexibility: a fixed upfront plan can fail if early steps produce unexpected outputs that would require replanning.

This pattern shows up in tools that distinguish between a 'thinking' phase and a 'doing' phase. It's also the conceptual basis for how multi-agent systems often split an orchestrator (which plans) from subagents (which act). Builders use it when tasks are long-horizon, have predictable structure, and where the cost of repeated frontier model calls becomes a real concern.
