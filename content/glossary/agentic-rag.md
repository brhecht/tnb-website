---
slug: agentic-rag
term: Agentic RAG
type: Concept
topic: Agents & Automation
familiarity: Emerging
aliases:
  - agent-based RAG
  - dynamic retrieval
related:
  - rag
  - retrieval-augmented-generation
  - tool-use
  - agent-memory
  - vector-database
dateAdded: '2026-05-02'
shortDef: >-
  An evolution of RAG (retrieval-augmented generation) where an agent controls
  when and what to retrieve, rather than doing a single fixed lookup. The agent
  can decide to search again, refine its query, or pull from multiple sources
  based on what it learns mid-task.
---
Standard RAG does a single retrieval step: embed the user's question, find the closest documents in a vector database (a database that stores information as numerical representations), and inject them into the model's context. It's a one-shot lookup. Agentic RAG gives the agent control over retrieval as a tool it can call any number of times throughout a task.

This matters for complex questions that require iterative research. If an initial search returns documents that mention a subtopic the agent didn't originally think to query, the agent can run a second retrieval targeting that subtopic. If the first results are low-confidence, the agent can reformulate the search. The retrieval step becomes part of the reasoning loop, not a preprocessing step that happens before reasoning starts.

Teams navigating from standard RAG to Agentic RAG report that it handles edge cases better and produces more complete answers on complex questions, at the cost of higher latency and more token usage per query. Common implementations use LlamaIndex or LangGraph to wire retrieval tools into the agent's tool set. Document agents, where each document gets its own specialized agent for answering questions and summarizing, are one variant of this pattern.
