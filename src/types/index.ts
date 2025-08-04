export type ViewType = "chat" | "stream" | "generate-media" | "build" | "history";

export interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  view?: ViewType;
  hasDropdown?: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
  isLoading?: boolean;
}

export interface ModelConfig {
  name: string;
  provider: "google" | "openai";
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string;
  systemPrompt?: string;
  apiTimeout?: number;
  streaming?: boolean;
  logProbabilities?: boolean;
  apiKey?: string;
}

export interface StreamConfig {
  audioEnabled: boolean;
  videoEnabled: boolean;
  quality: "low" | "medium" | "high";
  frameRate: number;
}

export interface MediaGenerationConfig {
  model: string;
  aspectRatio: string;
  quality: string;
  steps: number;
  guidance: number;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface OpenAIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}