---
slug: kv-cache
term: KV cache
type: Concept
topic: Infrastructure
familiarity: Specialist
aliases:
  - key-value cache
  - key-value store
  - attention cache
related:
  - prompt-caching
  - inference
  - context-window
  - vllm
  - inference-cost
dateAdded: '2026-05-02'
shortDef: >-
  A memory structure inside a running language model that stores intermediate
  calculation results so they do not have to be recomputed for every new token.
  Managing it well is one of the main levers for cutting inference cost and
  latency.
---
When a language model generates text, it processes each token in relation to every previous token. Without caching, the model would redo all that computation from scratch for every new word it produces. The KV cache (short for Key-Value cache, named for internal components of the attention mechanism) stores those computed states so each new token only needs to do the incremental work.

As context windows grow longer, the KV cache grows with them — sometimes reaching tens or hundreds of gigabytes per concurrent session. This makes KV cache management one of the central engineering challenges in running LLMs at scale. Techniques like PagedAttention (used in vLLM) manage KV cache memory more efficiently, allowing more concurrent requests to run on the same hardware. Quantizing the KV cache (storing it at lower precision) can cut its footprint in half with minimal quality loss.

For builders, the KV cache shows up most directly in the concept of prompt caching: if you send the same long system prompt with every request, a good inference engine will cache that prefix so you only pay the compute cost once. Understanding KV cache behavior helps explain why long-context requests are expensive, why prompt caching saves money, and why running many short requests in parallel is more efficient than one long sequential conversation.
