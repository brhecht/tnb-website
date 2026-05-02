---
slug: agent-handoff
term: Agent handoff
type: Concept
topic: Agents & Automation
familiarity: Emerging
aliases:
  - agent transfer
  - agent delegation
  - handoff pattern
related:
  - multi-agent
  - orchestration
  - subagents
  - a2a-protocol
  - openai-agents-sdk
dateAdded: '2026-05-02'
shortDef: >-
  The moment when one agent transfers control and relevant context to another
  agent better suited to continue the task. Used in multi-agent systems to route
  work to specialized agents without losing the thread of what was happening.
---
In a multi-agent system, no single agent handles everything. A handoff is the mechanism by which one agent decides it's done with its portion of a task and passes control to another. Along with control, it passes the conversation history, any state variables, and any instructions the receiving agent needs to pick up where the sender left off.

The OpenAI Agents SDK made handoffs a first-class primitive: each agent is defined with a list of other agents it can hand off to, and the transition is explicit and tracked. This is different from an orchestrator calling a subagent, where a central coordinator always maintains overall control. In a handoff model, the receiving agent becomes the active agent for the next part of the conversation.

Handoffs matter for reliability and auditability. If the context passed is incomplete or the receiving agent doesn't have the right tools, the task can silently degrade after the transfer. Builders building production multi-agent systems spend a lot of time designing what information gets carried through a handoff and testing that the receiving agent handles edge cases the sending agent wouldn't encounter.
