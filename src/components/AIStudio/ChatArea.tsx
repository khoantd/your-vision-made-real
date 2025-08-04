import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
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
        <div className="flex-1 flex flex-col justify-center items-center min-h-screen p-8">
          <div className="w-full max-w-6xl mx-auto space-y-12">
            {/* Perfectly Centered Hero Section */}
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-2xl shadow-2xl">
                  <MessageSquare className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-foreground tracking-tight">
                  AI Chat Ready
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Start a conversation with your AI assistant using natural language prompts
                </p>
              </div>
            </div>

            {/* Perfectly Justified Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center space-y-3 p-6 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Smart Responses</h3>
                <p className="text-muted-foreground">Get intelligent answers to any question</p>
              </div>
              <div className="text-center space-y-3 p-6 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Code className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Code Generation</h3>
                <p className="text-muted-foreground">Generate and debug code in any language</p>
              </div>
              <div className="text-center space-y-3 p-6 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Natural Conversation</h3>
                <p className="text-muted-foreground">Chat naturally with context awareness</p>
              </div>
            </div>

            {/* Perfectly Centered Chat Prompt Card */}
            <div className="flex justify-center">
              <Card className="w-full max-w-4xl p-8 bg-gradient-to-br from-background via-background to-muted/20 border-2 border-border/50 shadow-2xl">
                <div className="space-y-8">
                  {/* Card Header - Perfectly Justified */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">Chat Prompt</h2>
                        <p className="text-muted-foreground">Start your conversation</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="px-3 py-1 font-medium">
                        {getProviderIcon()} {getProviderName()}
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        {modelConfig.name}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Textarea - Full Width Justified */}
                  <div className="space-y-2">
                    <Textarea
                      ref={textareaRef}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="min-h-[160px] text-lg leading-relaxed border-border/50 resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 bg-background/80 backdrop-blur-sm rounded-xl shadow-sm"
                      placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line) ✨"
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      Press Enter to send • Shift+Enter for new line
                    </p>
                  </div>
                  
                  {/* Quick Prompts - Perfectly Aligned Grid */}
                  {!prompt && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-medium text-foreground">Quick Start Prompts</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {quickPrompts.slice(0, 6).map((quickPrompt, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => handleQuickPrompt(quickPrompt)}
                            className="h-auto p-4 text-sm hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 text-left justify-start hover-lift"
                          >
                            <span className="line-clamp-2 leading-relaxed">{quickPrompt}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Bar - Perfectly Justified */}
                  <div className="flex items-center justify-between pt-6 border-t border-border/30">
                    <div className="flex items-center gap-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 rounded-full">
                              <HelpCircle className="w-5 h-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Get help with prompts</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 rounded-full">
                              <Code className="w-5 h-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Code generation</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 rounded-full">
                              <Settings className="w-5 h-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Chat settings</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <Button 
                      onClick={handleRun}
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground gap-3 px-10 py-4 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting || !prompt.trim() || !currentApiKey}
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Perfectly Centered Alerts and Actions */}
            <div className="space-y-6">
              {/* API Key Warning - Centered */}
              {!currentApiKey && (
                <div className="flex justify-center">
                  <Alert className="max-w-2xl border-orange-300 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 dark:border-orange-700 shadow-lg">
                    <Settings className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <AlertDescription className="text-orange-800 dark:text-orange-200 font-medium text-center">
                      Please enter your {getProviderName()} API key in the settings panel to start chatting.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Test API Key Button - Centered */}
              {currentApiKey && (
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={testAPIKey}
                    className="h-12 px-8 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md"
                    size="lg"
                  >
                    <TestTube className="w-5 h-5 mr-3" />
                    Test {getProviderName()} API Key Connection
                  </Button>
                </div>
              )}
            </div>

            {/* Perfectly Arranged What's New Section */}
            <div className="space-y-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">What's New</h2>
                </div>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Discover the latest AI-powered features and capabilities to enhance your conversations
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {newFeatures.map((feature, index) => (
                  <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 hover-lift border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/10">
                    <div className="flex items-start gap-6">
                      <div className="text-4xl flex-shrink-0">{feature.icon}</div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Perfectly Arranged Chat Conversation View */
        <div className="flex-1 flex flex-col h-full max-w-7xl mx-auto w-full">
          {/* Perfectly Justified Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Chat Conversation</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  {getProviderIcon()} {getProviderName()} • {modelConfig.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 rounded-full">
                      <Copy className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Copy conversation</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 rounded-full">
                      <Share className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Share conversation</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 rounded-full">
                      <Refresh className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Regenerate response</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 rounded-full"
                      onClick={handleClearClick}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Clear chat</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Perfectly Centered Chat Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 px-6 py-8">
            <div className="max-w-4xl mx-auto space-y-8">
              {chatState.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {chatState.isLoading && (
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-4 p-6 bg-accent/20 rounded-2xl border border-border shadow-sm">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground font-medium text-lg">Assistant is thinking</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Perfectly Centered Error Display */}
          {chatState.error && (
            <div className="px-6 mb-4">
              <div className="max-w-4xl mx-auto">
                <Alert className="border-destructive/50 bg-destructive/10">
                  <X className="w-5 h-5 text-destructive" />
                  <AlertDescription className="text-destructive font-medium">
                    {chatState.error}
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}

          {/* Perfectly Justified Bottom Input */}
          <div className="p-6 border-t border-border bg-background/80 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-4 p-4 border-2 border-border/50 rounded-2xl bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex-1 space-y-2">
                  <Textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                    className="flex-1 border-0 bg-transparent resize-none min-h-[48px] max-h-[200px] focus-visible:ring-0 text-base focus-ring"
                    rows={1}
                    disabled={isSubmitting}
                  />
                  {isTyping && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Typing...</span>
                    </div>
                  )}
                </div>
                
                <Button 
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !prompt.trim() || !currentApiKey}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send
                    </>
                  )}
                </Button>
              </div>
              
              {/* Perfectly Centered Disclaimer */}
              <p className="text-sm text-muted-foreground mt-4 text-center leading-relaxed">
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
    </BaseLayout>
  );
};