---
slug: autogen
term: AutoGen
type: Tool
topic: Agents & Automation
familiarity: Emerging
aliases:
  - AG2
  - Microsoft AutoGen
  - AutoGen framework
related:
  - agent-framework
  - multi-agent
  - crewai
  - orchestration
  - human-in-the-loop
dateAdded: '2026-05-02'
shortDef: >-
  A Microsoft open-source framework for building multi-agent systems where
  agents collaborate through conversation. Best known for conversational agent
  patterns where multiple agents debate, refine, and reach consensus.
---
AutoGen's core idea is that agents are conversational participants. Rather than passing task outputs sequentially like a pipeline, agents in AutoGen talk to each other in a group chat. A GroupChatManager (a coordinator agent) decides who speaks next. This makes it natural for workflows where you want agents to debate approaches, check each other's work, or reach consensus before proceeding.

Version 0.4, released in early 2025 and also called AG2, rewrote the internals to be async-first and event-driven. The original design (v0.2) introduced the concept of a UserProxyAgent, a special agent that stands in for a human in the conversation, making human-in-the-loop feel native to the framework rather than bolted on.

AutoGen excels at quality-sensitive tasks where you can afford extra compute: research workflows, complex code generation with self-debugging loops, and scenarios where multi-agent debate produces better outputs than a single agent pass. It's more expensive per task than simpler frameworks because every agent turn is a full model call with accumulated conversation history. Strategic development has largely shifted toward the broader Microsoft Agent Framework.
