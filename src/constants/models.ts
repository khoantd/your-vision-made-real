export const CHAT_MODELS = [
  { value: "gemini-2.0-flash-exp", label: "Gemini 2.0 Flash Experimental" },
  { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
  { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
  { value: "gemini-1.0-pro", label: "Gemini 1.0 Pro" },
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