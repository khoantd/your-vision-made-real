import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useModelLoader, ModelInfo } from "@/hooks/useModelLoader";
import { useAIStudio } from "@/contexts/AIStudioContext";
import { cn } from "@/lib/utils";

interface DynamicModelSelectorProps {
  provider: "google" | "openai";
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  className?: string;
}

export const DynamicModelSelector = ({
  provider,
  selectedModel,
  onModelChange,
  className
}: DynamicModelSelectorProps) => {
  const { apiKeys } = useAIStudio();
  const { models, loading, error, apiKeyValid, autoLoadModels, clearError } = useModelLoader();
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const apiKey = apiKeys[provider];

  // Auto-load models when provider or API key changes
  useEffect(() => {
    autoLoadModels(provider, apiKey);
  }, [provider, apiKey, autoLoadModels]);

  const currentModels = models[provider];
  const isValid = apiKeyValid[provider];

  const getModelStatus = () => {
    if (!apiKey || !apiKey.trim()) {
      return { status: "no-key", message: "Enter API key to load models" };
    }
    if (loading) {
      return { status: "loading", message: "Loading models..." };
    }
    if (error) {
      return { status: "error", message: error };
    }
    if (!isValid) {
      return { status: "invalid", message: "Invalid API key" };
    }
    if (currentModels.length === 0) {
      return { status: "no-models", message: "No models available" };
    }
    return { status: "success", message: `${currentModels.length} models loaded` };
  };

  const status = getModelStatus();

  const renderStatusIcon = () => {
    switch (status.status) {
      case "loading":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
      case "invalid":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const renderModelCard = (model: ModelInfo) => {
    const isSelected = selectedModel === model.id;
    const isExpanded = showDetails === model.id;

    return (
      <div
        key={model.id}
        className={cn(
          "border rounded-lg p-3 cursor-pointer transition-all",
          isSelected
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-accent/50"
        )}
        onClick={() => onModelChange(model.id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm">{model.name}</h4>
              {isSelected && (
                <Badge variant="secondary" className="text-xs">
                  Selected
                </Badge>
              )}
            </div>
            
            {model.description && (
              <p className="text-xs text-muted-foreground mb-2">
                {model.description}
              </p>
            )}

            {isExpanded && (
              <div className="space-y-2 mt-2 pt-2 border-t border-border">
                {model.capabilities && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Capabilities:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {model.capabilities.map((cap) => (
                        <Badge key={cap} variant="outline" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {model.maxTokens && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Max Tokens: {model.maxTokens.toLocaleString()}
                    </span>
                  </div>
                )}

                {model.pricing && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Pricing:</span>
                    <div className="text-xs text-muted-foreground mt-1">
                      <div>Input: {model.pricing.input}</div>
                      <div>Output: {model.pricing.output}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(isExpanded ? null : model.id);
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? "Less" : "Details"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            Available Models ({currentModels.length})
          </span>
          {renderStatusIcon()}
        </div>
        
        {error && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearError}
            className="text-xs"
          >
            Retry
          </Button>
        )}
      </div>

      {/* Status Message */}
      {status.message && (
        <Alert className={cn(
          "text-xs",
          status.status === "success" && "border-green-200 bg-green-50",
          status.status === "error" && "border-red-200 bg-red-50",
          status.status === "invalid" && "border-red-200 bg-red-50",
          status.status === "no-key" && "border-yellow-200 bg-yellow-50"
        )}>
          <AlertDescription className="text-xs">
            {status.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Model Selection */}
      {currentModels.length > 0 && (
        <div className="space-y-2">
          {currentModels.map(renderModelCard)}
        </div>
      )}

      {/* Fallback Selector */}
      {currentModels.length === 0 && !loading && (
        <div className="border border-dashed border-border rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            No models available. Please check your API key and try again.
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading models...</span>
          </div>
        </div>
      )}
    </div>
  );
}; 