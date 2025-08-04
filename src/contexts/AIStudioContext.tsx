import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { ViewType, ModelConfig, StreamConfig, MediaGenerationConfig, OpenAIConfig } from "@/types";
import { saveUserSettings, loadUserSettings, UserSettingsData } from "@/services/userSettings";
import { useAuth } from "@/hooks/useAuth";

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
  testApiKey: (provider: "openai" | "google", key: string) => Promise<boolean>;
}

const AIStudioContext = createContext<AIStudioContextType | undefined>(undefined);

interface AIStudioProviderProps {
  children: ReactNode;
}

export const AIStudioProvider: React.FC<AIStudioProviderProps> = ({ children }) => {
  const { user } = useAuth();
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

  const testApiKey = useCallback(async (provider: "openai" | "google", key: string): Promise<boolean> => {
    try {
      console.log(`Testing API key for ${provider}...`);
      
      if (provider === "openai") {
        // Validate format first
        if (!key.startsWith("sk-") || key.length < 40) {
          console.error("Invalid OpenAI API key format");
          return false;
        }
        
        const response = await fetch("https://api.openai.com/v1/models", {
          headers: {
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json"
          }
        });
        
        const result = response.ok;
        console.log(`API key test result for ${provider}:`, result);
        return result;
      } else if (provider === "google") {
        // Basic validation for Google API key format
        return key.startsWith("AIza") && key.length > 20;
      }
      
      return false;
    } catch (error) {
      console.error(`API key test failed for ${provider}:`, error);
      return false;
    }
  }, []);

  // Load settings when user logs in
  useEffect(() => {
    if (user) {
      loadUserSettings().then((settings) => {
        if (settings) {
          if (settings.activeView) setActiveView(settings.activeView as ViewType);
          if (settings.modelConfig) setModelConfig(prev => ({ ...prev, ...settings.modelConfig }));
          if (settings.streamConfig) setStreamConfig(prev => ({ ...prev, ...settings.streamConfig }));
          if (settings.mediaConfig) setMediaConfig(prev => ({ ...prev, ...settings.mediaConfig }));
          if (settings.openAIConfig) setOpenAIConfig(prev => ({ ...prev, ...settings.openAIConfig }));
          if (settings.apiKeys) setApiKeys(prev => ({ ...prev, ...settings.apiKeys }));
        }
      }).catch(console.error);
    }
  }, [user]);

  // Save settings when they change (debounced)
  useEffect(() => {
    if (!user) return;
    
    const timeout = setTimeout(() => {
      const settings: UserSettingsData = {
        activeView,
        modelConfig,
        streamConfig,
        mediaConfig,
        openAIConfig,
        apiKeys
      };
      saveUserSettings(settings).catch(console.error);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [user, activeView, modelConfig, streamConfig, mediaConfig, openAIConfig, apiKeys]);

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
    testApiKey,
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