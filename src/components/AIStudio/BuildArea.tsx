import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BaseLayout } from "@/components/common/BaseLayout";
import { EmptyState } from "@/components/common/EmptyState";
import { ContentCard } from "@/components/common/ContentCard";
import { Plus, Code, Image, Gamepad2, Mic, Music, Search, Map, MessageSquare, FileText, Video, Cpu, Sparkles, ArrowRight, Play, Star, Clock, Users, Hammer } from "lucide-react";
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
    <BaseLayout 
      title="Build with AI" 
      subtitle="Create powerful applications using Gemini's advanced capabilities"
    >
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
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

            <TabsContent value="templates" className="space-y-8">
              {/* Enhanced Templates Section */}
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                    <Hammer className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Quick Start Templates</h2>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Choose a professionally designed template to accelerate your AI project development
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {templates.map((template, index) => (
                  <Card key={index} className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 hover:border-primary/30 hover-lift bg-gradient-to-br from-background to-muted/20">
                    <div className="p-8">
                      <div className="flex flex-col gap-4 mb-6">
                        <div className={cn("p-4 rounded-xl shadow-lg self-start", template.color)}>
                          {template.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-2">{template.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{template.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-6 p-3 bg-muted/30 rounded-lg">
                        <Badge variant="outline" className="text-xs font-medium px-3 py-1">
                          {template.difficulty}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                          <Clock className="w-4 h-4" />
                          {template.time}
                        </div>
                      </div>

                      <Button className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground transition-all duration-300 group-hover:shadow-xl shadow-lg">
                        <Play className="w-5 h-5 mr-2" />
                        Start Building
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="showcase" className="space-y-8">
              {/* Enhanced Showcase Section */}
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Featured Applications</h2>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Discover cutting-edge AI applications built with Gemini's advanced capabilities
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {showcaseApps.map((app) => (
                  <Card 
                    key={app.id} 
                    className={cn(
                      "group hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 hover:border-primary/30 relative overflow-hidden bg-gradient-to-br from-background to-muted/20",
                      hoveredApp === app.id && "scale-105 shadow-2xl"
                    )}
                    onMouseEnter={() => setHoveredApp(app.id)}
                    onMouseLeave={() => setHoveredApp(null)}
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={cn("p-3 rounded-xl shadow-lg", app.color)}>
                          {app.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-foreground mb-2">{app.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{app.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span className="font-medium">{app.users.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                        {app.description}
                      </p>

                      {/* Enhanced Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {app.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Enhanced Difficulty and Time */}
                      <div className="flex items-center justify-between mb-6 p-3 bg-muted/30 rounded-lg">
                        <Badge variant="outline" className="text-xs font-medium px-3 py-1">
                          {app.difficulty}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                          <Clock className="w-4 h-4" />
                          {app.time}
                        </div>
                      </div>

                      <Button className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-xl">
                        <Play className="w-5 h-5 mr-2" />
                        Launch App
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                      </Button>
                    </div>

                    {/* Enhanced Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Enhanced Call to Action Footer */}
          <div className="mt-20 text-center">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 p-12 shadow-xl">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">Ready to Build?</h3>
              </div>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Transform your ideas into reality with AI-powered applications. Start building with Gemini's 
                cutting-edge capabilities and join thousands of developers creating the future.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-4 text-lg shadow-lg hover:shadow-xl hover-lift">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Project
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Explore Examples
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};