export const SALES_EXTRACTION_PROMPT = `You are an AI assistant for a small business. Extract sales information from this customer message.

Return ONLY valid JSON without markdown formatting:
{
  "productName": string | null,
  "quantity": number | null,
  "revenue": number | null,
  "currency": string | null
}

- Product name should be the item being requested
- Quantity is the number of items
- Revenue is the total price mentioned
- Currency is the currency code (AZN, USD, etc.) or null if not specified
- If no sales information is found, return null for all fields

Message: "{{message}}"`;
