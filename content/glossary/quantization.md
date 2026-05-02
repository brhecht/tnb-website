---
slug: quantization
term: Quantization
type: Concept
topic: Infrastructure
familiarity: Emerging
aliases:
  - model quantization
  - weight quantization
  - int4
  - int8
  - GPTQ
  - AWQ
related:
  - local-model
  - model-distillation
  - inference-cost
  - vllm
  - model-serving
dateAdded: '2026-05-02'
shortDef: >-
  A compression technique that reduces the numerical precision of a model's
  stored values, shrinking memory requirements and speeding up inference. A
  quantized model trades a small amount of quality for a large reduction in
  hardware cost.
---
AI models are essentially enormous collections of numbers called weights. By default those numbers are stored at high precision — 16-bit or 32-bit floating point. Quantization converts them to lower precision formats like 8-bit integers (int8) or 4-bit integers (int4). The model gets smaller, loads faster, and runs on hardware that would have been too limited for the original version.

The practical payoff is significant. A 70-billion-parameter model that normally needs multiple high-end GPUs can often run on a single GPU after 4-bit quantization, with only a small drop in output quality. This is how projects like Ollama let people run capable models on a laptop. Popular quantization methods include GPTQ and AWQ, which are designed to minimize accuracy loss during the compression process.

Quantization is mostly a deployment-time decision. You take a pre-trained model, run it through a quantization process, and get a smaller version ready to serve. For builders self-hosting open-weight models, understanding quantization levels (Q4, Q5, Q8) helps you pick the right tradeoff between quality and hardware requirements. Most inference engines including vLLM support quantized models out of the box.
