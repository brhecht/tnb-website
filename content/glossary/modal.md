---
slug: modal
term: Modal
type: Tool
topic: Infrastructure
familiarity: Emerging
aliases:
  - Modal Labs
related:
  - gpu-cloud
  - model-serving
  - sandboxing
  - inference-cost
  - evals
dateAdded: '2026-05-02'
shortDef: >-
  A serverless cloud infrastructure tool that lets builders run Python functions
  on GPUs or CPUs without managing servers. You write normal Python code,
  decorate functions to run in the cloud, and Modal handles containers, scaling,
  and billing by the millisecond.
---
Modal's pitch is that backend infrastructure should feel like writing local code. You annotate a Python function to say it needs a GPU, a specific container image, or access to certain storage, and Modal handles provisioning and execution without you ever writing a Dockerfile or managing a cluster. Scaling happens automatically — from zero up to hundreds of parallel workers — and you only pay for actual compute time, not idle time.

For AI builders, Modal is popular for inference deployment, fine-tuning runs, eval pipelines, and running sandboxed code (isolated execution environments) for agent tools. The DX (developer experience) is frequently compared to what Vercel did for frontend deployment: it removed the friction of deploying backend services without sacrificing control for teams that need it.

Modal sits at a different level than GPU clouds. A GPU cloud gives you a server you manage. Modal gives you a serverless function runtime where the server is fully abstracted away. Teams often use Modal for workloads with bursty or unpredictable demand — a spike in eval jobs during a training run, or occasional fine-tune requests that do not justify keeping a server warm 24 hours a day.
