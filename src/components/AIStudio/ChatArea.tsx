import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, HelpCircle, Code, Share, RotateCcw, MoreHorizontal } from "lucide-react";
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
  const [prompt, setPrompt] = useState("Generate a high school revision guide on quantum computing →");

  return (
    <div className="flex-1 bg-chat-bg flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">
        {/* Title */}
        <h1 className="text-4xl font-normal text-center mb-8 text-foreground">
          Google AI Studio
        </h1>

        {/* Chat Prompt Area */}
        <div className="w-full max-w-2xl mb-8 p-6 bg-prompt-bg border border-border rounded-lg">
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
            
            <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white gap-2">
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
    </div>
  );
};