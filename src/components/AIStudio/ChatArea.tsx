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
    <div className="flex-1 bg-chat-bg flex flex-col">
      {!isRunning && chatState.messages.length === 0 ? (
        // Initial state - prompt input and what's new
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto w-full">
          {/* Enhanced Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-brand-blue to-purple-600 rounded-full">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-brand-blue to-purple-600 bg-clip-text text-transparent">
                AI Studio Chat
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Powered by {getProviderName()} • {modelConfig.name}
            </p>
          </div>

          {/* Enhanced Chat Prompt Area */}
          <div className="w-full max-w-2xl mb-8 p-6 bg-gradient-to-br from-background to-accent/20 border border-border rounded-xl shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-sm font-medium text-foreground">
                    Chat Prompt
                  </label>
                  <Badge variant="secondary" className="text-xs">
                    {getProviderIcon()} {getProviderName()}
                  </Badge>
                </div>
                <Textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="min-h-[120px] border-border resize-none transition-all duration-200 focus:ring-2 focus:ring-brand-blue/20"
                  placeholder="Ask me anything... I'm here to help! 🤖"
                  disabled={isSubmitting}
                />
                
                {/* Quick Prompts */}
                {!prompt && (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-2">Try these quick prompts:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickPrompts.slice(0, 3).map((quickPrompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickPrompt(quickPrompt)}
                          className="text-xs h-7 px-3 hover:bg-brand-blue/10 hover:border-brand-blue/30 transition-colors"
                        >
                          {quickPrompt}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors">
                        <HelpCircle className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Get help with prompts</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors">
                        <Code className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Code generation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Chat settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Button 
                onClick={handleRun}
                className="bg-gradient-to-r from-brand-blue to-purple-600 hover:from-brand-blue/90 hover:to-purple-600/90 text-white gap-2 px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
            <Alert className="w-full max-w-2xl mb-6 border-orange-200 bg-orange-50">
              <AlertDescription className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Please enter your {getProviderName()} API key in the settings panel to start chatting.
              </AlertDescription>
            </Alert>
          )}

          {/* Enhanced Test API Key Button */}
          {currentApiKey && (
            <div className="w-full max-w-2xl mb-8">
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
          <div className="w-full max-w-4xl">
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

          {/* Enhanced Chat messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-6 max-w-4xl mx-auto">
              {chatState.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {chatState.isLoading && (
                <div className="flex items-center gap-3 p-4 bg-accent/20 rounded-lg border border-border">
                  <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-medium">Assistant is thinking</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1 h-1 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1 h-1 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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

          {/* Enhanced Bottom input */}
          <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-3 p-3 border border-border rounded-xl bg-background shadow-sm">
                <div className="flex-1">
                  <Textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message... (Press Enter to send)"
                    className="flex-1 border-0 bg-transparent resize-none min-h-[44px] max-h-[200px] focus-visible:ring-0 text-sm"
                    rows={1}
                    disabled={isSubmitting}
                  />
                  {isTyping && (
                    <div className="flex items-center gap-2 mt-1">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Typing...</span>
                    </div>
                  )}
                </div>
                
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-brand-blue to-purple-600 hover:from-brand-blue/90 hover:to-purple-600/90 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !prompt.trim() || !currentApiKey}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {getProviderName()} AI models may make mistakes, so double-check outputs.
              </p>
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
    </div>
  );
};