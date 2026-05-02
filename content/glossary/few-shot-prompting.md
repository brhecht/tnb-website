---
slug: few-shot-prompting
term: Few-shot prompting
type: Concept
topic: Patterns & Practices
familiarity: Common
aliases:
  - few-shot learning
  - in-context learning
  - ICL
  - n-shot prompting
related:
  - prompt-engineering
  - zero-shot-prompting
  - chain-of-thought
  - system-prompt
dateAdded: '2026-05-02'
shortDef: >-
  Giving the model a handful of worked examples inside the prompt so it can
  pattern-match to your expected format or style. The model doesn't retrain; it
  just picks up the pattern from the examples you've included.
---
Few-shot prompting puts two or more examples directly in the prompt before your actual request. The model reads them, infers the pattern you want, and applies it to the new input. It's the difference between describing what you need and just showing it. One example is 'one-shot'; no examples at all is 'zero-shot'.

It's especially useful when the output format matters a lot, such as structured JSON, a specific tone, or a classification schema where the categories aren't self-evident. Showing the model what good looks like is often faster than trying to describe it in words.

There's a nuance worth knowing: research on newer, stronger models suggests that for complex reasoning tasks, few-shot examples may do more to enforce output format than to actually improve the reasoning itself. Zero-shot prompting with a clear instruction sometimes matches or beats it. Still, for format-sensitive tasks and custom workflows, few-shot remains one of the most reliable tools a builder has.
