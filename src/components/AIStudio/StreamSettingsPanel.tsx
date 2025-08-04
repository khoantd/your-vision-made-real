import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, ChevronDown, Wrench } from "lucide-react";
import { useState } from "react";

export const StreamSettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [turnCoverage, setTurnCoverage] = useState(false);
  const [affectiveDialog, setAffectiveDialog] = useState(false);
  const [proactiveAudio, setProactiveAudio] = useState(false);
  const [functionCalling, setFunctionCalling] = useState(false);
  const [automaticFunctionResponse, setAutomaticFunctionResponse] = useState(false);
  const [googleSearch, setGoogleSearch] = useState(false);

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-20 right-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <Wrench className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <div className="w-80 bg-settings-bg border-l border-border h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-medium text-foreground">Run settings</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* LLM Provider Section */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            LLM Provider
          </label>
          <Select defaultValue="google">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="google">Google AI</SelectItem>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="anthropic">Anthropic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* API Configuration Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">API Configuration</h3>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-foreground mb-1 block">API Key</label>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  className="flex-1 px-3 py-2 text-sm bg-background border border-input rounded-md"
                  placeholder="Enter your API key"
                />
                <Button variant="outline" size="sm">Test</Button>
              </div>
            </div>
            <div>
              <label className="text-sm text-foreground mb-1 block">Base URL (optional)</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md"
                placeholder="https://api.openai.com/v1"
              />
            </div>
          </div>
        </div>

        {/* Model Selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Model
          </label>
          <Select defaultValue="gemini-2.5-flash-preview">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-2.5-flash-preview">Gemini 2.5 Flash Preview Native Audio Dialog</SelectItem>
              <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
              <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Voice */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Voice
          </label>
          <Select defaultValue="zephyr">
            <SelectTrigger className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-4 h-4 bg-brand-blue rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zephyr">Zephyr</SelectItem>
              <SelectItem value="astra">Astra</SelectItem>
              <SelectItem value="nova">Nova</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Media Resolution */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Media resolution
          </label>
          <Select defaultValue="258-tokens">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="258-tokens">258 tokens / image</SelectItem>
              <SelectItem value="512-tokens">512 tokens / image</SelectItem>
              <SelectItem value="1024-tokens">1024 tokens / image</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Audio Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Turn coverage</span>
            <Switch checked={turnCoverage} onCheckedChange={setTurnCoverage} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Affective dialog</span>
            <Switch checked={affectiveDialog} onCheckedChange={setAffectiveDialog} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Proactive audio</span>
            <Switch checked={proactiveAudio} onCheckedChange={setProactiveAudio} />
          </div>
        </div>

        {/* Session Context */}
        <div>
          <Button variant="ghost" className="w-full justify-between text-sm text-foreground">
            Session Context
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        {/* Tools Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">Tools</h3>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-foreground">Function calling</span>
                <Button variant="ghost" size="sm" className="ml-2 text-xs text-muted-foreground">
                  Edit
                </Button>
              </div>
              <Switch checked={functionCalling} onCheckedChange={setFunctionCalling} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Automatic Function Response</span>
              <Switch checked={automaticFunctionResponse} onCheckedChange={setAutomaticFunctionResponse} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Grounding with Google Search</span>
              <Switch checked={googleSearch} onCheckedChange={setGoogleSearch} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};