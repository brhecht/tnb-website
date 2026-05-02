---
slug: model-serving
term: Model serving
type: Concept
topic: Infrastructure
familiarity: Common
aliases:
  - LLM serving
  - inference serving
  - model deployment
related:
  - inference
  - vllm
  - inference-cost
  - model-router
  - llmops
dateAdded: '2026-05-02'
shortDef: >-
  The infrastructure layer that takes a trained model and makes it available to
  answer requests in production. It handles routing, batching, scaling, and
  returning outputs to callers — all without the caller touching the raw model.
---
Model serving is the operational side of AI that most builders only notice when it goes wrong. You have a model that works in testing. Model serving is what keeps it running reliably when real users hit it — handling hundreds or thousands of requests at the same time, scaling up under load, and keeping latency low enough that responses feel snappy rather than frozen.

The serving stack sits between your application (or agent) and the raw compute (GPUs). At minimum it wraps the model in an API (often an OpenAI-compatible endpoint), manages how many requests run in parallel, and returns streamed or complete responses. In more mature setups it handles load balancing across multiple model replicas, health checks, failover, and metrics collection.

For builders using hosted APIs like OpenAI or Anthropic, model serving is mostly invisible — the provider handles it. It becomes a hands-on concern when you self-host open-weight models, run fine-tuned variants, or need control over cost, latency, or data privacy. Tools like vLLM, TGI (Text Generation Inference), and SGLang are popular open-source serving engines. Managed options like Modal, RunPod, and Baseten let you deploy without standing up your own cluster.
