import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Play, HelpCircle, Code, Share, RotateCcw, MoreHorizontal, ChevronUp, ChevronDown, ThumbsUp, ThumbsDown, Edit, X, Copy, Maximize2, RotateCcw as Refresh, Send, TestTube, Sparkles, MessageSquare, Bot, User, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { FeatureCard } from "@/components/common/FeatureCard";
import { BaseLayout } from "@/components/common/BaseLayout";
import { EmptyState } from "@/components/common/EmptyState";
import { useAIStudio } from "@/contexts/AIStudioContext";
import { useChat } from "@/hooks/useChat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { OpenAIService } from "@/lib/openai";
import { ChatMessage } from "./ChatMessage";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const newFeatures = [
  {
    icon: "🔗",
    title: "URL context tool",
    description: "Fetch information from web links",
  },
  {
    icon: "🎵",
    title: "Native speech generation",
    description: "Generate high quality text to speech with Gemini",
  },
  {
    icon: "🎙️",
    title: "Live audio-to-audio dialog",
    description: "Try Gemini's natural, real-time dialog with audio and video inputs",
  },
  {
    icon: "🖼️",
    title: "Native image generation",
    description: "Interleaved text-and-image generation with Gemini 2.0 Flash",
  }
];

const quickPrompts = [
  "Explain quantum computing in simple terms",
  "Write a short story about time travel",
  "Help me plan a healthy meal",
  "What are the latest AI trends?",
  "Create a workout routine for beginners",
  "Explain machine learning to a 10-year-old"
];

export const ChatArea = () => {
  const { modelConfig, apiKeys } = useAIStudio();
  const { chatState, sendMessage, clearChat, loadConversation, currentConversation } = useChat(modelConfig);
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showThinking, setShowThinking] = useState(true);
  const [thinkingExpanded, setThinkingExpanded] = useState(true);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get the correct API key for the current provider
  const currentApiKey = apiKeys[modelConfig.provider];

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatState.messages]);

  // Listen for new chat events from sidebar
  useEffect(() => {
    const handleNewChat = () => {
      handleClearConfirm(); // Clear current chat
    };

    window.addEventListener('newChat', handleNewChat);
    return () => window.removeEventListener('newChat', handleNewChat);
  }, []);

  // Check for conversation to load from history
  useEffect(() => {
    const loadConversationId = sessionStorage.getItem('loadConversationId');
    if (loadConversationId) {
      sessionStorage.removeItem('loadConversationId');
      loadConversation(loadConversationId);
    }
  }, [loadConversation]);

  // Auto-resize textarea with smooth animation
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  }, [prompt]);

  // Typing indicator
  useEffect(() => {
    if (prompt.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [prompt]);

  const handleSubmit = async () => {
    console.log("handleSubmit called with:", {
      prompt: prompt.substring(0, 50) + "...",
      provider: modelConfig.provider,
      apiKey: currentApiKey ? `${currentApiKey.substring(0, 10)}...` : "undefined",
      isSubmitting
    });
    
    if (!prompt.trim() || isSubmitting) {
      console.log("Submit blocked:", { promptEmpty: !prompt.trim(), isSubmitting });
      return;
    }
    
    if (!currentApiKey) {
      console.error("API key is missing");
      alert(`Please enter your ${modelConfig.provider === "openai" ? "OpenAI" : "Google"} API key in the settings panel.`);
      return;
    }

    if (!currentApiKey.trim()) {
      console.error("API key is empty string");
      alert(`Please enter your ${modelConfig.provider === "openai" ? "OpenAI" : "Google"} API key in the settings panel.`);
      return;
    }

    console.log("Starting message submission");
    setIsSubmitting(true);
    try {
      await sendMessage(prompt.trim(), currentApiKey);
      setPrompt("");
      console.log("Message sent successfully");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt);
    setShowQuickPrompts(false);
    textareaRef.current?.focus();
  };

  const handleRun = () => {
    if (!currentApiKey) {
      alert(`Please enter your ${modelConfig.provider === "openai" ? "OpenAI" : "Google"} API key in the settings panel.`);
      return;
    }
    setIsRunning(true);
    handleSubmit();
  };

  const testAPIKey = async () => {
    if (!currentApiKey) {
      alert(`Please enter your ${modelConfig.provider === "openai" ? "OpenAI" : "Google"} API key first.`);
      return;
    }

    try {
      const openaiService = new OpenAIService(currentApiKey);
      const isValid = await openaiService.testAPIKey();
      
      if (isValid) {
        alert("✅ API key is valid! You can now start chatting.");
      } else {
        alert("❌ API key is invalid. Please check your key and try again.");
      }
    } catch (error) {
      console.error("API key test failed:", error);
      alert("❌ API key test failed. Please check your key and try again.");
    }
  };

  const handleClearClick = () => {
    setShowClearDialog(true);
  };

  const handleClearConfirm = () => {
    clearChat();
    setIsRunning(false);
    setPrompt("");
    setShowClearDialog(false);
  };

  const handleClearCancel = () => {
    setShowClearDialog(false);
  };

  const getProviderIcon = () => {
    return modelConfig.provider === "openai" ? <Sparkles className="w-4 h-4" /> : <Bot className="w-4 h-4" />;
  };

  const getProviderName = () => {
    return modelConfig.provider === "openai" ? "OpenAI" : "Google";
  };

  return (
    <BaseLayout 
      title="Chat Conversation" 
      subtitle={`Powered by ${getProviderName()} • ${modelConfig.name}`}
    >
      {!isRunning && chatState.messages.length === 0 ? (
        <EmptyState
          icon={<div className="p-4 bg-gradient-to-br from-brand-blue to-purple-600 rounded-full">
            <MessageSquare className="w-12 h-12 text-white" />
          </div>}
          title="AI Chat Ready"
          description="Start a conversation with your AI assistant using natural language prompts."
          features={[
            {
              icon: <Sparkles className="w-5 h-5" />,
              title: "Smart Responses",
              description: "Get intelligent answers to any question"
            },
            {
              icon: <Code className="w-5 h-5" />,
              title: "Code Generation",
              description: "Generate and debug code in any language"
            },
            {
              icon: <MessageSquare className="w-5 h-5" />,
              title: "Natural Conversation",
              description: "Chat naturally with context awareness"
            }
          ]}
          action={
            <div className="space-y-6 w-full max-w-4xl mx-auto">
              {/* Enhanced Chat Prompt Area */}
              {/* Enhanced Chat Prompt Area */}
              <div className="w-full max-w-3xl mx-auto p-6 bg-gradient-to-br from-accent/20 to-accent/10 border border-border rounded-xl shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <label className="text-lg font-medium text-foreground">
                      Chat Prompt
                    </label>
                    <Badge variant="secondary" className="text-xs">
                      {getProviderIcon()} {getProviderName()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {modelConfig.name}
                    </Badge>
                  </div>
                  
                  <Textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[120px] border-border resize-none transition-all duration-200 focus:ring-2 focus:ring-brand-blue/20 bg-background/50 backdrop-blur-sm"
                    placeholder="Ask me anything... I'm here to help! 🤖"
                    disabled={isSubmitting}
                  />
                  
                  {/* Quick Prompts */}
                  {!prompt && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-foreground">Try these quick prompts:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {quickPrompts.slice(0, 6).map((quickPrompt, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickPrompt(quickPrompt)}
                            className="text-xs h-8 px-3 hover:bg-brand-blue/10 hover:border-brand-blue/30 transition-colors text-left justify-start"
                          >
                            {quickPrompt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                            <HelpCircle className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Get help with prompts</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                            <Code className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Code generation</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Chat settings</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <Button 
                    onClick={handleRun}
                    className="bg-gradient-to-r from-brand-blue to-purple-600 hover:from-brand-blue/90 hover:to-purple-600/90 text-white gap-2 px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting || !prompt.trim() || !currentApiKey}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Enhanced API Key Warning */}
              {!currentApiKey && (
                <Alert className="w-full max-w-3xl mx-auto border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
                  <AlertDescription className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Please enter your {getProviderName()} API key in the settings panel to start chatting.
                  </AlertDescription>
                </Alert>
              )}

              {/* Enhanced Test API Key Button */}
              {currentApiKey && (
                <div className="w-full max-w-3xl mx-auto">
                  <Button 
                    variant="outline" 
                    onClick={testAPIKey}
                    className="w-full border-brand-blue/30 text-brand-blue hover:bg-brand-blue/10 transition-colors"
                  >
                    <TestTube className="w-4 h-4 mr-2" />
                    Test {getProviderName()} API Key
                  </Button>
                </div>
              )}

              {/* Enhanced What's New Section */}
              <div className="w-full max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-brand-blue" />
                  <h2 className="text-xl font-semibold text-foreground">What's new</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {newFeatures.map((feature, index) => (
                    <FeatureCard
                      key={index}
                      title={feature.title}
                      description={feature.description}
                      icon={<span className="text-2xl">{feature.icon}</span>}
                    />
                  ))}
                </div>
              </div>
            </div>
          }
        />
      ) : (
        // Enhanced Chat conversation view
        <div className="flex-1 flex flex-col h-full">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-background/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-brand-blue to-purple-600 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Chat Conversation</h1>
                  <p className="text-xs text-muted-foreground">
                    {getProviderIcon()} {getProviderName()} • {modelConfig.name}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy conversation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                      <Share className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share conversation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                      <Refresh className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Regenerate response</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                      onClick={handleClearClick}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear chat</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Enhanced Chat messages with improved layout */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-6">
            <div className="space-y-8 max-w-5xl mx-auto">
              {chatState.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {chatState.isLoading && (
                <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-accent/30 to-accent/20 rounded-2xl border border-border/50 shadow-sm animate-fade-in">
                  <div className="relative">
                    <div className="w-8 h-8 border-3 border-gradient-primary border-t-transparent rounded-full animate-spin" />
                    <div className="absolute inset-0 w-8 h-8 border-3 border-gradient-primary/20 rounded-full" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-foreground font-semibold text-lg">AI is thinking</span>
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-gradient-to-br from-brand-blue to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gradient-to-br from-brand-blue to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-2 h-2 bg-gradient-to-br from-brand-blue to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Enhanced Error Display */}
          {chatState.error && (
            <Alert className="mx-4 mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-600 flex items-center gap-2">
                <X className="w-4 h-4" />
                {chatState.error}
              </AlertDescription>
            </Alert>
          )}

          {/* Enhanced Bottom input with modern design */}
          <div className="p-6 border-t border-border bg-gradient-to-t from-background/95 to-background/80 backdrop-blur-md">
            <div className="max-w-5xl mx-auto">
              <div className="relative">
                <div className="flex items-end gap-4 p-5 border border-border/50 rounded-2xl bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex-1">
                    <Textarea
                      ref={textareaRef}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything... I'm here to help! ✨ (Enter to send, Shift+Enter for new line)"
                      className="flex-1 border-0 bg-transparent resize-none min-h-[52px] max-h-[200px] focus-visible:ring-0 text-base leading-relaxed focus-ring placeholder:text-muted-foreground/70"
                      rows={1}
                      disabled={isSubmitting}
                    />
                    {isTyping && (
                      <div className="flex items-center gap-3 mt-3 p-2 bg-accent/20 rounded-lg animate-fade-in">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-brand-blue" />
                          <span className="text-sm text-foreground font-medium">You're typing...</span>
                        </div>
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-brand-blue via-brand-blue to-purple-600 hover:from-brand-blue/90 hover:via-brand-blue/90 hover:to-purple-600/90 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover-lift disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !prompt.trim() || !currentApiKey}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Enhanced disclaimer */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1" />
                  <p className="text-xs text-muted-foreground/80 px-4 bg-background/50 rounded-full border border-border/30">
                    ⚡ Powered by {getProviderName()} • AI responses may contain errors
                  </p>
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Clear Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <X className="w-5 h-5 text-red-500" />
              Clear Chat History?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently delete all messages in this conversation. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel 
              onClick={handleClearCancel}
              className="bg-background border border-border text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearConfirm}
              className="bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Clear Chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </BaseLayout>
  );
};