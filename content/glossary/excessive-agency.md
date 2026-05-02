---
slug: excessive-agency
term: Excessive agency
type: Concept
topic: Agents & Automation
familiarity: Emerging
aliases:
  - over-permissioned agent
  - agent privilege escalation
related:
  - guardrails
  - sandboxing
  - human-in-the-loop
  - indirect-prompt-injection
  - tool-use
dateAdded: '2026-05-02'
shortDef: >-
  A risk category where an AI agent has been given too many permissions, tools,
  or autonomy for its actual role. If something goes wrong or the agent is
  manipulated, the blast radius is larger than it needs to be.
---
Excessive agency appears on OWASP's top-ten list of LLM risks specifically because of how agentic systems are built. Developers often give agents broad access up front (file system, email, external APIs) because it's easier than carefully scoping permissions for each task. That convenience becomes a liability when the agent makes a mistake or is manipulated through prompt injection.

The principle of least privilege (a security idea meaning: give a system only the minimum access it needs to do its job) applies directly to agents. An agent that only needs to read and write to one folder shouldn't have access to the whole file system. An agent that sends emails only to one address shouldn't have permission to email anyone. Every extra permission is a risk surface.

In practice, excessive agency leads to incidents like agents deleting the wrong files, sending messages to unintended recipients, or being tricked into taking escalated actions by a malicious prompt. The fix is usually architectural: define each agent's tool list narrowly, add confirmation steps for high-stakes actions, and run agents in sandboxed environments (isolated containers where damage is contained) wherever possible.
