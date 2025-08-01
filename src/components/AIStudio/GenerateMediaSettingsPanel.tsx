import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { X, ChevronDown, Wrench } from "lucide-react";
import { useState } from "react";

export const GenerateMediaSettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [creativity, setCreativity] = useState([0.5]);
  const [quality, setQuality] = useState([0.8]);
  const [guidanceScale, setGuidanceScale] = useState([7.5]);
  const [safetyFilter, setSafetyFilter] = useState(true);
  const [watermark, setWatermark] = useState(true);

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
        <h2 className="font-medium text-foreground">Generation settings</h2>
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
          <Select defaultValue="imagen-3">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imagen-3">Imagen 3</SelectItem>
              <SelectItem value="veo-3">Veo 3</SelectItem>
              <SelectItem value="lyria">Lyria RealTime</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Output Format */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Output format
          </label>
          <Select defaultValue="1024x1024">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1024x1024">1024 × 1024</SelectItem>
              <SelectItem value="1024x768">1024 × 768</SelectItem>
              <SelectItem value="768x1024">768 × 1024</SelectItem>
              <SelectItem value="1536x1024">1536 × 1024</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Creativity */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Creativity
          </label>
          <div className="px-2">
            <Slider
              value={creativity}
              onValueChange={setCreativity}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Low</span>
              <span className="font-medium">{creativity[0]}</span>
              <span>High</span>
            </div>
          </div>
        </div>

        {/* Quality */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Quality
          </label>
          <div className="px-2">
            <Slider
              value={quality}
              onValueChange={setQuality}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Standard</span>
              <span className="font-medium">{quality[0]}</span>
              <span>Premium</span>
            </div>
          </div>
        </div>

        {/* Guidance Scale */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Guidance scale
          </label>
          <div className="px-2">
            <Slider
              value={guidanceScale}
              onValueChange={setGuidanceScale}
              max={20}
              min={1}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1</span>
              <span className="font-medium">{guidanceScale[0]}</span>
              <span>20</span>
            </div>
          </div>
        </div>

        {/* Number of Images */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Number of images
          </label>
          <Select defaultValue="4">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="8">8</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Safety & Quality */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Safety filter</span>
            <Switch checked={safetyFilter} onCheckedChange={setSafetyFilter} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Add watermark</span>
            <Switch checked={watermark} onCheckedChange={setWatermark} />
          </div>
        </div>

        {/* Advanced Options */}
        <div>
          <Button variant="ghost" className="w-full justify-between text-sm text-foreground">
            Advanced options
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        {/* Seed */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Seed (optional)
          </label>
          <input 
            type="text" 
            placeholder="Random seed"
            className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
          />
        </div>
      </div>
    </div>
  );
};