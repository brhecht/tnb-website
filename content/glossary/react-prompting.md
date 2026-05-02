---
slug: react-prompting
term: ReAct prompting
type: Concept
topic: Patterns & Practices
familiarity: Emerging
aliases:
  - ReAct
  - Reasoning and Acting
  - reason-act loop
related:
  - chain-of-thought
  - tool-use
  - function-calling
  - agentic-loop
  - orchestration
dateAdded: '2026-05-02'
shortDef: >-
  A prompting pattern where the model alternates between reasoning out loud
  ('Thought'), taking an action ('Action'), and observing the result
  ('Observation'), repeating until the task is done. It underlies how most
  tool-using agents think.
---
ReAct stands for Reasoning and Acting. Instead of having a model jump straight to an answer, the prompt guides it to pause and think through each step, decide what tool or action to use next, take that action, and then factor in what it learned before moving on. The cycle is: Thought, then Action, then Observation, then Thought again.

This interleaving of reasoning and tool use makes agents far more reliable than approaches that separate the two. When a model can observe what actually happened after an action, such as the result of a web search or a code execution, it can course-correct instead of confidently following a wrong path.

In practice, most modern agent frameworks bake ReAct-style behavior into their default setup. You don't always have to write the ReAct loop yourself. But knowing the pattern helps you debug why an agent is looping, skipping steps, or ignoring tool results, because those are exactly the joints where the Thought-Action-Observation cycle can break down.
