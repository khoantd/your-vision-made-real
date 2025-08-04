import { useState, useCallback, useEffect } from "react";
import { OpenAIService } from "@/lib/openai";

export interface ModelInfo {
  id: string;
  name: string;
  description?: string;
  capabilities?: string[];
  maxTokens?: number;
  pricing?: {
    input: string;
    output: string;
  };
}

export interface ProviderModels {
  google: ModelInfo[];
  openai: ModelInfo[];
}

export const useModelLoader = () => {
  const [models, setModels] = useState<ProviderModels>({
    google: [],
    openai: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyValid, setApiKeyValid] = useState<{
    google: boolean;
    openai: boolean;
  }>({
    google: false,
    openai: false
  });

  // Load OpenAI models when API key is provided
  const loadOpenAIModels = useCallback(async (apiKey: string) => {
    if (!apiKey || !apiKey.trim()) {
      setModels(prev => ({ ...prev, openai: [] }));
      setApiKeyValid(prev => ({ ...prev, openai: false }));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const openaiService = new OpenAIService(apiKey);
      const isValid = await openaiService.testAPIKey();
      
      if (!isValid) {
        setError("Invalid OpenAI API key");
        setApiKeyValid(prev => ({ ...prev, openai: false }));
        setModels(prev => ({ ...prev, openai: [] }));
        return;
      }

      // For now, we'll use a predefined list of OpenAI models
      // In a real implementation, you'd fetch this from OpenAI's API
      const openaiModels: ModelInfo[] = [
        {
          id: "gpt-4o",
          name: "GPT-4o",
          description: "Most capable model for complex tasks",
          capabilities: ["text", "vision", "function-calling"],
          maxTokens: 128000,
          pricing: {
            input: "$5.00 / 1M tokens",
            output: "$15.00 / 1M tokens"
          }
        },
        {
          id: "gpt-4o-mini",
          name: "GPT-4o Mini",
          description: "Fast and efficient for most tasks",
          capabilities: ["text", "function-calling"],
          maxTokens: 128000,
          pricing: {
            input: "$0.15 / 1M tokens",
            output: "$0.60 / 1M tokens"
          }
        },
        {
          id: "gpt-4-turbo",
          name: "GPT-4 Turbo",
          description: "Previous generation with knowledge cutoff",
          capabilities: ["text", "function-calling"],
          maxTokens: 128000,
          pricing: {
            input: "$10.00 / 1M tokens",
            output: "$30.00 / 1M tokens"
          }
        },
        {
          id: "gpt-3.5-turbo",
          name: "GPT-3.5 Turbo",
          description: "Fast and cost-effective",
          capabilities: ["text", "function-calling"],
          maxTokens: 16385,
          pricing: {
            input: "$0.50 / 1M tokens",
            output: "$1.50 / 1M tokens"
          }
        }
      ];

      setModels(prev => ({ ...prev, openai: openaiModels }));
      setApiKeyValid(prev => ({ ...prev, openai: true }));
    } catch (error) {
      console.error("Failed to load OpenAI models:", error);
      setError("Failed to load OpenAI models. Please check your API key.");
      setApiKeyValid(prev => ({ ...prev, openai: false }));
      setModels(prev => ({ ...prev, openai: [] }));
    } finally {
      setLoading(false);
    }
  }, []);

  // Load Google models (these are predefined since Google doesn't have a public models API)
  const loadGoogleModels = useCallback(async (apiKey: string) => {
    if (!apiKey || !apiKey.trim()) {
      setModels(prev => ({ ...prev, google: [] }));
      setApiKeyValid(prev => ({ ...prev, google: false }));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API key validation for Google
      // In a real implementation, you'd validate against Google's API
      const isValid = apiKey.startsWith("AIza") && apiKey.length > 20;
      
      if (!isValid) {
        setError("Invalid Google API key");
        setApiKeyValid(prev => ({ ...prev, google: false }));
        setModels(prev => ({ ...prev, google: [] }));
        return;
      }

      const googleModels: ModelInfo[] = [
        {
          id: "gemini-2.0-flash-exp",
          name: "Gemini 2.0 Flash Experimental",
          description: "Latest experimental model with enhanced capabilities",
          capabilities: ["text", "vision", "function-calling"],
          maxTokens: 1000000,
          pricing: {
            input: "$0.075 / 1M tokens",
            output: "$0.30 / 1M tokens"
          }
        },
        {
          id: "gemini-1.5-pro",
          name: "Gemini 1.5 Pro",
          description: "Most capable model for complex reasoning",
          capabilities: ["text", "vision", "function-calling"],
          maxTokens: 1000000,
          pricing: {
            input: "$3.50 / 1M tokens",
            output: "$10.50 / 1M tokens"
          }
        },
        {
          id: "gemini-1.5-flash",
          name: "Gemini 1.5 Flash",
          description: "Fast and efficient for most tasks",
          capabilities: ["text", "vision", "function-calling"],
          maxTokens: 1000000,
          pricing: {
            input: "$0.075 / 1M tokens",
            output: "$0.30 / 1M tokens"
          }
        },
        {
          id: "gemini-1.0-pro",
          name: "Gemini 1.0 Pro",
          description: "Previous generation model",
          capabilities: ["text", "vision"],
          maxTokens: 30000,
          pricing: {
            input: "$0.50 / 1M tokens",
            output: "$1.50 / 1M tokens"
          }
        }
      ];

      setModels(prev => ({ ...prev, google: googleModels }));
      setApiKeyValid(prev => ({ ...prev, google: true }));
    } catch (error) {
      console.error("Failed to load Google models:", error);
      setError("Failed to load Google models. Please check your API key.");
      setApiKeyValid(prev => ({ ...prev, google: false }));
      setModels(prev => ({ ...prev, google: [] }));
    } finally {
      setLoading(false);
    }
  }, []);

  // Load models for a specific provider
  const loadModelsForProvider = useCallback(async (provider: "google" | "openai", apiKey: string) => {
    if (provider === "openai") {
      await loadOpenAIModels(apiKey);
    } else if (provider === "google") {
      await loadGoogleModels(apiKey);
    }
  }, [loadOpenAIModels, loadGoogleModels]);

  // Auto-load models when provider or API key changes
  const autoLoadModels = useCallback((provider: "google" | "openai", apiKey: string) => {
    if (apiKey && apiKey.trim()) {
      loadModelsForProvider(provider, apiKey);
    } else {
      // Clear models for the provider if no API key
      setModels(prev => ({ ...prev, [provider]: [] }));
      setApiKeyValid(prev => ({ ...prev, [provider]: false }));
    }
  }, [loadModelsForProvider]);

  return {
    models,
    loading,
    error,
    apiKeyValid,
    loadModelsForProvider,
    autoLoadModels,
    clearError: () => setError(null)
  };
}; 