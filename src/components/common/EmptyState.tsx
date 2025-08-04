import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  features?: Array<{
    icon: ReactNode;
    title: string;
    description: string;
  }>;
  className?: string;
}

export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  features,
  className 
}: EmptyStateProps) => {
  return (
    <div className={cn("flex items-center justify-center h-full p-8", className)}>
      <div className="text-center w-full max-w-2xl">
        {/* Icon */}
        <div className="p-4 bg-accent/50 rounded-lg inline-block mb-6">
          {icon}
        </div>
        
        {/* Title and Description */}
        <h3 className="text-2xl font-semibold mb-3">{title}</h3>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {description}
        </p>
        
        {/* Features Grid */}
        {features && features.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-card rounded-lg border text-left">
                <div className="text-brand-blue flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {action && (
          <div className="w-full flex justify-center">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};