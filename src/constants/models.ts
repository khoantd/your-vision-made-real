export const CHAT_MODELS = [
  // Google Models
  { value: "gemini-2.0-flash-exp", label: "Gemini 2.0 Flash Experimental", provider: "google" },
  { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro", provider: "google" },
  { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash", provider: "google" },
  { value: "gemini-1.0-pro", label: "Gemini 1.0 Pro", provider: "google" },
  
  // OpenAI Models
  { value: "gpt-4.1-2025-04-14", label: "GPT-4.1 (Flagship)", provider: "openai", badge: "Recommended" },
  { value: "o3-2025-04-16", label: "O3 (Reasoning)", provider: "openai", badge: "Reasoning" },
  { value: "o4-mini-2025-04-16", label: "O4 Mini (Fast)", provider: "openai", badge: "Fast" },
  { value: "gpt-4.1-mini-2025-04-14", label: "GPT-4.1 Mini", provider: "openai" },
  { value: "gpt-4o", label: "GPT-4o (Legacy)", provider: "openai" },
];

export const MEDIA_MODELS = [
  {
    id: "imagen-3",
    name: "Imagen 3",
    description: "Google's most capable image generation model",
    badge: "New",
    type: "image" as const
  },
  {
    id: "imagen-2",
    name: "Imagen 2",
    description: "High-quality image generation",
    type: "image" as const
  },
  {
    id: "veo-2",
    name: "Veo 2",
    description: "Advanced video generation model",
    badge: "New",
    type: "video" as const
  },
  {
    id: "veo-1",
    name: "Veo",
    description: "Video generation and editing",
    type: "video" as const
  }
];

export const EXAMPLE_PROMPTS = [
  "A serene mountain landscape at sunset",
  "A futuristic city with flying cars",
  "A cozy library with floating books",
  "An underwater garden with glowing plants"
];