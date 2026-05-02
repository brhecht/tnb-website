---
slug: speculative-decoding
term: Speculative decoding
type: Concept
topic: Infrastructure
familiarity: Specialist
aliases:
  - speculative inference
  - draft-and-verify decoding
related:
  - inference
  - vllm
  - model-serving
  - inference-cost
  - kv-cache
dateAdded: '2026-05-02'
shortDef: >-
  A technique where a small fast model drafts several candidate tokens at once,
  and the main model verifies them in a single pass. When the drafts are
  correct, you get multiple tokens for roughly the price of one, cutting latency
  significantly.
---
Generating text from a large language model is inherently sequential: the model produces one token, then uses that token to produce the next, and so on. This is the core bottleneck for latency. Speculative decoding breaks this constraint by pairing the main model with a smaller, faster draft model. The draft model guesses several tokens ahead, and the main model checks all the guesses simultaneously. Correct guesses are accepted and incorrect ones trigger the main model to take over from that point.

The result is that multiple tokens can be accepted in the time it would normally take to generate one. Benchmarks consistently show 2 to 3 times speed improvements, especially for tasks where the output is somewhat predictable. The speedup comes without changing the final output distribution — the main model still controls quality, the draft model just helps it get there faster.

Speculative decoding is increasingly built into production inference engines rather than being something builders configure manually. vLLM supports it, and NVIDIA's inference stack has its own variants. It matters most at smaller batch sizes — when only a few users are active at once — which is exactly the scenario most early-stage AI products face. At very large batch sizes, standard batching strategies often close the gap.
