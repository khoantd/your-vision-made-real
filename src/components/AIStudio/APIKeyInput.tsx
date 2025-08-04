import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Key, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAIStudio } from "@/contexts/AIStudioContext";
import { useNotifications } from "@/components/common/ToastNotifications";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface APIKeyInputProps {
  provider: "openai" | "google";
  className?: string;
}

export const APIKeyInput = ({ 
  provider,
  className 
}: APIKeyInputProps) => {
  const { apiKeys, updateApiKey, testApiKey } = useAIStudio();
  const { showSuccess, showError } = useNotifications();
  const [showKey, setShowKey] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [hasBeenValidated, setHasBeenValidated] = useState(false);

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
    setHasBeenValidated(false); // Reset validation state when key changes
  };

  const handleValidate = async () => {
    if (!apiKey.trim()) return;
    
    setIsValidating(true);
    try {
      const result = await testApiKey(provider, apiKey);
      setIsValid(result);
      setHasBeenValidated(true);
      if (result) {
        showSuccess("API Key Validated", "Successfully connected to AI service.");
      } else {
        showError("API Key Invalid", "Please check your API key and try again.");
      }
    } catch (error) {
      setIsValid(false);
      setHasBeenValidated(true);
      showError("Validation Failed", "Failed to validate API key. Please try again.");
    } finally {
      setIsValidating(false);
    }
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
            "pl-10 pr-16",
            !isValid && apiKey && "border-red-500 focus:border-red-500",
            hasBeenValidated && isValid && "border-green-500 bg-green-50/50"
          )}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1">
          {apiKey && hasBeenValidated && (
            <>
              {isValid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={toggleVisibility}
          >
            {showKey ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex gap-3">
        <div className="flex-1 space-y-1">
          {!isValid && apiKey && (
            <p className="text-sm text-red-500">
              Please enter a valid {provider} API key (starts with "{providerInfo.format}")
            </p>
          )}
          {apiKey && isValid && hasBeenValidated && (
            <p className="text-sm text-green-600">
              ✓ API key validated successfully
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {providerInfo.description}
          </p>
        </div>
        
        {apiKey && (
          <Button
            type="button" 
            onClick={handleValidate}
            disabled={!apiKey.trim() || isValidating || !isValid}
            size="sm"
            className={cn(
              "transition-all duration-200",
              hasBeenValidated && isValid && "bg-green-600 hover:bg-green-700"
            )}
          >
            {isValidating ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Key className="w-4 h-4 mr-1" />
                {hasBeenValidated && isValid ? "Valid" : "Test"}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}; 