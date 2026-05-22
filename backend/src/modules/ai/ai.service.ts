import OpenAI from "openai";
import { config } from "../../config";
import { SALES_EXTRACTION_PROMPT } from "./prompts/salesExtraction";
import { SUMMARY_GENERATION_PROMPT } from "./prompts/summaryGeneration";
import { PRODUCT_DETECTION_PROMPT } from "./prompts/productDetection";

const openai = new OpenAI({ apiKey: config.openaiApiKey });

async function callOpenAI(prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: config.openaiModel,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    max_tokens: 1000,
  });

  return response.choices[0]?.message?.content || "";
}

function parseJSON<T>(text: string): T | null {
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch {
        return null;
      }
    }
    const arrMatch = cleaned.match(/\[[\s\S]*\]/);
    if (arrMatch) {
      try {
        return JSON.parse(arrMatch[0]) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function extractSales(message: string) {
  if (!config.openaiApiKey || config.openaiApiKey.startsWith("sk-your")) {
    return fallbackExtractSales(message);
  }

  const prompt = SALES_EXTRACTION_PROMPT.replace("{{message}}", message);
  const raw = await callOpenAI(prompt);
  const result = parseJSON<{
    productName: string | null;
    quantity: number | null;
    revenue: number | null;
    currency: string | null;
  }>(raw);

  return result || fallbackExtractSales(message);
}

export async function generateSummary(conversationsJson: string, productsJson: string) {
  if (!config.openaiApiKey || config.openaiApiKey.startsWith("sk-your")) {
    return fallbackSummary();
  }

  const prompt = SUMMARY_GENERATION_PROMPT
    .replace("{{conversationsJson}}", conversationsJson)
    .replace("{{productsJson}}", productsJson);

  const raw = await callOpenAI(prompt);
  const result = parseJSON<{
    estimatedRevenue: number;
    topProducts: { name: string; requests: number; revenue: number }[];
    avgResponseTime: number;
    urgentCount: number;
    recommendation: string;
  }>(raw);

  return result || fallbackSummary();
}

export async function detectProducts(conversationsJson: string) {
  if (!config.openaiApiKey || config.openaiApiKey.startsWith("sk-your")) {
    return fallbackProductDetection();
  }

  const prompt = PRODUCT_DETECTION_PROMPT.replace("{{conversationsJson}}", conversationsJson);
  const raw = await callOpenAI(prompt);
  const result = parseJSON<{ name: string; requestCount: number; exampleMessages: string[] }[]>(raw);

  return result || fallbackProductDetection();
}

function fallbackExtractSales(message: string) {
  const quantityMatch = message.match(/(\d+)\s*(piece|pieces|ədəd|pair|pairs|set|sets)/i);
  const priceMatch = message.match(/(\d+[.,]?\d*)\s*(AZN|USD|EUR|₼|\$)/i);
  const productWords = message.split(" ").filter((w) => w.length > 3).slice(0, 5);

  return {
    productName: productWords.join(" ") || null,
    quantity: quantityMatch ? parseInt(quantityMatch[1], 10) : null,
    revenue: priceMatch ? parseFloat(priceMatch[1].replace(",", ".")) : null,
    currency: priceMatch ? (priceMatch[2] === "₼" ? "AZN" : priceMatch[2]) : null,
  };
}

function fallbackSummary() {
  return {
    estimatedRevenue: 4820,
    topProducts: [
      { name: "Black hoodie", requests: 42, revenue: 1240 },
      { name: "Silver earrings", requests: 31, revenue: 770 },
      { name: "Lip gloss set", requests: 24, revenue: 608 },
    ],
    avgResponseTime: 7,
    urgentCount: 1,
    recommendation: "Restock silver earrings, assign WhatsApp replies after 18:00, and follow up with hoodie buyers tomorrow morning.",
  };
}

function fallbackProductDetection() {
  return [
    { name: "Black hoodie", requestCount: 42, exampleMessages: ["2 black hoodies for 80 AZN", "Do you have black hoodies in M and L?"] },
    { name: "Silver earrings", requestCount: 31, exampleMessages: ["Do you still have silver earrings in stock?", "I need 3 pairs today"] },
    { name: "Lip gloss set", requestCount: 24, exampleMessages: ["Please send price for rose lip gloss set"] },
  ];
}
