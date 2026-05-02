---
slug: memory-poisoning
term: Memory poisoning
type: Concept
topic: Agents & Automation
familiarity: Specialist
aliases:
  - agent memory attack
  - persistent context manipulation
related:
  - agent-memory
  - indirect-prompt-injection
  - tool-poisoning
  - guardrails
  - memory-layer
dateAdded: '2026-05-02'
shortDef: >-
  An attack where corrupted data is written into an agent's persistent memory,
  causing it to make bad decisions in future tasks. Unlike one-time prompt
  injections, the effect persists across sessions until the memory is cleared.
---
Agents with long-term memory store information across sessions: past actions, learned preferences, user context. Memory poisoning corrupts that store. An attacker who can write to the agent's memory can plant false facts, biased preferences, or hidden instructions that influence every future interaction. The agent acts on the poisoned memory without knowing it's been tampered with.

The attack can be indirect: if an agent reads a malicious document and is designed to summarize and store key information from it, the summary itself might be the poisoned artifact. Future sessions that retrieve that summary get the attacker's instructions bundled with apparently legitimate context. Detection is hard because the poisoned memory looks like ordinary stored data.

Mitigations include treating all external content as untrusted before it enters memory, scanning memory writes for instruction-like content (text that looks like a system prompt rather than a fact), maintaining snapshots so you can roll back to a clean state, and scoping memory retrieval so one user's stored context can't contaminate another's. As agents grow more capable memories, memory security becomes as important as access control.
