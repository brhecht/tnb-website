---
slug: retrieval-augmented-generation
term: Retrieval-augmented generation
type: Concept
topic: Patterns & Practices
familiarity: Common
aliases:
  - RAG
  - retrieval augmented generation
related:
  - rag
  - vector-database
  - embeddings
  - grounding
  - context-engineering
  - memory-layer
dateAdded: '2026-05-02'
shortDef: >-
  A pattern where you fetch relevant documents or data at query time and inject
  them into the model's context before it answers. Keeps responses grounded in
  actual content without requiring retraining.
---
RAG separates the model from the knowledge. Instead of expecting the LLM to remember everything from training, you maintain an external knowledge base, often a vector database (a database optimized for finding semantically similar content), and retrieve the most relevant pieces at the moment a question is asked. Those retrieved chunks go into the prompt alongside the user's question.

The core appeal is freshness and control. You can update the knowledge base without retraining the model. You can scope it to specific domains, customer data, or internal documentation. And because the model is answering based on retrieved text you can see, it's easier to verify and audit than pure model memory.

RAG has its own failure modes. Retrieval quality matters enormously: if you pull the wrong chunks, the model will confidently answer based on the wrong material. More advanced implementations layer in re-ranking, hybrid search, and query rewriting to improve what gets retrieved before it reaches the model.
