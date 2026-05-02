---
slug: ai-cogs
term: AI COGS
type: Concept
topic: Business Models
familiarity: Specialist
aliases:
  - cost of goods sold AI
  - AI gross margin
  - AI cost structure
  - AI unit economics
related:
  - inference-cost
  - ai-native-saas
  - usage-based-pricing
  - hybrid-pricing
  - byok
dateAdded: '2026-05-02'
shortDef: >-
  The direct costs that scale with every AI query: model API fees, GPU compute,
  vector database lookups, and related infrastructure. Unlike traditional SaaS,
  AI products have meaningful variable costs that compress gross margins.
---
COGS stands for cost of goods sold: the direct costs you incur to deliver your product. For traditional software, COGS is mostly hosting and support, and it's small relative to revenue. AI changes this because every time your product calls a model or runs an inference, there's a real cost attached. Those token fees, compute charges, and database query costs go straight into COGS.

The result is that AI-native companies typically report gross margins of 50 to 60%, well below the 80 to 90% that mature SaaS companies achieve. This is not inherently bad, but it has serious implications for pricing, fundraising narrative, and long-term sustainability. A product that looks profitable on revenue might be deeply margin-negative once inference costs are fully accounted for.

Founders often undercount AI COGS early on because they do rough token math without factoring in the full stack: retries on failed requests, context window overhead, caching misses, embedding generation, vector database storage, and logging. Each piece is small; together they can meaningfully change the unit economics. Good practice is to track cost per active user and cost per workflow from day one, and design pricing that maintains target margins at both current and projected scale.
