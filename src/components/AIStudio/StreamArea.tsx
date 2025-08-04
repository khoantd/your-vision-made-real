import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mic, Video, Monitor, Play, HelpCircle, Code, Share, RotateCcw, MoreHorizontal } from "lucide-react";
import { useState } from "react";

export const StreamArea = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="flex-1 bg-chat-bg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-medium text-foreground">Stream Realtime</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">
        {/* Title */}
        <h1 className="text-4xl font-normal text-center mb-12 text-foreground">
          Talk to Gemini live
        </h1>

        {/* Prompt Input */}
        <Card className="w-full max-w-2xl mb-8 p-6 bg-prompt-bg border border-border">
          <div className="flex items-center gap-4 mb-4">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Start typing a prompt"
              className="flex-1 border-border"
            />
            <Button size="icon" variant="ghost" className="text-muted-foreground">
              <HelpCircle className="w-4 h-4" />
            </Button>
            <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white gap-2">
              <Play className="w-4 h-4" />
              Run
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
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
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="gap-2 bg-white border-border hover:bg-sidebar-hover"
          >
            <Mic className="w-4 h-4" />
            Talk
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 bg-white border-border hover:bg-sidebar-hover"
          >
            <Video className="w-4 h-4" />
            Webcam
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 bg-white border-border hover:bg-sidebar-hover"
          >
            <Monitor className="w-4 h-4" />
            Share Screen
          </Button>
        </div>
      </div>
    </div>
  );
};