/**
 * AI Provider Configuration
 *
 * Supports multiple AI providers and models via environment variables.
 * Defaults to OpenAI/Gemini via AI Gateway if no specific provider is configured.
 */

import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { createGateway } from "ai";

export type AIProvider =
  | "openai"
  | "anthropic"
  | "google"
  | "ollama"
  | "openrouter"
  | "ai-gateway";

export interface AIProviderConfig {
  provider: AIProvider;
  model: string;
  apiKey?: string;
  baseURL?: string;
}

/**
 * Get the configured AI provider from environment variables
 * Priority:
 * 1. AI_PROVIDER env var (explicit provider selection)
 * 2. AI_GATEWAY_API_KEY (default: AI Gateway)
 * 3. OPENAI_API_KEY (fallback: OpenAI)
 */
export function getAIProviderConfig(): AIProviderConfig {
  // Check for explicit provider selection
  const providerEnv = process.env.AI_PROVIDER?.toLowerCase() as
    | AIProvider
    | undefined;

  if (providerEnv === "ollama") {
    const baseURL = process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1";
    return {
      provider: "ollama",
      model: process.env.AI_MODEL || "llama3.3:70b",
      baseURL: baseURL.endsWith("/v1") ? baseURL : `${baseURL}/v1`,
    };
  }

  if (providerEnv === "openrouter") {
    return {
      provider: "openrouter",
      model: process.env.AI_MODEL || "meta-llama/llama-3.3-70b-instruct",
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL:
        process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
    };
  }

  if (providerEnv === "anthropic") {
    return {
      provider: "anthropic",
      model: process.env.AI_MODEL || "claude-3-5-sonnet-20241022",
      apiKey: process.env.ANTHROPIC_API_KEY,
    };
  }

  if (providerEnv === "google") {
    return {
      provider: "google",
      model: process.env.AI_MODEL || "gemini-2.0-flash-exp",
      apiKey: process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY,
    };
  }

  if (providerEnv === "openai") {
    return {
      provider: "openai",
      model: process.env.AI_MODEL || "gpt-4o",
      apiKey: process.env.OPENAI_API_KEY,
    };
  }

  // Default: AI Gateway (supports multiple providers)
  const aiGatewayKey = process.env.AI_GATEWAY_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (aiGatewayKey) {
    return {
      provider: "ai-gateway",
      model: process.env.AI_MODEL || "openai/gpt-5.1-instant",
      apiKey: aiGatewayKey,
    };
  }

  if (openaiKey) {
    return {
      provider: "openai",
      model: process.env.AI_MODEL || "gpt-4o",
      apiKey: openaiKey,
    };
  }

  // Fallback to AI Gateway with default model
  return {
    provider: "ai-gateway",
    model: "openai/gpt-5.1-instant",
  };
}

/**
 * Get the AI model instance based on provider configuration
 */
export function getAIModel(config: AIProviderConfig) {
  const { provider, model, apiKey, baseURL } = config;

  switch (provider) {
    case "ai-gateway": {
      if (!apiKey) {
        throw new Error(
          "AI_GATEWAY_API_KEY is required for AI Gateway provider"
        );
      }
      const gateway = createGateway({
        apiKey,
      });
      return gateway(model);
    }

    case "openai": {
      if (!apiKey) {
        throw new Error("OPENAI_API_KEY is required for OpenAI provider");
      }
      // Set environment variable for AI SDK to pick up
      const originalKey = process.env.OPENAI_API_KEY;
      const originalBaseURL = process.env.OPENAI_BASE_URL;
      process.env.OPENAI_API_KEY = apiKey;
      if (baseURL) {
        process.env.OPENAI_BASE_URL = baseURL;
      }
      try {
        return openai(model);
      } finally {
        // Restore original values
        if (originalKey !== undefined) {
          process.env.OPENAI_API_KEY = originalKey;
        } else {
          delete process.env.OPENAI_API_KEY;
        }
        if (originalBaseURL !== undefined) {
          process.env.OPENAI_BASE_URL = originalBaseURL;
        } else {
          delete process.env.OPENAI_BASE_URL;
        }
      }
    }

    case "anthropic": {
      if (!apiKey) {
        throw new Error("ANTHROPIC_API_KEY is required for Anthropic provider");
      }
      const originalKey = process.env.ANTHROPIC_API_KEY;
      const originalBaseURL = process.env.ANTHROPIC_BASE_URL;
      process.env.ANTHROPIC_API_KEY = apiKey;
      if (baseURL) {
        process.env.ANTHROPIC_BASE_URL = baseURL;
      }
      try {
        return anthropic(model);
      } finally {
        if (originalKey !== undefined) {
          process.env.ANTHROPIC_API_KEY = originalKey;
        } else {
          delete process.env.ANTHROPIC_API_KEY;
        }
        if (originalBaseURL !== undefined) {
          process.env.ANTHROPIC_BASE_URL = originalBaseURL;
        } else {
          delete process.env.ANTHROPIC_BASE_URL;
        }
      }
    }

    case "google": {
      if (!apiKey) {
        throw new Error(
          "GOOGLE_AI_API_KEY or GEMINI_API_KEY is required for Google provider"
        );
      }
      const originalKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      const originalBaseURL = process.env.GOOGLE_GENERATIVE_AI_BASE_URL;
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = apiKey;
      if (baseURL) {
        process.env.GOOGLE_GENERATIVE_AI_BASE_URL = baseURL;
      }
      try {
        return google(model);
      } finally {
        if (originalKey !== undefined) {
          process.env.GOOGLE_GENERATIVE_AI_API_KEY = originalKey;
        } else {
          delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        }
        if (originalBaseURL !== undefined) {
          process.env.GOOGLE_GENERATIVE_AI_BASE_URL = originalBaseURL;
        } else {
          delete process.env.GOOGLE_GENERATIVE_AI_BASE_URL;
        }
      }
    }

    case "ollama": {
      // Ollama uses OpenAI-compatible API
      const ollamaBaseURL = baseURL || "http://localhost:11434/v1";
      const finalURL = ollamaBaseURL.endsWith("/v1")
        ? ollamaBaseURL
        : `${ollamaBaseURL}/v1`;
      const originalKey = process.env.OPENAI_API_KEY;
      const originalBaseURL = process.env.OPENAI_BASE_URL;
      process.env.OPENAI_API_KEY = "ollama"; // Ollama doesn't require a real API key
      process.env.OPENAI_BASE_URL = finalURL;
      try {
        return openai(model);
      } finally {
        if (originalKey !== undefined) {
          process.env.OPENAI_API_KEY = originalKey;
        } else {
          delete process.env.OPENAI_API_KEY;
        }
        if (originalBaseURL !== undefined) {
          process.env.OPENAI_BASE_URL = originalBaseURL;
        } else {
          delete process.env.OPENAI_BASE_URL;
        }
      }
    }

    case "openrouter": {
      if (!apiKey) {
        throw new Error(
          "OPENROUTER_API_KEY is required for OpenRouter provider"
        );
      }
      const openrouterBaseURL = baseURL || "https://openrouter.ai/api/v1";
      const originalKey = process.env.OPENAI_API_KEY;
      const originalBaseURL = process.env.OPENAI_BASE_URL;
      process.env.OPENAI_API_KEY = apiKey;
      process.env.OPENAI_BASE_URL = openrouterBaseURL;
      // Note: OpenRouter custom headers would need custom fetch wrapper
      // For now, using standard OpenAI provider pattern
      try {
        return openai(model);
      } finally {
        if (originalKey !== undefined) {
          process.env.OPENAI_API_KEY = originalKey;
        } else {
          delete process.env.OPENAI_API_KEY;
        }
        if (originalBaseURL !== undefined) {
          process.env.OPENAI_BASE_URL = originalBaseURL;
        } else {
          delete process.env.OPENAI_BASE_URL;
        }
      }
    }

    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

/**
 * Get available model options for each provider
 */
export function getAvailableModels(): Record<AIProvider, string[]> {
  return {
    "ai-gateway": [
      "openai/gpt-5.1-instant",
      "openai/gpt-5.2",
      "openai/gpt-5.2-pro",
      "openai/gpt-4o",
      "openai/gpt-4o-mini",
      "anthropic/claude-sonnet-4.5",
      "anthropic/claude-haiku-4.5",
      "anthropic/claude-opus-4.5",
      "anthropic/claude-3-5-sonnet-20241022",
      "meta/llama-4-scout",
      "meta/llama-4-maverick",
      "google/gemini-3-pro-preview",
      "google/gemini-2.5-flash-lite",
      "google/gemini-2.5-flash",
      "google/gemini-2.5-pro",
    ],
    openai: [
      "gpt-4o",
      "gpt-4o-mini",
      "gpt-4-turbo",
      "gpt-4",
      "gpt-3.5-turbo",
      "o1-preview",
      "o1-mini",
    ],
    anthropic: [
      "claude-3-5-sonnet-20241022",
      "claude-3-5-haiku-20241022",
      "claude-3-opus-20240229",
      "claude-3-sonnet-20240229",
      "claude-3-haiku-20240307",
    ],
    google: [
      "gemini-2.0-flash-exp",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-pro",
    ],
    ollama: [
      "llama3.3:70b",
      "deepseek-r1:32b",
      "qwen2.5-coder:32b",
      "gemma3:27b",
      "devstral:24b",
      "deepseek-coder-v2:16b",
      "qwen3:14b",
      "gemma2:9b",
      "llama3.1:8b",
      "dolphin-llama3:8b",
      "qwen2.5-coder:7b",
    ],
    openrouter: [
      "meta-llama/llama-3.3-70b-instruct",
      "deepseek/deepseek-r1:32b",
      "qwen/qwen-2.5-coder-32b-instruct",
      "google/gemma-2-27b-it",
      "stability-ai/stable-beluga-2",
      "deepseek/deepseek-coder-v2:16b",
      "qwen/qwen-2.5-14b-instruct",
      "google/gemma-2-9b-it",
      "meta-llama/llama-3.1-8b-instruct",
      "qwen/qwen-2.5-coder-7b-instruct",
    ],
  };
}
