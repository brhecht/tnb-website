---
slug: zero-shot-prompting
term: Zero-shot prompting
type: Concept
topic: Patterns & Practices
familiarity: Common
aliases:
  - zero-shot inference
  - zero-shot
related:
  - few-shot-prompting
  - prompt-engineering
  - chain-of-thought
  - system-prompt
dateAdded: '2026-05-02'
shortDef: >-
  Asking a model to do something with no worked examples in the prompt at all.
  You rely entirely on the model's pre-trained knowledge and
  instruction-following ability to get the right output.
---
Zero-shot prompting is the simplest form of prompting: give the model a task description and let it figure out how to execute it. No examples, no demonstrations. The model draws on everything it learned during training to produce a response.

Modern instruction-tuned models (models fine-tuned specifically to follow directions) handle zero-shot prompting surprisingly well across a wide range of tasks. For straightforward requests, adding examples often doesn't improve results much and just adds cost by consuming more tokens in the context window.

Where zero-shot struggles is with unusual output formats, niche domains, or tasks that require the model to adopt a very specific style. In those cases, a few examples go a long way. Most builders end up treating zero-shot as their default and layering in examples only when quality drops.
