import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ModelCardProps {
  id: string;
  name: string;
  description: string;
  badge?: string;
  type: "image" | "video";
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

export const ModelCard = ({ 
  id, 
  name, 
  description, 
  badge, 
  type, 
  onSelect, 
  isSelected = false 
}: ModelCardProps) => {
  return (
    <Card className={`p-4 border transition-all ${isSelected ? 'border-brand-blue bg-brand-blue/5' : 'border-border hover:border-brand-blue/50'}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground">{name}</h3>
            {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
          </div>
          <Badge variant="outline" className="text-xs capitalize">
            {type}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground">{description}</p>
        
        <Button 
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className="w-full"
          onClick={() => onSelect?.(id)}
        >
          {isSelected ? "Selected" : "Select Model"}
        </Button>
      </div>
    </Card>
  );
};