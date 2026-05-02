---
slug: serverless-inference
term: Serverless inference
type: Concept
topic: Infrastructure
familiarity: Emerging
aliases:
  - serverless LLM
  - pay-per-request inference
  - on-demand inference
related:
  - model-serving
  - inference-cost
  - groq
  - together-ai
  - modal
dateAdded: '2026-05-02'
shortDef: >-
  Running AI model requests without provisioning or managing a persistent
  server. You send a request, the infrastructure starts up what it needs,
  returns a response, and scales back to zero. You pay per request, not per hour
  of server time.
---
Traditional model serving requires keeping a server (and GPU) running and ready to handle requests at all times. Even if no one is using your app at 3am, you are paying for the hardware. Serverless inference flips this model: the infrastructure is managed by the provider, spins up on demand when a request arrives, handles the request, and tears down again when idle. You are billed for actual usage, not reserved capacity.

The main tradeoff is cold starts — the brief delay when infrastructure spins up from zero because it has been idle. For bursty or low-volume workloads, serverless is dramatically cheaper and simpler to manage. For high-traffic steady-state workloads, dedicated capacity often wins on both latency and cost predictability. Most builder-stage products start serverless and move toward dedicated endpoints as traffic grows and becomes more predictable.

Serverless inference is now available across the major open-weight inference providers (Hugging Face Serverless Inference API, Together AI, Replicate, Modal) as well as through the hyperscalers' managed AI services. The Hugging Face Serverless Inference API in particular gives builders free-tier access to thousands of open-weight models, making it a common starting point for evaluation before committing to a provider.
