import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Code, Image, Gamepad2, Mic, Music, Search, Map, MessageSquare, FileText, Video, Cpu } from "lucide-react";

const templates = [
  {
    icon: <Gamepad2 className="w-5 h-5" />,
    title: "Dynamic text game using Gemini",
    color: "bg-blue-500"
  },
  {
    icon: <Code className="w-5 h-5" />,
    title: "Gemini powered code review",
    color: "bg-green-500"
  },
  {
    icon: <Image className="w-5 h-5" />,
    title: "Imagen pixel art maker",
    color: "bg-purple-500"
  }
];

const showcaseApps = [
  {
    id: 1,
    title: "Veo 3 Gallery",
    description: "Explore a dynamic gallery, dive into examples and remix video prompts to generate your own unique variations",
    icon: <Video className="w-8 h-8" />,
    tags: ["Veo 3.0", "Audio-Video Generation"],
    color: "bg-orange-100"
  },
  {
    id: 2,
    title: "Gemini OS",
    description: "Simulate a computer with a UI that is generated dynamically from user interactions.",
    icon: <Cpu className="w-8 h-8" />,
    tags: ["Gemini 2.5 Flash-Lite", "Generative UI"],
    color: "bg-blue-100"
  },
  {
    id: 3,
    title: "Mumble Jumble",
    description: "A playground to discover the range of creative voices that the Gemini native audio out has to offer.",
    icon: <Mic className="w-8 h-8" />,
    tags: ["Gemini 2.5 Flash Audio", "Imagen"],
    color: "bg-green-100"
  },
  {
    id: 4,
    title: "Live Audio",
    description: "Experience real-time voice chat with 3D visuals react to your conversation, bringing AI interaction to life.",
    icon: <MessageSquare className="w-8 h-8" />,
    tags: ["Gemini 2.5 Flash Audio", "Live API"],
    color: "bg-purple-100"
  },
  {
    id: 5,
    title: "PromptDJ",
    description: "Steer a continuous stream of music with text prompts",
    icon: <Music className="w-8 h-8" />,
    tags: ["Lyria", "Music generation"],
    color: "bg-pink-100"
  },
  {
    id: 6,
    title: "PromptDJ MIDI",
    description: "Control real time music with a MIDI controller.",
    icon: <Music className="w-8 h-8" />,
    tags: ["Lyria", "Music generation"],
    color: "bg-indigo-100"
  },
  {
    id: 7,
    title: "Thinking Space",
    description: "Search a custom set of images using natural language.",
    icon: <Search className="w-8 h-8" />,
    tags: ["Gemini 2.5 Flash"],
    color: "bg-yellow-100"
  },
  {
    id: 8,
    title: "MCP Maps 3D",
    description: "Build Photoreai 3D maps with natural language using a Gemini-powered Agent and MCP tool.",
    icon: <Map className="w-8 h-8" />,
    tags: ["Gemini 2.5 Flash", "Google Maps API"],
    color: "bg-teal-100"
  }
];

export const BuildArea = () => {
  return (
    <div className="flex-1 bg-chat-bg flex flex-col">
      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-normal mb-4 text-foreground">
            Build apps with Gemini
          </h1>
          <p className="text-muted-foreground mb-6">
            Build apps using the SDK without a key, try "an image generator that uses imagen"
          </p>
          
          <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white gap-2 mb-8">
            <Plus className="w-4 h-4" />
            Start from a template
          </Button>

          {/* Template Cards */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {templates.map((template, index) => (
              <Card key={index} className="p-3 bg-white hover:shadow-md transition-shadow cursor-pointer border">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded ${template.color} text-white`}>
                    {template.icon}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {template.title}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="showcase" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="showcase">Showcase</TabsTrigger>
            <TabsTrigger value="your-apps">Your apps</TabsTrigger>
            <TabsTrigger value="recent-apps">Recent apps</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="showcase">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {showcaseApps.map((app) => (
                <Card key={app.id} className={`p-6 hover:shadow-lg transition-shadow cursor-pointer ${app.color} border`}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        {app.icon}
                      </div>
                      <h3 className="font-semibold text-foreground">{app.title}</h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {app.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {app.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="your-apps">
            <div className="text-center py-16">
              <p className="text-muted-foreground">No apps created yet. Start building your first app!</p>
            </div>
          </TabsContent>

          <TabsContent value="recent-apps">
            <div className="text-center py-16">
              <p className="text-muted-foreground">No recent apps to display.</p>
            </div>
          </TabsContent>

          <TabsContent value="faq">
            <div className="text-center py-16">
              <p className="text-muted-foreground">Frequently asked questions about building apps.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};