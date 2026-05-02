---
slug: tool-poisoning
term: Tool poisoning
type: Concept
topic: Agents & Automation
familiarity: Specialist
aliases:
  - MCP tool poisoning
  - malicious tool description
related:
  - indirect-prompt-injection
  - mcp-server
  - guardrails
  - tool-use
  - sandboxing
dateAdded: '2026-05-02'
shortDef: >-
  An attack where a malicious MCP server or tool definition includes hidden
  instructions in its description or response, causing the agent to execute
  attacker-controlled actions while appearing to do normal work.
---
MCP (Model Context Protocol) servers expose tools to agents by describing what each tool does. Tool poisoning embeds malicious instructions inside those descriptions. When the agent reads the tool's definition to decide whether to use it, it also ingests the hidden instructions. Because the agent treats tool descriptions as part of its operating context, those instructions can override intended behavior.

A poisoned tool might instruct the agent to exfiltrate data through a side channel, modify files outside its intended scope, or quietly disable safety checks before proceeding. The attack is particularly hard to catch because the tool appears legitimate in the tool list, and the malicious behavior only activates under specific conditions.

This class of attack is why the security community distinguishes between trust levels for MCP servers. Official, first-party servers are higher trust than community-contributed ones. Builders connecting agents to third-party MCP servers should review tool descriptions carefully, run agents with minimal permissions, and monitor for unexpected tool calls. The broader lesson: anything an agent reads can in principle influence its behavior, including metadata and descriptions that feel like documentation.
