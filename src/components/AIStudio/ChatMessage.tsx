import { ChatMessage as ChatMessageType } from "@/types";
import { User, Bot, Loader2, Copy, ThumbsUp, ThumbsDown, MoreHorizontal, Sparkles, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const getRoleIcon = () => {
    if (isUser) return <User className="w-4 h-4 text-white" />;
    if (isAssistant) return <Sparkles className="w-4 h-4 text-white" />;
    return <MessageSquare className="w-4 h-4 text-white" />;
  };

  const getRoleName = () => {
    if (isUser) return "You";
    if (isAssistant) return "AI Assistant";
    return "System";
  };

  const getRoleColor = () => {
    if (isUser) return "bg-gradient-to-br from-blue-500 to-blue-600";
    if (isAssistant) return "bg-gradient-to-br from-brand-blue to-purple-600";
    return "bg-gradient-to-br from-yellow-500 to-orange-500";
  };

  const getMessageBg = () => {
    if (isUser) return "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50";
    if (isAssistant) return "bg-accent/30 dark:bg-accent/20 border-border/50";
    return "bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200/50";
  };

  return (
    <div
      className={cn(
        "group relative rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg animate-fade-in",
        getMessageBg(),
        isHovered && "shadow-xl border-border/70 scale-[1.02]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-5">
        {/* Enhanced Avatar */}
        <div className="flex-shrink-0">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover-lift",
            getRoleColor()
          )}>
            {getRoleIcon()}
          </div>
        </div>
        
        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-base font-bold text-foreground">
                {getRoleName()}
              </span>
              <Badge variant="secondary" className="text-xs px-2 py-1 rounded-lg">
                {message.role}
              </Badge>
              <span className="text-xs text-muted-foreground bg-accent/30 px-2 py-1 rounded-md">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            
            {/* Enhanced Action Buttons */}
            <div className={cn(
              "flex items-center gap-2 opacity-0 transition-all duration-300 transform translate-x-2",
              isHovered && "opacity-100 translate-x-0"
            )}>
              <div className="flex items-center bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-1 shadow-sm">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 hover-lift"
                        onClick={handleCopy}
                      >
                        {isCopied ? (
                          <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{isCopied ? "✅ Copied!" : "📋 Copy message"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {isAssistant && (
                  <>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg transition-all duration-200 hover-lift"
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>👍 Helpful response</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all duration-200 hover-lift"
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>👎 Not helpful</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 hover-lift"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>⚙️ More options</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          
          {/* Enhanced Message Body */}
          <div className="prose prose-base max-w-none dark:prose-invert">
            {message.isLoading ? (
              <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-accent/30 to-accent/20 rounded-2xl border border-border/50 animate-fade-in">
                <div className="relative">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
                  <div className="absolute inset-0 w-6 h-6 border-2 border-brand-blue/20 rounded-full" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-semibold text-foreground">AI is thinking</span>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-gradient-to-br from-brand-blue to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gradient-to-br from-brand-blue to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                    <div className="w-2 h-2 bg-gradient-to-br from-brand-blue to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Enhanced code block styling
                  code: ({ children, ...props }: any) => {
                    const { className } = props;
                    const isInline = !className || !className.includes('language-');
                    
                    if (isInline) {
                      return (
                        <code 
                          className="bg-accent/60 text-accent-foreground px-2 py-1 rounded-md text-sm font-mono border border-border/30"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }
                    return (
                      <pre className="bg-gradient-to-br from-accent/40 to-accent/20 border border-border/50 rounded-xl p-5 overflow-x-auto my-6 shadow-sm">
                        <code className="text-sm font-mono leading-relaxed" {...props}>
                          {children}
                        </code>
                      </pre>
                    );
                  },
                  // Enhanced blockquote styling
                  blockquote: ({ children }: any) => (
                    <blockquote className="border-l-4 border-gradient-to-b from-brand-blue to-purple-600 pl-6 py-3 bg-gradient-to-r from-accent/30 to-accent/20 rounded-r-xl italic my-6 shadow-sm">
                      {children}
                    </blockquote>
                  ),
                  // Custom heading styling
                  h1: ({ children }: any) => (
                    <h1 className="text-lg font-bold mb-3 text-foreground">{children}</h1>
                  ),
                  h2: ({ children }: any) => (
                    <h2 className="text-base font-semibold mb-2 text-foreground">{children}</h2>
                  ),
                  h3: ({ children }: any) => (
                    <h3 className="text-sm font-medium mb-2 text-foreground">{children}</h3>
                  ),
                  // Custom list styling
                  ul: ({ children }: any) => (
                    <ul className="list-disc list-inside space-y-1 mb-3">{children}</ul>
                  ),
                  ol: ({ children }: any) => (
                    <ol className="list-decimal list-inside space-y-1 mb-3">{children}</ol>
                  ),
                  li: ({ children }: any) => (
                    <li className="text-sm">{children}</li>
                  ),
                  // Enhanced paragraph styling
                  p: ({ children }: any) => (
                    <p className="text-base leading-relaxed mb-4 last:mb-0 text-foreground/90">{children}</p>
                  ),
                  // Custom table styling
                  table: ({ children }: any) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border border-border rounded-lg">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }: any) => (
                    <th className="border-b border-border bg-accent/30 px-4 py-2 text-left font-semibold text-sm">
                      {children}
                    </th>
                  ),
                  td: ({ children }: any) => (
                    <td className="border-b border-border px-4 py-2 text-sm">
                      {children}
                    </td>
                  ),
                  // Custom link styling
                  a: ({ href, children }: any) => (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-blue hover:underline"
                    >
                      {children}
                    </a>
                  ),
                  // Custom strong/bold styling
                  strong: ({ children }: any) => (
                    <strong className="font-semibold text-foreground">{children}</strong>
                  ),
                  // Custom emphasis/italic styling
                  em: ({ children }: any) => (
                    <em className="italic">{children}</em>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Message Status */}
      {isAssistant && !message.isLoading && (
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
          <Badge variant="outline" className="text-xs px-2 py-1 bg-background/80 backdrop-blur-sm border-border/50 rounded-lg">
            ✨ AI Generated
          </Badge>
        </div>
      )}
    </div>
  );
}; 