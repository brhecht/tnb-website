---
slug: gpu-cloud
term: GPU cloud
type: Tool
topic: Infrastructure
familiarity: Common
aliases:
  - cloud GPU
  - GPU-as-a-service
  - compute cloud
related:
  - inference
  - inference-cost
  - vllm
  - model-serving
  - llmops
dateAdded: '2026-05-02'
shortDef: >-
  Cloud services that rent access to graphics processing units (GPUs) — the
  specialized hardware AI models need to run. Instead of buying expensive
  hardware, builders pay by the hour for as much or as little compute as the job
  requires.
---
Training and running large AI models requires a specific type of hardware: GPUs, which were originally built for rendering graphics but turned out to be ideal for the matrix math inside neural networks. GPU clouds give builders on-demand access to this hardware without upfront capital investment. You provision a server, the GPU is already there, and you pay for the time you use it.

The market splits roughly into two camps. Hyperscalers (AWS, Google Cloud, Azure) offer GPUs alongside their broader ecosystem of storage, networking, and managed services — convenient if you are already on their stack, but often expensive. Specialist GPU clouds (CoreWeave, Lambda, RunPod, Nebius) focus specifically on AI workloads, often offering better availability and lower prices for raw compute. The tradeoff is fewer non-GPU services bundled in.

For most builders, the choice comes down to workload type. Bursty experiment work fits pay-as-you-go serverless options. Training runs or high-throughput inference often benefit from reserved capacity. And for teams that just need to call a model without managing any GPU at all, hosted inference APIs (like Groq or Together AI) abstract the hardware layer away entirely.
