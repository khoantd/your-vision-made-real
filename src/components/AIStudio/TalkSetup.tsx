import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mic, Key, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TalkSetupProps {
  onApiKeySet: (apiKey: string) => void;
}

export const TalkSetup = ({ onApiKeySet }: TalkSetupProps) => {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const validateApiKey = (key: string): boolean => {
    return key.trim().startsWith("sk-") && key.length > 20;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateApiKey(apiKey)) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid OpenAI API key starting with 'sk-'",
        variant: "destructive",
      });
      return;
    }

    // For now, just accept the API key without validation to avoid CORS issues
    // The validation will happen when we try to connect to the voice chat
    onApiKeySet(apiKey);
    toast({
      title: "API Key Set",
      description: "Your API key has been configured for voice chat",
    });
  };

  const isValid = validateApiKey(apiKey);

  return (
    <div className="flex items-center justify-center h-full p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-3">
          <div className="p-3 bg-gradient-to-br from-brand-blue to-purple-600 rounded-lg inline-block">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold">Setup Voice Chat</h2>
          <p className="text-muted-foreground">
            Enter your OpenAI API key to enable real-time voice conversations
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your API key will be securely stored and used only for voice chat functionality.
            Get your API key from{" "}
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-blue hover:underline"
            >
              OpenAI Platform
            </a>
          </AlertDescription>
        </Alert>


        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openai-key">OpenAI API Key</Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="openai-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="pl-10"
                required
              />
              {apiKey && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {isValid ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {apiKey && !isValid && (
              <p className="text-sm text-red-500">
                API key should start with "sk-" and be at least 20 characters long
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-blue hover:bg-brand-blue/90"
            disabled={!isValid}
          >
            Start Voice Chat
          </Button>
        </form>

        <div className="text-center space-y-2">
          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded p-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ First configure your OpenAI API key in Supabase Edge Functions
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Don't have an OpenAI API key?{" "}
            <a 
              href="https://platform.openai.com/signup" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-blue hover:underline"
            >
              Sign up here
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};