---
slug: inference-api
term: Inference API
type: Concept
topic: Infrastructure
familiarity: Common
aliases:
  - model API
  - LLM API
  - AI API
  - model endpoint
related:
  - model-serving
  - openai-compatible-api
  - serverless-inference
  - byok
  - inference-cost
dateAdded: '2026-05-02'
shortDef: >-
  An API endpoint (a URL you send requests to) that runs a trained model and
  returns its output. It abstracts away all the hardware and software needed to
  run the model — you send a prompt, you get a response, and never touch a GPU.
---
An inference API is the simplest way for a builder to add AI capabilities to a product. Instead of deploying and managing a model, you make an HTTP request (a standard web call) to an endpoint, include your prompt and parameters, and get back the model's output. The API provider owns the infrastructure: the GPUs, the serving software, the autoscaling, and the uptime.

The major providers (OpenAI, Anthropic, Google, Mistral) each have their own APIs. Open-weight model providers (Together AI, Groq, Replicate, Fireworks AI) offer compatible APIs for running non-proprietary models. Most have settled on an OpenAI-compatible format, meaning a client built for one can often point at another with minimal changes.

Inference APIs are the right starting point for most builders: zero infrastructure to manage, no upfront costs, and immediate access to capable models. The limitations appear at scale — per-token pricing can get expensive at high volume, you are subject to rate limits, and sensitive data passes through a third-party server. Those concerns push mature teams toward self-hosted alternatives or private deployment options.
