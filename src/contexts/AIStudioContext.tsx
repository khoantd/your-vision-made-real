import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ViewType, ModelConfig, StreamConfig, MediaGenerationConfig, OpenAIConfig } from "@/types";

interface AIStudioContextType {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  modelConfig: ModelConfig;
  updateModelConfig: (updates: Partial<ModelConfig>) => void;
  streamConfig: StreamConfig;
  updateStreamConfig: (updates: Partial<StreamConfig>) => void;
  mediaConfig: MediaGenerationConfig;
  updateMediaConfig: (updates: Partial<MediaGenerationConfig>) => void;
  openAIConfig: OpenAIConfig;
  updateOpenAIConfig: (updates: Partial<OpenAIConfig>) => void;
  apiKeys: {
    openai: string;
    google: string;
  };
  updateApiKey: (provider: "openai" | "google", key: string) => void;
}

const AIStudioContext = createContext<AIStudioContextType | undefined>(undefined);

interface AIStudioProviderProps {
  children: ReactNode;
}

export const AIStudioProvider: React.FC<AIStudioProviderProps> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewType>("chat");
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    name: "gpt-4o",
    provider: "openai",
    temperature: 1.0,
    maxTokens: 8192,
    topP: 0.95,
    topK: 40,
    frequencyPenalty: 0,
    presencePenalty: 0,
  });

  const [streamConfig, setStreamConfig] = useState<StreamConfig>({
    audioEnabled: true,
    videoEnabled: false,
    quality: "medium",
    frameRate: 30,
  });

  const [mediaConfig, setMediaConfig] = useState<MediaGenerationConfig>({
    model: "imagen-3",
    aspectRatio: "1:1",
    quality: "high",
    steps: 50,
    guidance: 7.5,
  });

  const [openAIConfig, setOpenAIConfig] = useState<OpenAIConfig>({
    apiKey: "",
    model: "gpt-4o",
    temperature: 1.0,
    maxTokens: 8192,
    topP: 0.95,
    frequencyPenalty: 0,
    presencePenalty: 0,
  });

  const [apiKeys, setApiKeys] = useState({
    openai: "",
    google: ""
  });

  const updateModelConfig = useCallback((updates: Partial<ModelConfig>) => {
    setModelConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateStreamConfig = useCallback((updates: Partial<StreamConfig>) => {
    setStreamConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateMediaConfig = useCallback((updates: Partial<MediaGenerationConfig>) => {
    setMediaConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateOpenAIConfig = useCallback((updates: Partial<OpenAIConfig>) => {
    console.log("updateOpenAIConfig called with:", updates);
    setOpenAIConfig(prev => {
      const newConfig = { ...prev, ...updates };
      console.log("OpenAI config updated:", {
        apiKey: newConfig.apiKey ? `${newConfig.apiKey.substring(0, 10)}...` : "undefined"
      });
      return newConfig;
    });
  }, []);

  const updateApiKey = useCallback((provider: "openai" | "google", key: string) => {
    console.log(`updateApiKey called for ${provider}:`, key ? `${key.substring(0, 10)}...` : "undefined");
    setApiKeys(prev => ({ ...prev, [provider]: key }));
    
    // Update the main config if this is the current provider
    if (provider === modelConfig.provider) {
      updateModelConfig({ apiKey: key });
    }
  }, [modelConfig.provider, updateModelConfig]);

  const value: AIStudioContextType = {
    activeView,
    setActiveView,
    modelConfig,
    updateModelConfig,
    streamConfig,
    updateStreamConfig,
    mediaConfig,
    updateMediaConfig,
    openAIConfig,
    updateOpenAIConfig,
    apiKeys,
    updateApiKey,
  };

  return (
    <AIStudioContext.Provider value={value}>
      {children}
    </AIStudioContext.Provider>
  );
};

export const useAIStudio = (): AIStudioContextType => {
  const context = useContext(AIStudioContext);
  if (context === undefined) {
    throw new Error("useAIStudio must be used within an AIStudioProvider");
  }
  return context;
}; 