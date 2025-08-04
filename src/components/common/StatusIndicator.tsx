import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, XCircle, Clock, Loader2 } from "lucide-react";

export type StatusType = 'success' | 'warning' | 'error' | 'pending' | 'loading';

interface StatusIndicatorProps {
  status: StatusType;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusIndicator = ({ 
  status, 
  message, 
  size = 'md',
  className 
}: StatusIndicatorProps) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-5 h-5"
  };

  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-200"
        };
      case 'warning':
        return {
          icon: AlertCircle,
          color: "text-yellow-500", 
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-200"
        };
      case 'error':
        return {
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-500/10", 
          borderColor: "border-red-200"
        };
      case 'pending':
        return {
          icon: Clock,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-200"
        };
      case 'loading':
        return {
          icon: Loader2,
          color: "text-gray-500",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-200"
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "rounded-full p-1 border",
        config.bgColor,
        config.borderColor
      )}>
        <Icon 
          className={cn(
            sizeClasses[size],
            config.color,
            status === 'loading' && "animate-spin"
          )} 
        />
      </div>
      {message && (
        <span className={cn(
          "text-sm",
          size === 'sm' && "text-xs",
          size === 'lg' && "text-base"
        )}>
          {message}
        </span>
      )}
    </div>
  );
};