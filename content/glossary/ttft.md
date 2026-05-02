---
slug: ttft
term: TTFT
type: Concept
topic: Infrastructure
familiarity: Emerging
aliases:
  - Time to First Token
  - time-to-first-token
  - time to first token
related:
  - inference
  - model-serving
  - inference-cost
  - agent-observability
  - llmops
dateAdded: '2026-05-02'
shortDef: >-
  Time to First Token: how long it takes after sending a request before the
  first word of the response appears. For streaming interfaces and voice
  applications, this is the metric users feel most directly — even a fast model
  feels broken if TTFT is too high.
---
When a language model responds to a request, it does not send the full answer at once. It streams tokens one by one, so the user sees text appearing in real time. TTFT measures the gap between sending the request and receiving that very first token. Total response time matters, but TTFT is what determines whether the experience feels snappy or sluggish — a sub-second TTFT feels instant, while anything over two or three seconds starts to feel like the system is frozen.

TTFT is influenced by several infrastructure factors: how busy the server is, how long the input prompt is (longer prompts take more processing before the model can start generating), whether prompt caching is active, and which hardware the model is running on. Groq's LPU hardware, for example, is specifically designed to minimize TTFT, often delivering first tokens in under 200ms. GPU-based servers typically run slower depending on load.

For builders, TTFT is one of the key metrics to track in production alongside tokens per second (how fast the full response generates) and overall request latency. It shows up in LLMOps dashboards, load testing, and provider comparisons. Voice agents and real-time chat applications are the most sensitive to it — even a few hundred milliseconds of extra delay makes the experience feel unnatural.
