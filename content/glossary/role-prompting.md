---
slug: role-prompting
term: Role prompting
type: Concept
topic: Patterns & Practices
familiarity: Common
aliases:
  - persona prompting
  - system role
  - character prompting
  - role-based prompting
related:
  - system-prompt
  - prompt-engineering
  - few-shot-prompting
  - grounding
dateAdded: '2026-05-02'
shortDef: >-
  Assigning the model a specific role or persona in the system prompt, such as
  'You are a senior security engineer' or 'You are a friendly onboarding
  assistant'. It shapes tone, depth, and the lens the model applies to every
  response.
---
Role prompting works because model behavior is highly sensitive to framing. Telling the model it is a domain expert, a specific type of advisor, or a character with defined values changes what it emphasizes, how it communicates, and what it treats as relevant. A 'cautious legal reviewer' produces different output than a 'startup-friendly contract assistant', even on the same document.

The system prompt (the hidden instruction block at the start of a conversation) is the most common place to assign a role. A well-crafted role definition does several things at once: it sets tone, establishes expertise scope, defines how the model should handle edge cases, and often implicitly limits what the model should refuse or caveat.

Role prompting has limits. The model doesn't become a different model because you told it to act like one. It doesn't gain knowledge it doesn't have, and it can still produce hallucinations regardless of the role. Treating role prompting as one tool among many, rather than as a magic fix, gives you a more realistic picture of what it actually changes.
