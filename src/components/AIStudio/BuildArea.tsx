import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Code, Image, Gamepad2, Mic, Music, Search, Map, MessageSquare, FileText, Video, Cpu, Sparkles, ArrowRight, Play, Star, Clock, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";

const templates = [
  {
    icon: <Gamepad2 className="w-5 h-5" />,
    title: "Dynamic text game using Gemini",
    description: "Create interactive text-based games with AI",
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    difficulty: "Beginner",
    time: "5-10 min"
  },
  {
    icon: <Code className="w-5 h-5" />,
    title: "Gemini powered code review",
    description: "AI-assisted code analysis and suggestions",
    color: "bg-gradient-to-br from-green-500 to-green-600",
    difficulty: "Intermediate",
    time: "10-15 min"
  },
  {
    icon: <Image className="w-5 h-5" />,
    title: "Imagen pixel art maker",
    description: "Generate pixel art with AI assistance",
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    difficulty: "Beginner",
    time: "5-8 min"
  }
];

const showcaseApps = [
  {
    id: 1,
    title: "Veo 3 Gallery",
    description: "Explore a dynamic gallery, dive into examples and remix video prompts to generate your own unique variations",
    icon: <Video className="w-8 h-8" />,
    tags: ["Veo 3.0", "Audio-Video Generation"],
    color: "bg-gradient-to-br from-orange-400 to-orange-500",
    difficulty: "Advanced",
    time: "15-20 min",
    rating: 4.8,
    users: 1247
  },
  {
    id: 2,
    title: "Gemini OS",
    description: "Simulate a computer with a UI that is generated dynamically from user interactions.",
    icon: <Cpu className="w-8 h-8" />,
    tags: ["Gemini 2.5 Flash-Lite", "Generative UI"],
    color: "bg-gradient-to-br from-blue-400 to-blue-500",
    difficulty: "Advanced",
    time: "20-25 min",
    rating: 4.9,
    users: 2156
  },
  {
    id: 3,
    title: "Mumble Jumble",
    description: "A playground to discover the range of creative voices that the Gemini native audio out has to offer.",
    icon: <Mic className="w-8 h-8" />,
    tags: ["Gemini 2.5 Flash Audio", "Imagen"],
    color: "bg-gradient-to-br from-green-400 to-green-500",
    difficulty: "Intermediate",
    time: "10-15 min",
    rating: 4.7,
    users: 892
  },
  {
    id: 4,
    title: "Live Audio",
    description: "Experience real-time voice chat with 3D visuals react to your conversation, bringing AI interaction to life.",
    icon: <MessageSquare className="w-8 h-8" />,
    tags: ["Gemini 2.5 Flash Audio", "Live API"],
    color: "bg-gradient-to-br from-purple-400 to-purple-500",
    difficulty: "Advanced",
    time: "25-30 min",
    rating: 4.6,
    users: 1567
  },
  {
    id: 5,
    title: "PromptDJ",
    description: "Steer a continuous stream of music with text prompts",
    icon: <Music className="w-8 h-8" />,
    tags: ["Lyria", "Music generation"],
    color: "bg-gradient-to-br from-pink-400 to-pink-500",
    difficulty: "Intermediate",
    time: "12-18 min",
    rating: 4.5,
    users: 743
  },
  {
    id: 6,
    title: "PromptDJ MIDI",
    description: "Control real time music with a MIDI controller.",
    icon: <Music className="w-8 h-8" />,
    tags: ["Lyria", "Music generation"],
    color: "bg-gradient-to-br from-indigo-400 to-indigo-500",
    difficulty: "Advanced",
    time: "20-25 min",
    rating: 4.4,
    users: 634
  },
  {
    id: 7,
    title: "Thinking Space",
    description: "Search a custom set of images using natural language.",
    icon: <Search className="w-8 h-8" />,
    tags: ["Gemini 2.5 Flash"],
    color: "bg-gradient-to-br from-yellow-400 to-yellow-500",
    difficulty: "Beginner",
    time: "8-12 min",
    rating: 4.3,
    users: 1123
  },
  {
    id: 8,
    title: "MCP Maps 3D",
    description: "Build Photoreai 3D maps with natural language using a Gemini-powered Agent and MCP tool.",
    icon: <Map className="w-8 h-8" />,
    tags: ["Gemini 2.5 Flash", "Google Maps API"],
    color: "bg-gradient-to-br from-teal-400 to-teal-500",
    difficulty: "Advanced",
    time: "30-35 min",
    rating: 4.8,
    users: 987
  }
];

export const BuildArea = () => {
  const [hoveredApp, setHoveredApp] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("templates");

  return (
    <div className="flex-1 bg-chat-bg flex flex-col">
      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-brand-blue to-purple-600 rounded-full">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-brand-blue to-purple-600 bg-clip-text text-transparent">
              Build with AI
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create powerful applications using Gemini's advanced capabilities. 
            From simple templates to complex showcase apps, build the future with AI.
          </p>
        </div>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="showcase" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Showcase
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            {/* Templates Section */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Quick Start Templates</h2>
              <p className="text-muted-foreground">Choose a template to get started building with AI</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((template, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-brand-blue/20">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={cn("p-3 rounded-lg", template.color)}>
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{template.title}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {template.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {template.time}
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-brand-blue to-purple-600 hover:from-brand-blue/90 hover:to-purple-600/90 text-white transition-all duration-200 group-hover:shadow-md">
                      <Play className="w-4 h-4 mr-2" />
                      Start Building
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="showcase" className="space-y-6">
            {/* Showcase Section */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Featured Applications</h2>
              <p className="text-muted-foreground">Explore advanced AI applications built with Gemini</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcaseApps.map((app) => (
                <Card 
                  key={app.id} 
                  className={cn(
                    "group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-brand-blue/20 relative overflow-hidden",
                    hoveredApp === app.id && "scale-105"
                  )}
                  onMouseEnter={() => setHoveredApp(app.id)}
                  onMouseLeave={() => setHoveredApp(null)}
                >
                  {/* App Icon */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={cn("p-3 rounded-lg", app.color)}>
                        {app.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{app.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{app.rating}</span>
                          <Users className="w-3 h-3" />
                          <span>{app.users.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {app.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {app.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Difficulty and Time */}
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="text-xs">
                        {app.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {app.time}
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-brand-blue to-purple-600 hover:from-brand-blue/90 hover:to-purple-600/90 text-white transition-all duration-200">
                      <Play className="w-4 h-4 mr-2" />
                      Launch App
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Footer */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-accent/20 to-accent/10 rounded-xl p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Build?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start creating your own AI-powered applications with Gemini's advanced capabilities.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button className="bg-gradient-to-r from-brand-blue to-purple-600 hover:from-brand-blue/90 hover:to-purple-600/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create New Project
              </Button>
              <Button variant="outline">
                <Sparkles className="w-4 h-4 mr-2" />
                Explore Examples
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};