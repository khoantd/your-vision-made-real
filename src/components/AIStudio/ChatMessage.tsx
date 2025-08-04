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
        "group relative rounded-xl border p-4 transition-all duration-200 hover:shadow-sm",
        getMessageBg(),
        isHovered && "shadow-md"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shadow-sm",
            getRoleColor()
          )}>
            {getRoleIcon()}
          </div>
        </div>
        
        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {getRoleName()}
              </span>
              <Badge variant="secondary" className="text-xs">
                {message.role}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            
            {/* Action Buttons */}
            <div className={cn(
              "flex items-center gap-1 opacity-0 transition-opacity duration-200",
              isHovered && "opacity-100"
            )}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={handleCopy}
                    >
                      {isCopied ? (
                        <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isCopied ? "Copied!" : "Copy message"}</p>
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
                          className="h-7 w-7 text-muted-foreground hover:text-green-600 hover:bg-green-50"
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Helpful response</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Not helpful</p>
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
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>More options</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Message Body */}
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {message.isLoading ? (
              <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">AI is thinking</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1 h-1 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1 h-1 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom code block styling
                  code: ({ children, ...props }: any) => {
                    const { className } = props;
                    const isInline = !className || !className.includes('language-');
                    
                    if (isInline) {
                      return (
                        <code 
                          className="bg-accent/50 text-accent-foreground px-1.5 py-0.5 rounded text-xs font-mono"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }
                    return (
                      <pre className="bg-accent/30 border border-border rounded-lg p-4 overflow-x-auto my-4">
                        <code className="text-sm font-mono" {...props}>
                          {children}
                        </code>
                      </pre>
                    );
                  },
                  // Custom blockquote styling
                  blockquote: ({ children }: any) => (
                    <blockquote className="border-l-4 border-brand-blue pl-4 py-2 bg-accent/20 rounded-r-lg italic my-4">
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
                  // Custom paragraph styling
                  p: ({ children }: any) => (
                    <p className="text-sm leading-relaxed mb-3 last:mb-0">{children}</p>
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

      {/* Message Status */}
      {isAssistant && !message.isLoading && (
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Badge variant="outline" className="text-xs">
            AI Generated
          </Badge>
        </div>
      )}
    </div>
  );
}; 