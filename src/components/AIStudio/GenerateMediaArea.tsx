import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BaseLayout } from "@/components/common/BaseLayout";
import { EmptyState } from "@/components/common/EmptyState";
import { ContentCard } from "@/components/common/ContentCard";
import { Play, Image, Sparkles, Video, Music, Palette, Camera, ArrowRight, Star, Clock, Users, Zap, Settings } from "lucide-react";
import { useState } from "react";
import { ModelCard } from "@/components/common/ModelCard";
import { MEDIA_MODELS, EXAMPLE_PROMPTS } from "@/constants/models";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAIStudio } from "@/contexts/AIStudioContext";

const examples = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
    description: "Explore the Veo 3 gallery and remix an example",
    type: "veo",
    difficulty: "Beginner",
    time: "2-3 min",
    rating: 4.8,
    users: 1247
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
    description: '"Create a stylized 3D city..."',
    type: "3d",
    difficulty: "Intermediate",
    time: "5-8 min",
    rating: 4.6,
    users: 892
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop&crop=center",
    description: '"Create a horizontally oriented rectangular stamp that features the Mission District\'s vibrant culture..."',
    type: "design",
    difficulty: "Advanced",
    time: "10-15 min",
    rating: 4.9,
    users: 2156
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=300&fit=crop&crop=center",
    description: "Multiple speaker audio",
    type: "audio",
    difficulty: "Intermediate",
    time: "3-5 min",
    rating: 4.5,
    users: 743
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop&crop=center",
    description: '"Generate a hyper-realistic, studio-quality product ad..."',
    type: "product",
    difficulty: "Advanced",
    time: "8-12 min",
    rating: 4.7,
    users: 1567
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center",
    description: '"Generate a sequence of images to produce a step..."',
    type: "sequence",
    difficulty: "Intermediate",
    time: "6-10 min",
    rating: 4.4,
    users: 634
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center",
    description: "Live link musical prompts with a MIDI controller",
    type: "music",
    difficulty: "Advanced",
    time: "15-20 min",
    rating: 4.8,
    users: 987
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center",
    description: '"Create a video showing some hands first sprinkling salt into a pan of stir-fried vegetables..."',
    type: "cooking",
    difficulty: "Beginner",
    time: "4-6 min",
    rating: 4.3,
    users: 1123
  }
];

export const GenerateMediaArea = () => {
  const { modelConfig } = useAIStudio();
  const [selectedModel, setSelectedModel] = useState<string>(MEDIA_MODELS[0].id);
  const [hoveredExample, setHoveredExample] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("models");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "veo":
      case "video":
        return <Video className="w-4 h-4" />;
      case "image":
      case "design":
        return <Image className="w-4 h-4" />;
      case "audio":
      case "music":
        return <Music className="w-4 h-4" />;
      case "3d":
        return <Palette className="w-4 h-4" />;
      default:
        return <Camera className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "veo":
      case "video":
        return "bg-gradient-to-br from-red-500 to-red-600";
      case "image":
      case "design":
        return "bg-gradient-to-br from-blue-500 to-blue-600";
      case "audio":
      case "music":
        return "bg-gradient-to-br from-purple-500 to-purple-600";
      case "3d":
        return "bg-gradient-to-br from-green-500 to-green-600";
      default:
        return "bg-gradient-to-br from-gray-500 to-gray-600";
    }
  };

  return (
    <BaseLayout 
      title="Generate Media" 
      subtitle="Create stunning images, videos, and audio using advanced AI models"
    >
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Enhanced Model Cards */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Available Models</h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Latest Models
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MEDIA_MODELS.map((model) => (
                <Card 
                  key={model.id} 
                  className={cn(
                    "p-6 cursor-pointer transition-all duration-200 border-2 hover:border-brand-blue/20 hover:shadow-lg",
                    selectedModel === model.id && "border-brand-blue/40 bg-brand-blue/5"
                  )}
                  onClick={() => setSelectedModel(model.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-lg", getTypeColor(model.type))}>
                      {getTypeIcon(model.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{model.name}</h3>
                        {model.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {model.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{model.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Ready to use</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Enhanced Examples Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-foreground">Example Prompts</h2>
                <Badge variant="secondary" className="bg-brand-blue-light text-brand-blue">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {examples.map((example) => (
                <Card 
                  key={example.id} 
                  className={cn(
                    "group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-brand-blue/20",
                    hoveredExample === example.id && "scale-105"
                  )}
                  onMouseEnter={() => setHoveredExample(example.id)}
                  onMouseLeave={() => setHoveredExample(null)}
                >
                  <div className="relative">
                    <img 
                      src={example.image} 
                      alt={example.description}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <div className="w-8 h-8 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="text-xs">
                        {example.difficulty}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-foreground line-clamp-3 mb-3">{example.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{example.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{example.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>{example.users.toLocaleString()}</span>
                      </div>
                      <Button size="sm" className="h-7 px-3 text-xs bg-gradient-to-r from-brand-blue to-purple-600 hover:from-brand-blue/90 hover:to-purple-600/90 text-white">
                        Try
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Enhanced Load More */}
          <div className="text-center">
            <Button 
              variant="outline" 
              className="bg-white border-border hover:bg-sidebar-hover hover:border-brand-blue/20 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Load More Examples
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Status Information */}
          <div className="mt-12 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Media Generation Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Model: {modelConfig.name}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Settings className="w-4 h-4 mr-2" />
                Advanced Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};