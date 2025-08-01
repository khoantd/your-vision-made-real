import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  title: string;
  description: string;
  badge?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const FeatureCard = ({ title, description, badge, icon, onClick }: FeatureCardProps) => {
  return (
    <Card 
      className="p-4 cursor-pointer hover:bg-sidebar-hover transition-colors border-border bg-card"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {icon && <div className="text-brand-blue">{icon}</div>}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-foreground">{title}</h3>
            {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
};