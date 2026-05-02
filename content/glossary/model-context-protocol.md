---
slug: model-context-protocol
term: Model Context Protocol
type: Concept
topic: Infrastructure
familiarity: Emerging
aliases:
  - MCP
  - MCP protocol
related:
  - mcp
  - mcp-server
  - tool-use
  - agent-scaffold
  - function-calling
dateAdded: '2026-05-02'
shortDef: >-
  An open standard, originally created by Anthropic, that defines how AI models
  connect to external tools, data sources, and services. It lets builders wire
  up a model to any MCP-compatible tool without writing custom integration code
  for each one.
---
Before MCP, connecting an AI model to external capabilities — a database, a file system, a web API — required custom integration code for every combination of model and tool. MCP standardizes this interface: tools expose a consistent set of capabilities, and any MCP-compatible model or agent can discover and call them through the same protocol.

MCP is structured around servers (which provide tools and data) and clients (models or agents that use them). An MCP server might give a model access to a local file system, a database, a browser, or any API. Because the protocol is standardized, the same MCP server can work with Claude, Cursor, Windsurf, or any other MCP-compatible host without modification.

For infrastructure purposes, MCP is becoming a foundational plumbing layer for AI applications — the equivalent of what REST APIs did for web services. Builders increasingly run personal or team MCP servers locally, and organizations are deploying them to expose internal tools to AI agents. The ecosystem of pre-built MCP servers for common services (GitHub, Slack, databases, search) is growing rapidly, which means builders can often add a tool capability in minutes rather than building the integration from scratch.
