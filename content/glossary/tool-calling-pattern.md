---
slug: tool-calling-pattern
term: Tool calling pattern
type: Concept
topic: Patterns & Practices
familiarity: Common
aliases:
  - tool use pattern
  - function calling pattern
related:
  - function-calling
  - tool-use
  - react-prompting
  - mcp
  - agentic-loop
  - orchestration
dateAdded: '2026-05-02'
shortDef: >-
  The practice of giving an LLM defined tools it can invoke, such as search,
  code execution, or API calls, and building your system around that tool-use
  loop. The model decides when and how to use each tool based on the task.
---
Tool calling is what turns a chat model into something that can actually do things in the world. You define a set of tools, each described by its name, what it does, and what inputs it takes. The model reads those descriptions and, when solving a problem, decides whether to call a tool, which one, and with what arguments. The result comes back, and the model continues.

Most major model providers have standardized this via function calling APIs (interfaces that let models trigger specific functions in your code). The model doesn't execute code directly; it emits a structured request and your application handles the actual execution. This separation is important for safety: you control what tools exist and what permissions they carry.

In practice, tool calling is the connective tissue of almost every useful agent. Web search, database queries, calendar lookups, file reads, and code execution are all tools. Designing good tool schemas (clear names, precise descriptions, unambiguous parameter types) is one of the highest-leverage prompt engineering skills a builder can develop, because a confused model will call the wrong tool or pass bad arguments.
