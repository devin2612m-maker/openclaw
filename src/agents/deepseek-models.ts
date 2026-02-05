import type { ModelDefinitionConfig } from "../config/types.js";

export const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";
export const DEEPSEEK_DEFAULT_MODEL_ID = "deepseek-chat";
export const DEEPSEEK_DEFAULT_MODEL_REF = `deepseek/${DEEPSEEK_DEFAULT_MODEL_ID}`;

// DeepSeek pricing (per million tokens, USD):
// - deepseek-chat: $0.14 input (cache hit $0.014), $0.28 output
// - deepseek-reasoner: $0.55 input (cache hit $0.14), $2.19 output
export const DEEPSEEK_CHAT_COST = {
  input: 0.14,
  output: 0.28,
  cacheRead: 0.014,
  cacheWrite: 0.14,
};

export const DEEPSEEK_REASONER_COST = {
  input: 0.55,
  output: 2.19,
  cacheRead: 0.14,
  cacheWrite: 0.55,
};

/**
 * DeepSeek model catalog.
 *
 * DeepSeek provides an OpenAI-compatible API at https://api.deepseek.com/v1
 *
 * Models:
 * - deepseek-chat: DeepSeek V3, general-purpose chat model
 * - deepseek-reasoner: DeepSeek R1, reasoning model with chain-of-thought
 */
export const DEEPSEEK_MODEL_CATALOG = [
  {
    id: "deepseek-chat",
    name: "DeepSeek Chat (V3)",
    reasoning: false,
    input: ["text"],
    contextWindow: 64000,
    maxTokens: 8192,
    cost: DEEPSEEK_CHAT_COST,
  },
  {
    id: "deepseek-reasoner",
    name: "DeepSeek Reasoner (R1)",
    reasoning: true,
    input: ["text"],
    contextWindow: 64000,
    maxTokens: 8192,
    cost: DEEPSEEK_REASONER_COST,
  },
] as const;

export type DeepSeekCatalogEntry = (typeof DEEPSEEK_MODEL_CATALOG)[number];

export function buildDeepSeekModelDefinition(entry: DeepSeekCatalogEntry): ModelDefinitionConfig {
  return {
    id: entry.id,
    name: entry.name,
    reasoning: entry.reasoning,
    input: [...entry.input],
    cost: entry.cost,
    contextWindow: entry.contextWindow,
    maxTokens: entry.maxTokens,
  };
}
