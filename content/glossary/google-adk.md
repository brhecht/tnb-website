---
slug: google-adk
term: Google ADK
type: Tool
topic: Agents & Automation
familiarity: Emerging
aliases:
  - Agent Development Kit
  - Google Agent Development Kit
related:
  - agent-framework
  - multi-agent
  - a2a-protocol
  - orchestration
  - supervisor-pattern
dateAdded: '2026-05-02'
shortDef: >-
  Google's open-source framework for building multi-agent systems, released in
  April 2025. Organizes agents as a hierarchical tree where a root agent
  delegates to sub-agents, and has built-in support for the A2A protocol for
  cross-framework agent communication.
---
Google ADK (Agent Development Kit) structures multi-agent systems as a tree rather than a flat list or a pipeline. A root agent receives the task and delegates down to sub-agents, which can in turn have their own sub-agents. Think of it as an org chart. Each level of the tree handles a different layer of the problem, with the root coordinating the overall work.

The standout feature is native A2A (Agent-to-Agent) protocol support. An ADK agent can discover and call agents built in other frameworks like LangGraph or CrewAI through A2A's standardized task interface. This makes ADK particularly useful for enterprises building systems where agents from different vendors or teams need to collaborate without custom integration work for every pairing.

ADK integrates tightly with Google Cloud infrastructure: Vertex AI, Gemini models, and Google Cloud services. It's optimized for Gemini but supports other model providers. Builders already in the Google Cloud ecosystem will find the setup natural. For those outside it, the A2A protocol support may still be the reason to pay attention, as cross-framework interoperability becomes more important as multi-agent systems grow in complexity.
