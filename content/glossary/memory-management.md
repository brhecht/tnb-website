---
slug: memory-management
term: Memory management
type: Concept
topic: Patterns & Practices
familiarity: Emerging
aliases:
  - agent memory management
  - persistent memory
  - conversational memory
related:
  - agent-memory
  - context-engineering
  - context-window
  - memory-layer
  - context-compaction
  - token-budget
dateAdded: '2026-05-02'
shortDef: >-
  Deciding what information an AI system should remember, for how long, and how
  to retrieve it later. Without intentional memory management, agents forget
  everything when a session ends.
---
LLMs have no persistent memory by default. Every new session starts from zero unless you explicitly give the model information about prior interactions. Memory management is the set of practices and architectural choices that determine what gets stored, summarized, retrieved, and injected into future contexts.

There are different memory types worth distinguishing. Short-term memory is just the current context window. Long-term memory requires writing important facts to an external store, like a database, and retrieving them later. Episodic memory refers to summaries of past conversations. Semantic memory is knowledge the system has indexed about a domain, often via RAG.

For builders, memory management decisions directly affect product behavior and cost. Keeping too much in context inflates token usage and can degrade model performance; keeping too little means the agent can't connect dots across sessions. The most practical starting point is deciding explicitly what facts, preferences, and history are worth persisting, then building retrieval and injection around that.
