import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { BaseLayout } from "@/components/common/BaseLayout";
import { EmptyState } from "@/components/common/EmptyState";
import { Mic, Video, Monitor, Play, HelpCircle, Code, Share, RotateCcw, MoreHorizontal, Radio } from "lucide-react";
import { useState } from "react";

export const StreamArea = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <BaseLayout 
      title="Stream Realtime" 
      subtitle="Talk to Gemini live with real-time audio and video"
    >

      <EmptyState
        icon={<Radio className="w-12 h-12 text-muted-foreground" />}
        title="Talk to Gemini live"
        description="Start a real-time conversation with advanced audio and video capabilities."
        features={[
          {
            icon: <Mic className="w-5 h-5" />,
            title: "Voice Chat",
            description: "Natural audio conversations"
          },
          {
            icon: <Video className="w-5 h-5" />,
            title: "Video Input",
            description: "Webcam integration"
          },
          {
            icon: <Monitor className="w-5 h-5" />,
            title: "Screen Share",
            description: "Share your screen content"
          }
        ]}
        action={
          <div className="space-y-4 w-full max-w-2xl">
            {/* Prompt Input */}
            <Card className="p-6 bg-prompt-bg border border-border">
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
            <div className="flex items-center justify-center gap-4">
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
        }
      />
    </BaseLayout>
  );
};