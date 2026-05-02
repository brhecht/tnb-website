---
slug: model-fallback
term: Model fallback
type: Concept
topic: Patterns & Practices
familiarity: Emerging
aliases:
  - model fallback strategy
  - fallback chain
  - LLM fallback
  - model redundancy
related:
  - model-router
  - inference-api
  - ai-gateway
  - guardrails
  - llmops
dateAdded: '2026-05-02'
shortDef: >-
  Automatically switching to a backup model when your primary model fails, times
  out, or returns an error. A reliability practice for production systems that
  can't afford to go down when a single provider has issues.
---
Any production AI system that depends on a single model API (an application programming interface that connects your app to the model provider) is exposed to that provider's outages, rate limits, and latency spikes. Model fallback is the pattern of configuring alternative models or providers that the system routes to automatically when the primary fails.

A typical fallback chain might try the primary model, then a smaller model from the same provider, then a model from a different provider entirely. The key is that the fallback models should be tested against your use case in advance, because a fallback that quietly produces worse output can be harder to catch than a visible error.

Model fallback overlaps with model routing, where different models are selected proactively based on task type or cost. AI gateways (middleware layers that sit between your application and model APIs) typically handle both fallback and routing logic, centralizing the configuration so your application code doesn't have to manage it directly.
