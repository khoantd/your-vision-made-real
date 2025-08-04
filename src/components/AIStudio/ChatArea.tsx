import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, HelpCircle, Code, Share, RotateCcw, MoreHorizontal, ChevronUp, ChevronDown, ThumbsUp, ThumbsDown, Edit, X } from "lucide-react";
import { useState } from "react";
import { FeatureCard } from "@/components/common/FeatureCard";

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

export const ChatArea = () => {
  const [prompt, setPrompt] = useState("Hello");
  const [isRunning, setIsRunning] = useState(false);
  const [showThinking, setShowThinking] = useState(true);
  const [thinkingExpanded, setThinkingExpanded] = useState(true);

  const handleRun = () => {
    setIsRunning(true);
  };

  const handleClear = () => {
    setIsRunning(false);
    setPrompt("Hello");
  };

  return (
    <div className="flex-1 bg-chat-bg flex flex-col">
      {!isRunning ? (
        // Initial state - prompt input and what's new
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto w-full">
          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-normal text-center mb-6 sm:mb-8 text-foreground">
            Google AI Studio
          </h1>

          {/* Chat Prompt Area */}
          <div className="w-full max-w-2xl mb-6 sm:mb-8 p-4 sm:p-6 bg-prompt-bg border border-border rounded-lg">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Chat Prompt
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px] border-border resize-none"
                  placeholder="Enter your prompt here..."
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="text-muted-foreground">
                  <HelpCircle className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-muted-foreground">
                  <Code className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-muted-foreground">
                  <Share className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-muted-foreground">
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-muted-foreground">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                onClick={handleRun}
                className="bg-brand-blue hover:bg-brand-blue/90 text-white gap-2"
              >
                <Play className="w-4 h-4" />
                Run
              </Button>
            </div>
          </div>

          {/* What's New Section */}
          <div className="w-full max-w-4xl">
            <h2 className="text-lg font-medium mb-4 text-foreground">What's new</h2>
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
        // Chat conversation view
        <div className="flex-1 p-4 max-w-5xl mx-auto w-full">
          {/* Header with title and tools */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-medium text-foreground">Greeting and Assistance</h1>
              <Button size="icon" variant="ghost" className="text-muted-foreground">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="text-muted-foreground">
                <Share className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="text-muted-foreground">
                <Code className="w-4 h-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-muted-foreground hover:text-foreground"
                onClick={handleClear}
                title="Clear chat"
              >
                <X className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="text-muted-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Chat messages */}
          <div className="space-y-6">
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-accent/20 rounded-lg p-3 max-w-md">
                <p className="text-foreground">{prompt}</p>
              </div>
            </div>

            {/* AI Response with thinking */}
            <div className="space-y-4">
              {/* Thinking Process */}
              {showThinking && (
                <div className="border border-border rounded-lg overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-3 bg-accent/10 cursor-pointer"
                    onClick={() => setThinkingExpanded(!thinkingExpanded)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-foreground">Thoughts</span>
                      <span className="text-xs text-muted-foreground">(experimental)</span>
                      <span className="text-xs bg-muted-foreground/20 text-muted-foreground px-2 py-1 rounded">Auto</span>
                    </div>
                    {thinkingExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  
                  {thinkingExpanded && (
                    <div className="p-4 space-y-4 bg-background/50">
                      {/* Thinking sections */}
                      <div className="space-y-3">
                        <div className="bg-muted/50 rounded-lg p-3">
                          <h4 className="font-medium text-sm text-foreground mb-2">Recognizing Greetings</h4>
                          <p className="text-sm text-muted-foreground">
                            I've identified the user's input as "Hello." My analysis quickly recognized this as a simple greeting, a common conversational opener. Next steps will involve determining the most natural and helpful response to this simple input.
                          </p>
                        </div>
                        
                        <div className="bg-muted/50 rounded-lg p-3">
                          <h4 className="font-medium text-sm text-foreground mb-2">Developing a Response</h4>
                          <p className="text-sm text-muted-foreground">
                            I've determined the ideal response to "Hello!" should be a combination of a greeting and an offer of assistance. I'm choosing "Hello there! How can I help you today?" as the best formulation. The greeting is friendly and the assistance offer is clear and welcoming.
                          </p>
                        </div>
                        
                        <div className="bg-muted/50 rounded-lg p-3">
                          <h4 className="font-medium text-sm text-foreground mb-2">Evaluating Potential Variations</h4>
                          <p className="text-sm text-muted-foreground">
                            I've considered several response variations, aiming for a balance of friendliness and helpfulness. "Hello there! How can I help you today?" and "Hi! How may I assist you?" are the strongest contenders. I've decided to stick with the first option, as it is a safe, solid and effective greeting. I'm now ready to implement the selected output.
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-border">
                        <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
                          Collapse to hide model thoughts
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AI Response */}
              <div className="bg-background border border-border rounded-lg p-4">
                <p className="text-foreground mb-4">Hello there! How can I help you today?</p>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom input */}
          <div className="mt-8 mb-4">
            <div className="flex items-center gap-2 p-2 border border-border rounded-lg bg-background">
              <Textarea
                placeholder="Start typing a prompt"
                className="flex-1 border-0 bg-transparent resize-none min-h-[40px] focus-visible:ring-0"
                rows={1}
              />
              <Button 
                size="sm" 
                className="bg-brand-blue hover:bg-brand-blue/90 text-white"
                disabled
              >
                <Play className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Google AI models may make mistakes, so double-check outputs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};