export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatCompletionRequest {
  model: string;
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export class OpenAIService {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseURL = "https://api.openai.com/v1";
  }

  async testAPIKey(): Promise<boolean> {
    try {
      console.log("Testing API key...");
      const response = await fetch(`${this.baseURL}/models`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API key test failed:", errorData);
        return false;
      }

      const data = await response.json();
      console.log("API key test successful, available models:", data.data?.length || 0);
      return true;
    } catch (error) {
      console.error("API key test error:", error);
      return false;
    }
  }

  async createChatCompletion(request: ChatCompletionRequest): Promise<OpenAIResponse> {
    try {
      console.log("Making OpenAI API request:", {
        model: request.model,
        messages: request.messages.length,
        temperature: request.temperature
      });

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("OpenAI API Error Response:", errorData);
        throw new Error(
          errorData.error?.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("OpenAI API response received");
      return result;
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw error;
    }
  }

  async streamChatCompletion(
    request: ChatCompletionRequest,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ) {
    try {
      console.log("Starting stream request with model:", request.model);
      
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          ...request,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Stream request failed:", errorData);
        throw new Error(
          errorData.error?.message || `HTTP error! status: ${response.status}`
        );
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      console.log("Stream reader created, starting to read chunks");

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            console.log("Stream completed");
            onComplete();
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              
              if (data === "[DONE]") {
                console.log("Stream marked as done");
                onComplete();
                return;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content;
                if (content) {
                  console.log("Received content chunk:", content.substring(0, 20) + "...");
                  onChunk(content);
                }
              } catch (e) {
                // Skip invalid JSON chunks
                console.log("Skipping invalid JSON chunk:", line);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error("OpenAI Stream Error:", error);
      onError(error as Error);
    }
  }
} 