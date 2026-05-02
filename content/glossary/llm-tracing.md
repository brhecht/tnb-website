---
slug: llm-tracing
term: LLM tracing
type: Concept
topic: Infrastructure
familiarity: Emerging
aliases:
  - prompt tracing
  - AI tracing
  - GenAI tracing
  - LLM trace
  - request tracing
related:
  - agent-observability
  - opentelemetry-for-ai
  - llmops
  - evals
  - hallucination
dateAdded: '2026-05-02'
shortDef: >-
  Recording the full chain of inputs, outputs, tool calls, and metadata for each
  LLM request so you can inspect what actually happened after the fact. Tracing
  is the primary way to debug AI applications in production and understand why a
  model gave a particular response.
---
Traditional software debugging relies on logs and error messages. For AI applications, these alone are insufficient — a request can succeed (200 OK, no crash) while producing a wrong, harmful, or incoherent response. LLM tracing captures the complete picture: the exact system prompt, user message, any retrieved context, model parameters, tool calls made, and the final output, all linked together in a single trace record for each request.

For multi-step workflows and agents, tracing becomes even more critical. If an agent takes ten steps before producing a wrong answer, you need to see exactly which step went wrong — which tool was called, what it returned, how the model interpreted that result, and what decision it made next. Without tracing, debugging agent behavior is essentially guesswork.

Tools like LangSmith, Langfuse, Arize Phoenix, and Weave (from Weights and Biases) provide LLM tracing out of the box. The OpenTelemetry GenAI semantic conventions are standardizing how this data is structured, so it can flow into any compatible observability backend. For builders moving from prototype to production, setting up tracing early is one of the highest-leverage infrastructure investments — it turns black-box AI behavior into something you can actually inspect and improve.
