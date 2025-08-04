import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, Wrench, Settings, Radio, Sparkles, Zap, Volume2, Mic, Camera, ScreenShare, ArrowRight, Clock, Users } from "lucide-react";
import { useState } from "react";
import { LLM_PROVIDERS } from "@/constants/models";
import { useAIStudio } from "@/contexts/AIStudioContext";
import { APIKeyInput } from "./APIKeyInput";
import { DynamicModelSelector } from "./DynamicModelSelector";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const StreamSettingsPanel = () => {
  const { 
    modelConfig, 
    updateModelConfig,
    streamConfig,
    updateStreamConfig
  } = useAIStudio();
  
  const [isOpen, setIsOpen] = useState(true);
  const [apiConfigOpen, setApiConfigOpen] = useState(true);
  const [streamConfigOpen, setStreamConfigOpen] = useState(true);
  const [advancedConfigOpen, setAdvancedConfigOpen] = useState(false);
  const [turnCoverage, setTurnCoverage] = useState(false);
  const [affectiveDialog, setAffectiveDialog] = useState(false);
  const [proactiveAudio, setProactiveAudio] = useState(false);
  const [functionCalling, setFunctionCalling] = useState(false);
  const [automaticFunctionResponse, setAutomaticFunctionResponse] = useState(false);
  const [googleSearch, setGoogleSearch] = useState(false);

  const getProviderIcon = () => {
    return modelConfig.provider === "openai" ? <Sparkles className="w-4 h-4" /> : <Radio className="w-4 h-4" />;
  };

  const getProviderName = () => {
    return modelConfig.provider === "openai" ? "OpenAI" : "Google";
  };

  if (!isOpen) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-20 right-4 z-50 bg-background/90 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
              onClick={() => setIsOpen(true)}
            >
              <Wrench className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Open Stream Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Settings Panel */}
      <div className="fixed top-0 right-0 w-80 bg-background border-l border-border h-screen flex flex-col z-50 shadow-2xl lg:relative lg:shadow-none lg:z-auto">
        {/* Enhanced Header */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-accent/5 to-accent/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-brand-blue to-purple-600 rounded-lg">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Stream Settings</h2>
              <p className="text-xs text-muted-foreground">Configure real-time streaming</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Enhanced Settings Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* API Configuration */}
          <Collapsible open={apiConfigOpen} onOpenChange={setApiConfigOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full mb-3 cursor-pointer hover:bg-accent/50 rounded-md p-2 -m-2 transition-colors">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md">
                  <Zap className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-sm font-medium text-foreground">API Configuration</h3>
              </div>
              <ChevronDown 
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-200",
                  apiConfigOpen ? 'rotate-0' : '-rotate-90'
                )} 
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-4 pl-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      OpenAI API Key
                    </label>
                    <APIKeyInput provider="openai" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Google API Key
                    </label>
                    <APIKeyInput provider="google" />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Provider Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-green-500 to-green-600 rounded-md">
                <Radio className="w-3 h-3 text-white" />
              </div>
              <label className="text-sm font-medium text-foreground">
                LLM Provider
              </label>
            </div>
            <Select 
              value={modelConfig.provider} 
              onValueChange={(value: "google" | "openai") => {
                updateModelConfig({ provider: value });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LLM_PROVIDERS.map((provider) => (
                  <SelectItem key={provider.value} value={provider.value}>
                    <div className="flex items-center gap-2">
                      {provider.value === "openai" ? <Sparkles className="w-4 h-4" /> : <Radio className="w-4 h-4" />}
                      {provider.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                {getProviderIcon()} {getProviderName()}
              </Badge>
              <span>•</span>
              <span>Model: {modelConfig.name}</span>
            </div>
          </div>

          <Separator />

          {/* Stream Configuration */}
          <Collapsible open={streamConfigOpen} onOpenChange={setStreamConfigOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full mb-3 cursor-pointer hover:bg-accent/50 rounded-md p-2 -m-2 transition-colors">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-md">
                  <Volume2 className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-sm font-medium text-foreground">Stream Configuration</h3>
              </div>
              <ChevronDown 
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-200",
                  streamConfigOpen ? 'rotate-0' : '-rotate-90'
                )} 
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-4 pl-6">
                {/* Audio Settings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Audio Input</span>
                    </div>
                    <Switch
                      checked={streamConfig.audioEnabled}
                      onCheckedChange={(checked) => updateStreamConfig({ audioEnabled: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Video Input</span>
                    </div>
                    <Switch
                      checked={streamConfig.videoEnabled}
                      onCheckedChange={(checked) => updateStreamConfig({ videoEnabled: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ScreenShare className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Screen Share</span>
                    </div>
                    <Switch
                      checked={false}
                      onCheckedChange={() => {}}
                      disabled
                    />
                  </div>
                </div>

                {/* Quality Settings */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Stream Quality
                  </label>
                  <Select 
                    value={streamConfig.quality} 
                    onValueChange={(value: "low" | "medium" | "high") => {
                      updateStreamConfig({ quality: value });
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (720p)</SelectItem>
                      <SelectItem value="medium">Medium (1080p)</SelectItem>
                      <SelectItem value="high">High (4K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Frame Rate */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Frame Rate
                  </label>
                  <Select 
                    value={streamConfig.frameRate.toString()} 
                    onValueChange={(value) => {
                      updateStreamConfig({ frameRate: parseInt(value) });
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24 FPS</SelectItem>
                      <SelectItem value="30">30 FPS</SelectItem>
                      <SelectItem value="60">60 FPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Advanced Configuration */}
          <Collapsible open={advancedConfigOpen} onOpenChange={setAdvancedConfigOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full mb-3 cursor-pointer hover:bg-accent/50 rounded-md p-2 -m-2 transition-colors">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-md">
                  <Wrench className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-sm font-medium text-foreground">Advanced Settings</h3>
              </div>
              <ChevronDown 
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-200",
                  advancedConfigOpen ? 'rotate-0' : '-rotate-90'
                )} 
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-4 pl-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">Turn Coverage</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs text-muted-foreground">ⓘ</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enable turn-based conversation flow</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Switch
                      checked={turnCoverage}
                      onCheckedChange={setTurnCoverage}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">Affective Dialog</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs text-muted-foreground">ⓘ</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enable emotional response detection</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Switch
                      checked={affectiveDialog}
                      onCheckedChange={setAffectiveDialog}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">Proactive Audio</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs text-muted-foreground">ⓘ</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enable proactive audio responses</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Switch
                      checked={proactiveAudio}
                      onCheckedChange={setProactiveAudio}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">Function Calling</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs text-muted-foreground">ⓘ</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enable function calling capabilities</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Switch
                      checked={functionCalling}
                      onCheckedChange={setFunctionCalling}
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Status Information */}
          <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">Stream Status</h4>
              <Badge variant="outline" className="text-xs">
                Ready
              </Badge>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>Last updated: Just now</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3" />
                <span>Provider: {getProviderName()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};