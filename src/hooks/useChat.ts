import { useState, useCallback, useRef } from "react";
import { ChatMessage, ChatState, ModelConfig } from "@/types";
import { OpenAIService } from "@/lib/openai";
import { conversationService, Conversation } from "@/services/conversationService";
import { useAuth } from "@/hooks/useAuth";

export const useChat = (modelConfig: ModelConfig) => {
  const { user } = useAuth();
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  const openaiServiceRef = useRef<OpenAIService | null>(null);

  const initializeOpenAI = useCallback((apiKey: string) => {
    console.log("Initializing OpenAI service with API key:", apiKey ? `${apiKey.substring(0, 10)}...` : "undefined");
    openaiServiceRef.current = new OpenAIService(apiKey);
  }, []);

  const addMessage = useCallback((message: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      error: null,
    }));
  }, []);

  const updateLastMessage = useCallback((updates: Partial<ChatMessage>) => {
    setChatState(prev => ({
      ...prev,
      messages: prev.messages.map((msg, index) => 
        index === prev.messages.length - 1 ? { ...msg, ...updates } : msg
      ),
    }));
  }, []);

  const sendMessage = useCallback(async (content: string, apiKey: string) => {
    console.log("sendMessage called with:", { content: content.substring(0, 50) + "...", apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : "undefined" });
    
    if (!content.trim()) {
      console.log("Content is empty, returning");
      return;
    }

    if (!apiKey || apiKey.trim() === "") {
      console.error("API key is missing or empty");
      throw new Error("API key is required");
    }

    // Initialize OpenAI service if not already done
    if (!openaiServiceRef.current) {
      console.log("Initializing OpenAI service");
      initializeOpenAI(apiKey);
    }

    // Create or get conversation if user is authenticated
    let conversation = currentConversation;
    if (user && !conversation) {
      try {
        const title = conversationService.generateConversationTitle([{ content, role: 'user' } as any]);
        conversation = await conversationService.createConversation(title, modelConfig);
        setCurrentConversation(conversation);
      } catch (error) {
        console.error('Failed to create conversation:', error);
      }
    }

    // Add user message
    addMessage({
      content,
      role: "user",
    });

    // Save user message to database if conversation exists
    if (user && conversation) {
      try {
        await conversationService.addMessage(conversation.id, 'user', content);
      } catch (error) {
        console.error('Failed to save user message:', error);
      }
    }

    // Add loading assistant message
    const loadingMessageId = Date.now().toString();
    const loadingMessage: ChatMessage = {
      id: loadingMessageId,
      content: "",
      role: "assistant",
      timestamp: new Date(),
      isLoading: true,
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, loadingMessage],
      isLoading: true,
      error: null,
    }));

    try {
      console.log("Preparing messages for OpenAI API");
      
      // Prepare messages for OpenAI API
      const messages = chatState.messages
        .filter(msg => !msg.isLoading)
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

      // Add the new user message
      messages.push({
        role: "user" as const,
        content,
      });

      console.log("Messages prepared:", messages.length, "messages");

      // Get OpenAI model name from config
      const openaiModel = modelConfig.name.startsWith("gpt-") 
        ? modelConfig.name 
        : "gpt-4o"; // fallback

      console.log("Using model:", openaiModel);

      const request = {
        model: openaiModel,
        messages,
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.maxTokens,
        top_p: modelConfig.topP,
        frequency_penalty: modelConfig.frequencyPenalty || 0,
        presence_penalty: modelConfig.presencePenalty || 0,
      };

      console.log("OpenAI request:", {
        model: request.model,
        temperature: request.temperature,
        max_tokens: request.max_tokens,
        messages_count: request.messages.length
      });

      let assistantResponse = "";

      // Stream the response
      console.log("Starting stream request");
      await openaiServiceRef.current!.streamChatCompletion(
        request,
        (chunk) => {
          console.log("Received chunk:", chunk);
          assistantResponse += chunk;
          updateLastMessage({ content: assistantResponse, isLoading: false });
        },
        async () => {
          console.log("Stream completed");
          setChatState(prev => ({ ...prev, isLoading: false }));
          
          // Save assistant message to database if conversation exists
          if (user && conversation && assistantResponse) {
            try {
              await conversationService.addMessage(conversation.id, 'assistant', assistantResponse);
            } catch (error) {
              console.error('Failed to save assistant message:', error);
            }
          }
        },
        (error) => {
          console.error("OpenAI API Error:", error);
          setChatState(prev => ({
            ...prev,
            isLoading: false,
            error: error.message,
          }));
          updateLastMessage({ 
            content: "Sorry, I encountered an error. Please try again.",
            isLoading: false 
          });
        }
      );

    } catch (error) {
      console.error("Chat Error:", error);
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "An error occurred",
      }));
      updateLastMessage({ 
        content: "Sorry, I encountered an error. Please try again.",
        isLoading: false 
      });
    }
  }, [chatState.messages, modelConfig, addMessage, updateLastMessage, initializeOpenAI, user, currentConversation]);

  const clearChat = useCallback(() => {
    setChatState({
      messages: [],
      isLoading: false,
      error: null,
    });
    setCurrentConversation(null);
  }, []);

  const removeMessage = useCallback((messageId: string) => {
    setChatState(prev => ({
      ...prev,
      messages: prev.messages.filter(msg => msg.id !== messageId),
    }));
  }, []);

  const loadConversation = useCallback(async (conversationId: string) => {
    try {
      const conversation = await conversationService.getConversation(conversationId);
      if (conversation) {
        setCurrentConversation(conversation);
        
        // Convert conversation messages to chat messages
        const chatMessages: ChatMessage[] = conversation.messages?.map(msg => ({
          id: msg.id,
          content: msg.content,
          role: msg.role,
          timestamp: new Date(msg.created_at),
        })) || [];

        setChatState({
          messages: chatMessages,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
      setChatState(prev => ({
        ...prev,
        error: 'Failed to load conversation',
      }));
    }
  }, []);

  const newConversation = useCallback(() => {
    clearChat();
  }, [clearChat]);

  return {
    chatState,
    currentConversation,
    sendMessage,
    addMessage,
    updateLastMessage,
    clearChat,
    removeMessage,
    initializeOpenAI,
    loadConversation,
    newConversation,
  };
}; 