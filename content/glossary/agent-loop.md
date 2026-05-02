---
slug: agent-loop
term: Agent loop
type: Concept
topic: Agents & Automation
familiarity: Common
aliases:
  - run loop
  - agent execution loop
  - autonomous loop
related:
  - agentic-loop
  - react-prompting
  - tool-use
  - agent-state
  - guardrails
dateAdded: '2026-05-02'
shortDef: >-
  The continuous cycle an agent runs through when working on a task: perceive
  inputs, reason about what to do, act, observe results, and repeat. The loop
  runs until the task is complete, a stopping condition is met, or a limit is
  hit.
---
An agent loop is the heartbeat of any agentic system. Each iteration, the agent gets fresh context (which might include tool results, user messages, or environment observations), reasons about the best next action, takes that action, and receives new input to start the next iteration. The cycle continues until the agent signals completion or a hard stop is triggered.

This is closely related to the agentic loop concept but is often used more specifically to describe the technical execution structure: the actual while-loop (a programming construct that repeats until a condition is met) or recursive call pattern in the code that drives an agent forward. Frameworks like LangGraph make the loop explicit as a graph with cycles. The OpenAI Agents SDK and smolagents wrap it in a simpler run abstraction.

Controlling the loop is critical for cost and safety. An unbounded loop can run hundreds of model calls before timing out, burning through API credits with no useful output. Builders always set a maximum iteration count, track cost per run, and build in stopping conditions that the agent itself can trigger. An agent that knows when to stop is as important as one that knows what to do.
