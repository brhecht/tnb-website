---
slug: multi-turn-conversation
term: Multi-turn conversation
type: Concept
topic: Patterns & Practices
familiarity: Common
aliases:
  - multi-turn chat
  - conversational context
  - turn-by-turn prompting
  - chat history
related:
  - context-window
  - memory-management
  - prompt-engineering
  - token-budget
  - context-compaction
dateAdded: '2026-05-02'
shortDef: >-
  A back-and-forth interaction where the full prior exchange is passed back to
  the model on every turn. The model can reference what was said earlier, but
  the growing history also grows your costs and context usage.
---
Multi-turn conversations are how most AI products feel natural to use. The model appears to remember what you said earlier because the entire conversation history is included in each new request. It's not memory in a human sense; it's just context. The model re-reads the transcript every time it responds.

This has real practical consequences. Every turn adds tokens to the context, and longer conversations become more expensive and can eventually hit the model's context window limit (the maximum amount of text it can process at once). Context compaction techniques, like summarizing earlier turns, are used to manage this.

For product builders, the multi-turn pattern also creates UX questions worth designing around: when should the model start fresh versus carry context forward? What happens when a user contradicts something they said earlier? How do you handle sensitive data that should not persist? These are judgment calls that belong in your design, not in the model.
