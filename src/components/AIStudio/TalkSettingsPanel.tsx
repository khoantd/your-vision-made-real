import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { X, ChevronDown, Wrench, Volume2, Mic } from "lucide-react";
import { useState } from "react";

export const TalkSettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [autoRecord, setAutoRecord] = useState(true);
  const [voiceActivityDetection, setVoiceActivityDetection] = useState(true);
  const [temperature, setTemperature] = useState([0.8]);
  const [volume, setVolume] = useState([70]);
  const [micSensitivity, setMicSensitivity] = useState([50]);

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
        <h2 className="font-medium text-foreground">Voice settings</h2>
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
        {/* Model Selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Model
          </label>
          <Select defaultValue="gpt-4o-realtime">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o-realtime">GPT-4o Realtime Preview</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Voice Selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Voice
          </label>
          <Select defaultValue="alloy">
            <SelectTrigger className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-4 h-4 bg-brand-blue rounded-full flex items-center justify-center">
                  <Volume2 className="w-2 h-2 text-white" />
                </div>
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alloy">Alloy</SelectItem>
              <SelectItem value="echo">Echo</SelectItem>
              <SelectItem value="fable">Fable</SelectItem>
              <SelectItem value="onyx">Onyx</SelectItem>
              <SelectItem value="nova">Nova</SelectItem>
              <SelectItem value="shimmer">Shimmer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Temperature */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Temperature: {temperature[0]}
          </label>
          <Slider
            value={temperature}
            onValueChange={setTemperature}
            max={1}
            min={0}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Focused</span>
            <span>Creative</span>
          </div>
        </div>

        <Separator />

        {/* Audio Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Audio Settings</h3>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Audio playback</span>
            <Switch checked={audioEnabled} onCheckedChange={setAudioEnabled} />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Auto recording</span>
            <Switch checked={autoRecord} onCheckedChange={setAutoRecord} />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Voice activity detection</span>
            <Switch checked={voiceActivityDetection} onCheckedChange={setVoiceActivityDetection} />
          </div>
        </div>

        {/* Volume Control */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Volume: {volume[0]}%
          </label>
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        {/* Microphone Sensitivity */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Microphone sensitivity: {micSensitivity[0]}%
          </label>
          <Slider
            value={micSensitivity}
            onValueChange={setMicSensitivity}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Session Context */}
        <div>
          <Button variant="ghost" className="w-full justify-between text-sm text-foreground">
            Session Context
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        {/* Advanced Settings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">Advanced</h3>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground">
              <p>Audio format: PCM 16-bit, 24kHz</p>
              <p>Turn detection: Server VAD</p>
              <p>Max response tokens: Unlimited</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};