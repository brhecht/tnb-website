---
slug: llm-as-judge
term: LLM-as-judge
type: Concept
topic: Patterns & Practices
familiarity: Emerging
aliases:
  - LLM-as-a-judge
  - model-as-judge
  - AI evaluator
  - judge model
related:
  - evals
  - evals-engineer
  - hallucination
  - structured-output
  - llm-tracing
dateAdded: '2026-05-02'
shortDef: >-
  Using one language model to evaluate the output of another. Instead of writing
  hand-coded tests or relying on humans to review responses, you prompt a
  'judge' model to score outputs against criteria you define.
---
LLM-as-judge solves a problem every builder hits quickly: LLM outputs are non-deterministic and often open-ended, so traditional unit tests that check for exact expected values don't work. A judge model can assess things like relevance, tone, factual accuracy, or whether a response stayed on-topic, at a scale and speed no human review team can match.

The basic setup is a two-model loop. One model (your app) generates a response. A second model (the judge) reads the response alongside a rubric you've written and scores it, often with a short explanation. Research suggests a well-configured judge can match human agreement rates of around 85%, which is competitive with inter-human agreement.

The catch is that judge models can have their own biases, like preferring longer responses or outputs that echo the question's framing. Good practice means validating your judge against a small set of human-labeled examples before you trust it at scale. Deterministic checks (format, length, required phrases) still handle structural requirements; the LLM judge handles the semantic quality on top.
