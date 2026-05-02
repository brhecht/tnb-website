---
slug: agent-evals
term: Agent evals
type: Concept
topic: Agents & Automation
familiarity: Emerging
aliases:
  - agentic evaluation
  - agent benchmarks
  - agent testing
related:
  - evals
  - llm-as-judge
  - guardrails
  - swe-bench
  - agentops
dateAdded: '2026-05-02'
shortDef: >-
  Tests designed specifically for agents: measuring whether an agent completes a
  task correctly across many runs, not just whether its language output sounds
  good. Harder than eval-ing a single model response because agents branch and
  accumulate errors over many steps.
---
Evaluating a chatbot response is relatively straightforward: did the answer make sense, was it factually correct, did it follow the format? Evaluating an agent is much harder. An agent takes multiple actions over multiple steps. An error early in the run compounds through every step that follows. The same task might succeed in sixty percent of runs and fail in forty percent, with completely different failure modes each time.

Good agent evals test the whole trajectory, not just the final output. Did the agent use the right tools in the right order? Did it recover from a failed tool call? Did it stop when it should have stopped rather than spinning indefinitely? SWE-bench (a benchmark for evaluating coding agents on real GitHub issues) is one example of task-level evaluation at scale. Teams running their own agents usually build custom eval harnesses that replay representative tasks and grade the full run.

The field is still catching up to the problem. Most existing eval frameworks were built for single-turn model evaluation. LLM-as-judge (using a language model to grade another model's output) helps with grading final answers but misses multi-step failure modes. Builders serious about production agents treat evals as an ongoing engineering investment, not a one-time quality check.
