---
slug: opentelemetry-for-ai
term: OpenTelemetry for AI
type: Concept
topic: Infrastructure
familiarity: Emerging
aliases:
  - OTel GenAI
  - OpenTelemetry GenAI
  - GenAI semantic conventions
  - AI observability instrumentation
related:
  - agent-observability
  - llmops
  - ttft
  - mlops
  - inference
dateAdded: '2026-05-02'
shortDef: >-
  An extension of the OpenTelemetry observability standard — widely used for
  tracing web services — adapted to capture AI-specific signals like prompt
  content, token usage, TTFT, and model metadata. It is emerging as the standard
  way to make LLM applications observable without vendor lock-in.
---
OpenTelemetry (often shortened to OTel) is an open-source standard for collecting telemetry data — traces, metrics, and logs — from software systems. It became popular in traditional software because it is vendor-neutral: you instrument your code once, and the data can flow to Datadog, Grafana, Jaeger, or any other observability backend without changing the instrumentation code.

For AI applications, standard web telemetry falls short. An HTTP request succeeding with a 200 response code tells you nothing about whether the model hallucinated, how many tokens were consumed, or whether TTFT was acceptable. The OpenTelemetry community has developed GenAI semantic conventions — a standardized schema for attributes like model name, input/output token counts, prompt content, TTFT, and agent tool calls — that bring the same vendor-neutral approach to LLM observability.

For builders, this matters when moving past demo stage. Instrumenting your LLM calls with OTel means your cost tracking, latency monitoring, and debugging data are not locked into a single observability vendor. It also creates a consistent data format across multi-model systems where requests might hit OpenAI, Anthropic, or a self-hosted model depending on the router's decision.
