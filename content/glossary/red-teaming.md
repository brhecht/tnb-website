---
slug: red-teaming
term: Red teaming
type: Concept
topic: Patterns & Practices
familiarity: Common
aliases:
  - AI red teaming
  - LLM red teaming
  - adversarial testing
related:
  - system-prompt-injection
  - context-poisoning
  - guardrails
  - hallucination
  - evals
  - ai-red-teamer
dateAdded: '2026-05-02'
shortDef: >-
  Deliberately trying to break your AI system before real users do. A red team
  probes for jailbreaks, harmful outputs, data leakage, and unsafe behaviors
  using adversarial inputs and creative attack scenarios.
---
Red teaming borrows from military and cybersecurity practice: you assign a team to act as adversaries and attack your own system. For AI, that means systematically testing whether the model can be tricked into ignoring its instructions, producing harmful content, leaking sensitive information, or taking actions it shouldn't.

The scope has expanded significantly as AI systems have gained more autonomy. Beyond simple prompt injection, red teams now test tool permissions, agent workflows, inter-agent communication, and memory persistence. The OWASP Top 10 for LLM Applications and agentic-specific extensions give red teamers a recognized taxonomy of attack surfaces to work through.

For builders shipping products, red teaming is as much a design input as a security check. Running adversarial tests early in development often reveals cases where your system prompt is too permissive, your tool permissions are too broad, or your output filters have obvious gaps. Regulators, including the EU AI Act framework, are increasingly expecting documented red teaming for higher-risk AI deployments.
