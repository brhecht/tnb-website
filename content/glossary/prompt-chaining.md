---
slug: prompt-chaining
term: Prompt chaining
type: Concept
topic: Patterns & Practices
familiarity: Common
aliases:
  - LLM chaining
  - sequential prompting
  - pipeline prompting
  - chained prompts
related:
  - orchestration
  - agentic-loop
  - context-engineering
  - structured-output
  - rag
dateAdded: '2026-05-02'
shortDef: >-
  Breaking a complex task into a sequence of smaller LLM calls, where each call
  feeds its output into the next one. Instead of asking one prompt to do
  everything, you decompose the work into steps.
---
Prompt chaining is one of the earliest and most durable patterns in building with LLMs. The idea is simple: rather than loading one enormous task into a single prompt and hoping the model handles every sub-problem correctly, you break the job into stages. Each stage gets its own focused prompt, and its output becomes the input for the next.

This pattern solves several real problems. A single mega-prompt is hard to debug because you can't easily tell which part failed. Chaining makes failures visible and localized. It also lets you validate and transform outputs between steps, for instance, parsing JSON from step one before passing it to step two, so errors don't compound.

In practice, prompt chaining is the backbone of most non-trivial AI workflows. Document processing pipelines, multi-step research tasks, and anything that requires routing or conditional logic all end up looking like prompt chains. As workflows grow, they often evolve into full agent systems, but chaining is usually where builders start.
