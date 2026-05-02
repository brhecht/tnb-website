---
slug: lpu
term: LPU
type: Concept
topic: Infrastructure
familiarity: Specialist
aliases:
  - Language Processing Unit
  - LPU Inference Engine
related:
  - groq
  - inference
  - ttft
  - gpu-cloud
  - model-serving
dateAdded: '2026-05-02'
shortDef: >-
  Language Processing Unit: a custom chip designed specifically for running
  language models, unlike GPUs which were originally built for graphics. LPUs
  are engineered to minimize the memory bottlenecks that slow down sequential
  text generation.
---
GPU stands for Graphics Processing Unit — hardware originally designed to render images by running many small computations in parallel. It turns out that same parallel structure is useful for training neural networks, which is how GPUs became the default AI chip. But LLM inference is partially sequential: you generate token after token, and each step depends on the last. That sequential bottleneck is where GPUs are weakest.

Groq built LPUs specifically to address this. The architecture is deterministic and optimized for the memory-bandwidth-bound operations that dominate during text generation. The result is significantly lower Time to First Token (TTFT) compared to GPU-based serving, often by 4 to 10 times. Groq's LPUs are what power the GroqCloud API, which is why that service stands out on latency benchmarks.

The broader LPU concept — purpose-built silicon for inference rather than training — is part of a wider trend of specialized AI chips. Companies like Cerebras (with its wafer-scale processors) and SambaNova are also building inference-optimized hardware with different architectural approaches. For builders, this hardware diversity mostly surfaces as API choices: you pick a provider based on latency, cost, and model availability rather than managing the chips yourself.
