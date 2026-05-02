---
slug: self-reflection
term: Self-reflection
type: Concept
topic: Patterns & Practices
familiarity: Emerging
aliases:
  - self-critique
  - self-correction
  - reflexion
  - iterative refinement
  - AI self-review
related:
  - chain-of-thought
  - react-prompting
  - llm-as-judge
  - output-validation
  - evals
dateAdded: '2026-05-02'
shortDef: >-
  Prompting a model to review and critique its own output before finalizing it.
  The model generates an answer, then evaluates that answer against its own
  reasoning, and optionally revises.
---
Self-reflection prompting takes the evaluation step that LLM-as-judge externalizes and asks the model to perform it on itself. You generate an initial response, then ask the same model (or a second pass) to critique it: 'What did this response get wrong? What's missing? How would you improve it?' The critique feeds back into a revised response.

This pattern works well for tasks with verifiable criteria, like checking whether a code function handles edge cases, whether a summary covers all required points, or whether a legal clause contains required language. The model can often spot its own errors when explicitly asked to look for them, even if it missed them in the initial pass.

The risk is that models can also generate confident-sounding self-critiques that are themselves wrong. Self-reflection improves output quality on average but isn't a substitute for grounding in external facts or structured evals. Think of it as catching surface-level errors before they reach the user, not as a deep reliability guarantee.
