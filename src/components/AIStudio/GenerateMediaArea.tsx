import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { useState } from "react";
import { ModelCard } from "@/components/common/ModelCard";
import { MEDIA_MODELS, EXAMPLE_PROMPTS } from "@/constants/models";

const examples = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
    description: "Explore the Veo 3 gallery and remix an example",
    type: "veo"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
    description: '"Create a stylized 3D city..."',
    type: "3d"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop&crop=center",
    description: '"Create a horizontally oriented rectangular stamp that features the Mission District\'s vibrant culture..."',
    type: "design"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=300&fit=crop&crop=center",
    description: "Multiple speaker audio",
    type: "audio"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop&crop=center",
    description: '"Generate a hyper-realistic, studio-quality product ad..."',
    type: "product"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center",
    description: '"Generate a sequence of images to produce a step..."',
    type: "sequence"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center",
    description: "Live link musical prompts with a MIDI controller",
    type: "music"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center",
    description: '"Create a video showing some hands first sprinkling salt into a pan of stir-fried vegetables..."',
    type: "cooking"
  }
];

export const GenerateMediaArea = () => {
  const [selectedModel, setSelectedModel] = useState<string>(MEDIA_MODELS[0].id);

  return (
    <div className="flex-1 bg-chat-bg overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-normal mb-2 text-foreground">
            Create Generative Media
          </h1>
          <p className="text-muted-foreground">Explore models</p>
        </div>

        {/* Model Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {MEDIA_MODELS.map((model) => (
            <ModelCard
              key={model.id}
              id={model.id}
              name={model.name}
              description={model.description}
              badge={model.badge}
              type={model.type}
              isSelected={selectedModel === model.id}
              onSelect={setSelectedModel}
            />
          ))}
        </div>

        {/* Examples Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg font-medium text-foreground">Or try some examples</h2>
            <Badge variant="secondary" className="bg-brand-blue-light text-brand-blue">
              Veo 3
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {examples.map((example) => (
              <Card key={example.id} className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                <div className="relative">
                  <img 
                    src={example.image} 
                    alt={example.description}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <div className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-foreground line-clamp-3">{example.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <Button variant="outline" className="bg-white border-border hover:bg-sidebar-hover">
            Load more examples
          </Button>
        </div>
      </div>
    </div>
  );
};