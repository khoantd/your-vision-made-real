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
  role: "user" | "assistant";
  timestamp: Date;
}

export interface ModelConfig {
  name: string;
  provider: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
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