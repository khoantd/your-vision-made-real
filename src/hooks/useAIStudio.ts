import { useState, useCallback } from "react";
import { ViewType, ModelConfig, StreamConfig, MediaGenerationConfig } from "@/types";

export const useAIStudio = () => {
  const [activeView, setActiveView] = useState<ViewType>("chat");
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    name: "gemini-2.0-flash-exp",
    provider: "google",
    temperature: 1.0,
    maxTokens: 8192,
    topP: 0.95,
    topK: 40,
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

  const updateModelConfig = useCallback((updates: Partial<ModelConfig>) => {
    setModelConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateStreamConfig = useCallback((updates: Partial<StreamConfig>) => {
    setStreamConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateMediaConfig = useCallback((updates: Partial<MediaGenerationConfig>) => {
    setMediaConfig(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    activeView,
    setActiveView,
    modelConfig,
    updateModelConfig,
    streamConfig,
    updateStreamConfig,
    mediaConfig,
    updateMediaConfig,
  };
};