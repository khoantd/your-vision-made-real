import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BaseLayout } from "@/components/common/BaseLayout";
import { EmptyState } from "@/components/common/EmptyState";
import { Mic, Video, Monitor, Play, HelpCircle, Code, Share, RotateCcw, MoreHorizontal, Radio, Sparkles, Settings, Zap, Camera, Volume2, ScreenShare, ArrowRight, Clock, Users } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAIStudio } from "@/contexts/AIStudioContext";

export const StreamArea = () => {
  const { modelConfig } = useAIStudio();
  const [prompt, setPrompt] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const getProviderIcon = () => {
    return modelConfig.provider === "openai" ? <Sparkles className="w-4 h-4" /> : <Radio className="w-4 h-4" />;
  };

  const getProviderName = () => {
    return modelConfig.provider === "openai" ? "OpenAI" : "Google";
  };

  const handleStartStream = () => {
    setIsRecording(true);
    // Add stream logic here
  };

  const handleVideoToggle = () => {
    setIsVideoActive(!isVideoActive);
  };

  const handleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  return (
    <BaseLayout 
      title="Live Streaming" 
      subtitle="Real-time audio and video conversations with AI"
    >
      <EmptyState
        icon={<div className="p-4 bg-gradient-to-br from-brand-blue to-purple-600 rounded-full">
          <Radio className="w-12 h-12 text-white" />
        </div>}
        title="Live AI Conversations"
        description="Experience real-time audio and video interactions with advanced AI capabilities."
        features={[
          {
            icon: <Mic className="w-5 h-5" />,
            title: "Voice Chat",
            description: "Natural audio conversations with AI"
          },
          {
            icon: <Video className="w-5 h-5" />,
            title: "Video Input",
            description: "Webcam integration for visual context"
          },
          {
            icon: <Monitor className="w-5 h-5" />,
            title: "Screen Share",
            description: "Share your screen for better context"
          }
        ]}
        action={
          <div className="space-y-6 w-full max-w-4xl">
            {/* Enhanced Prompt Input */}
            <Card className="p-6 bg-gradient-to-br from-accent/20 to-accent/10 border border-border shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 relative">
                  <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want to discuss or ask..."
                    className="flex-1 border-border bg-background/50 backdrop-blur-sm pr-12"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {getProviderIcon()} {getProviderName()}
                    </Badge>
                  </div>
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                        <HelpCircle className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Get help with streaming</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button 
                  className="bg-gradient-to-r from-brand-blue to-purple-600 hover:from-brand-blue/90 hover:to-purple-600/90 text-white gap-2 shadow-lg"
                  onClick={handleStartStream}
                  disabled={!prompt.trim()}
                >
                  <Play className="w-4 h-4" />
                  Start Stream
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Enhanced Action Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent">
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
                        <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent">
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
                        <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reset stream</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Ready to stream</span>
                </div>
              </div>
            </Card>

            {/* Enhanced Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className={cn(
                  "p-6 cursor-pointer transition-all duration-200 border-2 hover:border-brand-blue/20 hover:shadow-lg",
                  isRecording && "border-brand-blue/40 bg-brand-blue/5"
                )}
                onClick={handleStartStream}
                onMouseEnter={() => setHoveredButton("voice")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-lg transition-all duration-200",
                    isRecording 
                      ? "bg-red-500 text-white" 
                      : "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                  )}>
                    <Mic className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Voice Chat</h3>
                    <p className="text-sm text-muted-foreground">Start audio conversation</p>
                    {isRecording && (
                      <Badge variant="destructive" className="mt-2">
                        Recording...
                      </Badge>
                    )}
                  </div>
                  <ArrowRight className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform duration-200",
                    hoveredButton === "voice" && "translate-x-1"
                  )} />
                </div>
              </Card>

              <Card 
                className={cn(
                  "p-6 cursor-pointer transition-all duration-200 border-2 hover:border-brand-blue/20 hover:shadow-lg",
                  isVideoActive && "border-brand-blue/40 bg-brand-blue/5"
                )}
                onClick={handleVideoToggle}
                onMouseEnter={() => setHoveredButton("video")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-lg transition-all duration-200",
                    isVideoActive 
                      ? "bg-green-500 text-white" 
                      : "bg-gradient-to-br from-green-500 to-green-600 text-white"
                  )}>
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Video Input</h3>
                    <p className="text-sm text-muted-foreground">Enable webcam feed</p>
                    {isVideoActive && (
                      <Badge variant="default" className="mt-2">
                        Active
                      </Badge>
                    )}
                  </div>
                  <ArrowRight className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform duration-200",
                    hoveredButton === "video" && "translate-x-1"
                  )} />
                </div>
              </Card>

              <Card 
                className={cn(
                  "p-6 cursor-pointer transition-all duration-200 border-2 hover:border-brand-blue/20 hover:shadow-lg",
                  isScreenSharing && "border-brand-blue/40 bg-brand-blue/5"
                )}
                onClick={handleScreenShare}
                onMouseEnter={() => setHoveredButton("screen")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-lg transition-all duration-200",
                    isScreenSharing 
                      ? "bg-purple-500 text-white" 
                      : "bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                  )}>
                    <ScreenShare className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Screen Share</h3>
                    <p className="text-sm text-muted-foreground">Share your screen</p>
                    {isScreenSharing && (
                      <Badge variant="default" className="mt-2">
                        Sharing
                      </Badge>
                    )}
                  </div>
                  <ArrowRight className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform duration-200",
                    hoveredButton === "screen" && "translate-x-1"
                  )} />
                </div>
              </Card>
            </div>

            {/* Status Information */}
            <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">Stream Ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Model: {modelConfig.name}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        }
      />
    </BaseLayout>
  );
};