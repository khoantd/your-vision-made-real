import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAIStudio } from "@/contexts/AIStudioContext";

interface APIKeyInputProps {
  provider: "openai" | "google";
  className?: string;
}

export const APIKeyInput = ({ 
  provider,
  className 
}: APIKeyInputProps) => {
  const { apiKeys, updateApiKey } = useAIStudio();
  const [showKey, setShowKey] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const apiKey = apiKeys[provider];

  const validateApiKey = (key: string) => {
    if (!key) return true; // Empty is valid (not required)
    
    if (provider === "openai") {
      return key.startsWith("sk-") && key.length > 20;
    } else if (provider === "google") {
      return key.startsWith("AIza") && key.length > 20;
    }
    return true;
  };

  const handleChange = (newValue: string) => {
    updateApiKey(provider, newValue);
    const isValidFormat = validateApiKey(newValue);
    setIsValid(newValue === "" || isValidFormat);
  };

  const toggleVisibility = () => {
    setShowKey(!showKey);
  };

  const getProviderInfo = () => {
    if (provider === "openai") {
      return {
        label: "OpenAI API Key",
        placeholder: "Enter your OpenAI API key",
        format: "sk-...",
        description: "Get your API key from OpenAI Platform"
      };
    } else {
      return {
        label: "Google API Key",
        placeholder: "Enter your Google API key",
        format: "AIza...",
        description: "Get your API key from Google AI Studio"
      };
    }
  };

  const providerInfo = getProviderInfo();

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={`api-key-${provider}`} className="text-sm font-medium">
        {providerInfo.label}
      </Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Key className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          id={`api-key-${provider}`}
          type={showKey ? "text" : "password"}
          value={apiKey}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={providerInfo.placeholder}
          className={cn(
            "pl-10 pr-10",
            !isValid && apiKey && "border-red-500 focus:border-red-500"
          )}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={toggleVisibility}
        >
          {showKey ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
      
      <div className="space-y-1">
        {!isValid && apiKey && (
          <p className="text-sm text-red-500">
            Please enter a valid {provider} API key (starts with "{providerInfo.format}")
          </p>
        )}
        {apiKey && isValid && (
          <p className="text-sm text-green-600">
            ✓ API key format looks valid
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {providerInfo.description}
        </p>
      </div>
    </div>
  );
}; 