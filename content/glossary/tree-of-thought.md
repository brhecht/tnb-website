---
slug: tree-of-thought
term: Tree of thought
type: Concept
topic: Patterns & Practices
familiarity: Specialist
aliases:
  - ToT
  - tree-of-thoughts prompting
  - multi-path reasoning
related:
  - chain-of-thought
  - react-prompting
  - reasoning-model
  - extended-thinking
dateAdded: '2026-05-02'
shortDef: >-
  An advanced prompting technique where the model explores multiple reasoning
  branches simultaneously, evaluates each one, and backtracks from dead ends
  before committing to an answer. Useful for complex problem-solving that
  benefits from exploring alternatives.
---
Chain-of-thought gets the model to reason step by step in a straight line. Tree of thought (ToT) goes further: it asks the model to generate multiple candidate next steps, evaluate which ones are promising, explore those branches, and prune the ones that don't work out. It's more like a deliberate search process than a single reasoning trace.

The pattern was designed for problems where the right answer isn't obvious from a single direction, such as creative planning, logic puzzles, or multi-constraint optimization. By explicitly branching and backtracking, the model can recover from wrong initial assumptions rather than committing to them.

In practice, tree-of-thought is expensive and slow because it requires multiple model calls per step. It's most useful when you're willing to trade cost for quality on a hard task and have no better alternative. With the rise of reasoning models (models that have internalized extended thinking into their pre-training), the explicit tree-of-thought pattern has become less necessary for many use cases, but the underlying idea, exploring multiple paths before committing, is still alive inside those models.
