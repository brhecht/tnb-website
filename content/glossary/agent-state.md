---
slug: agent-state
term: Agent state
type: Concept
topic: Agents & Automation
familiarity: Common
aliases:
  - agent context state
  - workflow state
  - execution state
related:
  - agent-memory
  - agentic-loop
  - orchestration
  - langgraph
  - memory-layer
dateAdded: '2026-05-02'
shortDef: >-
  The data an agent carries about its current task: what it knows, what it has
  done, what it's waiting for. Maintaining and passing state correctly is what
  lets a multi-step agent pick up where it left off instead of starting over.
---
When an agent works through a multi-step task, it needs to track more than just the conversation. It needs to know which steps it has completed, what tools returned, which decisions it made and why, and what still needs to happen. All of that together is the agent's state.

State management is one of the hardest practical problems in building production agents. If state is lost between steps, the agent has to redo work or makes decisions without knowing what already happened. If state grows unbounded, it eventually overflows the model's context window. Different frameworks handle this differently: LangGraph uses an explicit state graph with checkpointing (saving state at each step so you can roll back), while simpler frameworks pass state as plain variables between function calls.

Builders new to agents often underestimate state management until they have a twenty-step workflow fail at step seventeen and realize they have no way to resume from where it broke. Good state design upfront, including what to persist, what to summarize, and what to drop, separates prototypes that demo well from agents that work reliably in production.
