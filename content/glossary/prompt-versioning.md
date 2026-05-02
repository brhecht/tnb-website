---
slug: prompt-versioning
term: Prompt versioning
type: Concept
topic: Patterns & Practices
familiarity: Emerging
aliases:
  - prompt version control
  - prompt management
  - prompt registry
related:
  - prompt-engineering
  - evals
  - system-prompt
  - llmops
  - spec-driven-development
dateAdded: '2026-05-02'
shortDef: >-
  Treating prompts like code: tracking changes over time, running evals against
  each version, and maintaining the ability to roll back when a change degrades
  performance. A basic hygiene practice for any AI system in production.
---
Early AI projects often live in a single file or a shared doc where prompts get edited in place. When the system behaves worse, nobody knows what changed or when. Prompt versioning applies the same version control discipline used for code to the prompts that drive AI behavior.

In practice this means storing prompts in version-controlled files (tracked in Git, the most common code version control system), tagging releases, and running your eval suite against each version before promoting changes. If a new prompt version hurts performance on your test cases, you can see exactly what changed and revert.

Some teams use dedicated prompt management tools like Langfuse or PromptLayer that layer dashboards and experiment tracking on top of version control. For smaller projects, plain Git and a disciplined naming convention gets you most of the way there. Either way, the core behavior change is the same: stop treating prompts as informal text and start treating them as software artifacts with the same care you'd give to code.
