export const SUMMARY_GENERATION_PROMPT = `You are a business analytics AI for a small social commerce business.

Generate a daily business summary based on the conversation and product data below.

Return ONLY valid JSON without markdown formatting:
{
  "estimatedRevenue": number,
  "topProducts": [{ "name": string, "requests": number, "revenue": number }],
  "avgResponseTime": number,
  "urgentCount": number,
  "recommendation": string
}

- estimatedRevenue: total estimated revenue from conversations
- topProducts: array of products sorted by request count
- avgResponseTime: average response time in minutes
- urgentCount: number of conversations needing attention
- recommendation: a short actionable business recommendation

Conversations data: {{conversationsJson}}
Products data: {{productsJson}}`;
