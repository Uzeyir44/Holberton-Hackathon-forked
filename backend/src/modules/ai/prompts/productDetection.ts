export const PRODUCT_DETECTION_PROMPT = `You are an AI that analyzes customer conversations to detect product demand.

Analyze these conversations and identify products customers are asking about. Aggregate by product name and count how many times each product is requested.

Return ONLY valid JSON without markdown formatting:
[
  { "name": string, "requestCount": number, "exampleMessages": string[] }
]

- name: the product name as mentioned by customers
- requestCount: how many times this product was mentioned
- exampleMessages: up to 2 example messages mentioning this product

Conversations: {{conversationsJson}}`;
