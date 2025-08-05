import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mic, Video, Monitor, Play, HelpCircle, Code, Share, RotateCcw, MoreHorizontal, MicOff, ChevronDown, Settings, Sparkles, Bot, TestTube } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import useSpeechRecognition from "react-hook-speech-to-text";
import { useAIStudio } from "@/contexts/AIStudioContext";
import { APIKeyInput } from "./APIKeyInput";
import { DynamicModelSelector } from "./DynamicModelSelector";
import { LLM_PROVIDERS } from "@/constants/models";
import { OpenAIService } from "@/lib/openai";

export const StreamArea = () => {
  const [prompt, setPrompt] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [recordingTimeout, setRecordingTimeout] = useState<NodeJS.Timeout | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);

  // Use AIStudio context for provider and API configuration
  const { 
    modelConfig, 
    updateModelConfig, 
    apiKeys, 
    updateApiKey 
  } = useAIStudio();

  // Use react-hook-speech-to-text
  const {
    error,
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText
  } = useSpeechRecognition({
    continuous: true, // Set to true to allow continuous recording
    crossBrowser: true,
    speechRecognitionProperties: {
      interimResults: true,
      lang: 'en-US'
    }
  });

  // Update prompt when transcript changes
  useEffect(() => {
    if (results.length > 0 && !isRecording) {
      const lastResult = results[results.length - 1];
      const transcript = typeof lastResult === 'string' ? lastResult : lastResult.transcript;
      setPrompt(transcript);
    }
  }, [results, isRecording]);

  // Monitor speech recognition errors
  useEffect(() => {
    if (error) {
      console.error('Speech recognition error:', error);
      // Auto-restart if there's an error and we were supposed to be recording
      if (isRecording) {
        console.log('Attempting to restart speech recognition after error...');
        setTimeout(() => {
          startSpeechToText().catch(err => {
            console.error('Failed to restart speech recognition:', err);
          });
        }, 1000);
      }
    }
  }, [error, isRecording, startSpeechToText]);

  // Monitor recording state and capture stream for cleanup
  useEffect(() => {
    if (isRecording) {
      // When recording starts, try to capture the active stream
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          activeStreamRef.current = stream;
          console.log('Captured audio stream for cleanup');
        })
        .catch(error => {
          console.log('Could not capture stream for cleanup:', error);
        });
    } else {
      // Clear the stream reference when recording stops
      activeStreamRef.current = null;
    }
  }, [isRecording]);

  // Cleanup effect to ensure microphone is released when component unmounts
  useEffect(() => {
    return () => {
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log('Cleanup: Stopped audio track:', track.label);
        });
        activeStreamRef.current = null;
      }
      
      // Clear any existing timeout
      if (recordingTimeout) {
        clearTimeout(recordingTimeout);
      }
    };
  }, [recordingTimeout]);

  // Get the correct API key for the current provider
  const currentApiKey = apiKeys[modelConfig.provider];

  const handleTalkToggle = async () => {
    if (isRecording) {
      console.log('Stopping speech recognition...');
      stopSpeechToText();
      
      // Clear any existing timeout
      if (recordingTimeout) {
        clearTimeout(recordingTimeout);
        setRecordingTimeout(null);
      }
      
      // Clean up any tracked streams
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log('Stopped tracked audio track:', track.label);
        });
        activeStreamRef.current = null;
      }
    } else {
      console.log('Starting speech recognition...');
      setResults([]);
      try {
        await startSpeechToText();
        console.log('Speech recognition started successfully');
        
        // Set a timeout to auto-stop after 30 seconds to prevent infinite recording
        const timeout = setTimeout(() => {
          console.log('Auto-stopping recording after 30 seconds');
          stopSpeechToText();
          setRecordingTimeout(null);
        }, 30000);
        setRecordingTimeout(timeout);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    }
  };

  const handleProviderChange = (provider: "google" | "openai") => {
    updateModelConfig({ provider });
    // Auto-select first model of the new provider
    const firstModel = provider === "google" ? "gemini-2.0-flash-exp" : "gpt-4o";
    updateModelConfig({ name: firstModel });
  };

  const handleModelChange = (modelId: string) => {
    updateModelConfig({ name: modelId });
  };

  const hasValidApiKey = () => {
    const apiKey = apiKeys[modelConfig.provider];
    if (!apiKey || !apiKey.trim()) return false;
    
    if (modelConfig.provider === "openai") {
      return apiKey.startsWith("sk-") && apiKey.length > 20;
    } else if (modelConfig.provider === "google") {
      return apiKey.startsWith("AIza") && apiKey.length > 20;
    }
    return false;
  };

  const testAPIKey = async () => {
    if (!currentApiKey) {
      alert(`Please enter your ${modelConfig.provider === "openai" ? "OpenAI" : "Google"} API key first.`);
      return;
    }

    try {
      const openaiService = new OpenAIService(currentApiKey);
      const isValid = await openaiService.testAPIKey();
      
      if (isValid) {
        alert("✅ API key is valid! You can now start streaming.");
      } else {
        alert("❌ API key is invalid. Please check your key and try again.");
      }
    } catch (error) {
      console.error("API key test failed:", error);
      alert("❌ API key test failed. Please check your key and try again.");
    }
  };

  const getProviderIcon = () => {
    return modelConfig.provider === "openai" ? <Sparkles className="w-4 h-4" /> : <Bot className="w-4 h-4" />;
  };

  const getProviderName = () => {
    return modelConfig.provider === "openai" ? "OpenAI" : "Google";
  };

  return (
    <div className="flex-1 bg-chat-bg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-foreground">Stream Realtime</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-border p-6 bg-sidebar-hover">
          <Collapsible open={true}>
            <CollapsibleTrigger className="flex items-center justify-between w-full mb-4 cursor-pointer hover:bg-accent/50 rounded-md p-2 -m-2 transition-colors">
              <h3 className="text-sm font-medium text-foreground">LLM Configuration</h3>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-6">
                {/* Provider Selection */}
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    LLM Provider
                  </Label>
                  <Select 
                    value={modelConfig.provider} 
                    onValueChange={handleProviderChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LLM_PROVIDERS.map((provider) => (
                        <SelectItem key={provider.value} value={provider.value}>
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* API Configuration */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground">API Configuration</h4>
                  <APIKeyInput provider={modelConfig.provider} />
                </div>

                <Separator />

                {/* Model Selection */}
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Model Selection
                  </Label>
                  <DynamicModelSelector
                    provider={modelConfig.provider}
                    selectedModel={modelConfig.name}
                    onModelChange={handleModelChange}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">
        {/* Title */}
        <h1 className="text-4xl font-normal text-center mb-12 text-foreground">
          Talk to {getProviderName()} live
        </h1>

        {/* API Key Warning */}
        {!hasValidApiKey() && (
          <div className="w-full max-w-2xl mb-6">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertDescription className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Please configure your {getProviderName()} API key in the settings to use speech-to-text functionality.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Prompt Input */}
        <Card className="w-full max-w-2xl mb-8 p-6 bg-prompt-bg border border-border">
          <div className="flex items-center gap-4 mb-4">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Start typing a prompt"
              className="flex-1 border-border"
            />
            <Button size="icon" variant="ghost" className="text-muted-foreground">
              <HelpCircle className="w-4 h-4" />
            </Button>
            <Button 
              className="bg-brand-blue hover:bg-brand-blue/90 text-white gap-2"
              disabled={!hasValidApiKey()}
            >
              <Play className="w-4 h-4" />
              Run
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="text-muted-foreground">
              <Code className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="text-muted-foreground">
              <Share className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="text-muted-foreground">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="text-muted-foreground">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className={`gap-2 bg-white border-border hover:bg-sidebar-hover ${
              isRecording ? 'bg-red-50 border-red-300 text-red-600' : ''
            }`}
            onClick={handleTalkToggle}
            disabled={!navigator.mediaDevices || !hasValidApiKey()}
          >
            {isRecording ? (
              <>
                <MicOff className="w-4 h-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                Talk
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className="gap-2 bg-white border-border hover:bg-sidebar-hover"
          >
            <Video className="w-4 h-4" />
            Webcam
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 bg-white border-border hover:bg-sidebar-hover"
          >
            <Monitor className="w-4 h-4" />
            Share Screen
          </Button>
        </div>

        {/* Enhanced Test API Key Button */}
        {currentApiKey && (
          <div className="mt-4 w-full max-w-2xl">
            <Button 
              variant="outline" 
              onClick={testAPIKey}
              className="w-full border-brand-blue/30 text-brand-blue hover:bg-brand-blue/10 transition-colors"
            >
              <TestTube className="w-4 h-4 mr-2" />
              Test {getProviderName()} API Key
            </Button>
          </div>
        )}

        {/* Browser Support Warning */}
        {!navigator.mediaDevices && (
          <div className="mt-4 w-full max-w-2xl">
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <p className="text-sm text-yellow-800 font-medium mb-2">⚠️ Speech Recognition Not Available</p>
              <p className="text-yellow-900 text-xs">
                Your browser doesn't support speech recognition. Please try Chrome, Edge, or Firefox with microphone permissions enabled.
              </p>
            </Card>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 w-full max-w-2xl">
            <Card className="p-4 bg-red-50 border-red-200">
              <p className="text-sm text-red-800 font-medium mb-2">Error:</p>
              <p className="text-red-900">{error}</p>
            </Card>
          </div>
        )}

        {/* Transcript Display */}
        {(results.length > 0 || interimResult) && (
          <div className="mt-6 w-full max-w-2xl">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-2">Live Transcript:</p>
              <p className="text-blue-900">
                {results.length > 0 && (
                  <div>
                    <strong>Final Results:</strong> {results.map((result, index) => 
                      typeof result === 'string' ? result : result.transcript
                    ).join(', ')}
                  </div>
                )}
                {interimResult && (
                  <div className="mt-2">
                    <strong>Interim:</strong> {interimResult}
                  </div>
                )}
              </p>
            </Card>
          </div>
        )}

        {/* Debug Panel - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 w-full max-w-2xl">
            <Card className="p-4 bg-gray-50 border-gray-200">
              <p className="text-sm text-gray-800 font-medium mb-2">Debug Info:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Provider: {modelConfig.provider}</p>
                <p>Model: {modelConfig.name}</p>
                <p>API Key Valid: {hasValidApiKey() ? '✅' : '❌'}</p>
                <p>Browser Supports Speech Recognition: {navigator.mediaDevices ? '✅' : '❌'}</p>
                <p>Recording: {isRecording ? '✅' : '❌'}</p>
                <p>Recording Timeout: {recordingTimeout ? '⏰ Active' : '❌ None'}</p>
                <p>Results Count: {results.length}</p>
                <p>Interim Result: {interimResult || 'None'}</p>
                <p>Error: {error || 'None'}</p>
                <p>Active Stream: {activeStreamRef.current ? '✅' : '❌'}</p>
                <p>User Agent: {navigator.userAgent.substring(0, 50)}...</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};