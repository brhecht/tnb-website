---
slug: continuous-batching
term: Continuous batching
type: Concept
topic: Infrastructure
familiarity: Specialist
aliases:
  - in-flight batching
  - dynamic batching
  - iteration-level scheduling
related:
  - model-serving
  - inference-cost
  - vllm
  - kv-cache
  - inference
dateAdded: '2026-05-02'
shortDef: >-
  An inference scheduling technique that lets new requests join a running batch
  mid-generation rather than waiting for the current batch to finish. It keeps
  GPUs busy and dramatically increases the number of requests a single server
  can handle.
---
Traditional batching for machine learning works like a bus with fixed departure times: requests wait until a batch is assembled, all go at once, and the batch completes before any new requests board. For LLMs this is inefficient because different requests finish at different times — a short question might be done in 20 tokens while a long generation takes 500, and the GPU sits idle waiting for the slow ones.

Continuous batching treats the inference server more like an airport gate: as soon as a sequence finishes, the slot opens and a waiting request can start immediately. This keeps GPU utilization high across a wide range of request lengths and arrival patterns. It is one of the core features that made vLLM notable when it launched, and it is now table stakes for any serious serving engine.

For builders, continuous batching is largely invisible — it happens inside the serving engine. But it explains why throughput numbers from inference providers are often quoted in requests-per-second rather than tokens-per-second alone, and why the right serving engine choice can have a 10 to 20 times impact on how many users you can serve from the same hardware.
