---
slug: reflection-pattern
term: Reflection pattern
type: Concept
topic: Agents & Automation
familiarity: Emerging
aliases:
  - agent reflection
  - self-reflection loop
  - generate-critique-refine
related:
  - agentic-loop
  - self-reflection
  - react-prompting
  - output-validation
  - llm-as-judge
dateAdded: '2026-05-02'
shortDef: >-
  An agentic design pattern where the model generates a response, then critiques
  its own output and revises it. The loop repeats until quality is acceptable or
  a cycle limit is hit.
---
In the reflection pattern, the agent (or a second model acting as a critic) evaluates the first draft. It checks for accuracy, logical gaps, or constraint violations. The critique is fed back into the model, which produces a revised output. This cycle runs until the output passes a quality check or a maximum number of cycles is reached.

The pattern is most useful when the cost of an error is higher than the cost of extra compute: legal summaries, financial analysis, code that needs to pass tests, or any output where 'close enough' isn't acceptable. The downside is that two or three reflection cycles can multiply token usage by five or six times compared to a single generation pass. You need clear, measurable quality criteria, or the revision cycles won't produce meaningful improvements.

Reflection is widely used inside popular agent frameworks. LangGraph supports it natively with cycle-capable graphs. Tools like smolagents and LangChain's ReAct agent bake in a version of it. The concept is related to but distinct from self-reflection in the general sense: here it means a structured, repeatable loop with explicit critique, not just an agent noting that it might be wrong.
