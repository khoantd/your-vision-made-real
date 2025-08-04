import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StatusBarProps {
  status: {
    type: "success" | "warning" | "error" | "info";
    label: string;
  };
  badges?: Array<{
    label: string;
    variant?: "default" | "secondary" | "outline";
    color?: string;
  }>;
  actions?: ReactNode;
  className?: string;
}

export const StatusBar = ({ status, badges, actions, className }: StatusBarProps) => {
  const statusColors = {
    success: "bg-green-500 hover:bg-green-600",
    warning: "bg-yellow-500 hover:bg-yellow-600", 
    error: "bg-red-500 hover:bg-red-600",
    info: "bg-blue-500 hover:bg-blue-600"
  };

  return (
    <div className={cn("p-4 bg-accent/30 border-b border-border", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <Badge className={statusColors[status.type]}>
            {status.label}
          </Badge>
          
          {/* Additional Badges */}
          {badges && badges.map((badge, index) => (
            <Badge 
              key={index} 
              variant={badge.variant || "outline"}
              className={badge.color}
            >
              {badge.label}
            </Badge>
          ))}
        </div>
        
        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};