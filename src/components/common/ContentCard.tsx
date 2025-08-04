import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

interface ContentCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  badge?: string;
  tags?: string[];
  metadata?: Array<{
    label: string;
    value: string;
  }>;
  actions?: ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const ContentCard = ({
  title,
  description,
  icon,
  badge,
  tags,
  metadata,
  actions,
  onClick,
  className,
  size = "md"
}: ContentCardProps) => {
  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6"
  };

  return (
    <Card 
      className={cn(
        "hover:bg-accent/50 transition-colors cursor-pointer",
        sizeClasses[size],
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {icon && (
          <div className="flex-shrink-0">
            {icon}
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title Row */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "font-medium truncate",
              size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base"
            )}>
              {title}
            </h3>
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
          
          {/* Description */}
          {description && (
            <p className={cn(
              "text-muted-foreground mb-2",
              size === "sm" ? "text-xs" : "text-sm"
            )}>
              {description}
            </p>
          )}
          
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Metadata */}
          {metadata && metadata.length > 0 && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {metadata.map((item, index) => (
                <span key={index}>
                  {item.label}: {item.value}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1">
          {actions}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
};