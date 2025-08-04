import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, Phone, PhoneOff, MessageSquare, Volume2, Loader2, User, Bot, Sparkles, Settings, Radio, ArrowRight, Clock, Users, Zap, Copy, Trash2, RotateCcw, MoreHorizontal, Send } from 'lucide-react';
import { useVoiceChat, VoiceChatMessage } from '@/hooks/useVoiceChat';
import { useAIStudio } from '@/contexts/AIStudioContext';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BaseLayout } from '@/components/common/BaseLayout';
import { EmptyState } from '@/components/common/EmptyState';

export const VoiceChat = () => {
  const { apiKeys, modelConfig } = useAIStudio();
  const [textInput, setTextInput] = useState('');
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const apiKey = apiKeys.openai;

  const {
    isConnected,
    isRecording,
    isSpeaking,
    messages,
    currentTranscript,
    audioLevel,
    connect,
    disconnect,
    startRecording,
    stopRecording,
    sendTextMessage,
    clearMessages
  } = useVoiceChat({ apiKey });

  const handleConnect = async () => {
    if (!apiKey) {
      alert('Please set your OpenAI API key in the settings first');
      return;
    }
    await connect();
    if (isConnected) {
      await startRecording();
    }
  };

  const handleDisconnect = () => {
    stopRecording();
    disconnect();
  };

  const handleSendText = () => {
    if (textInput.trim() && isConnected) {
      sendTextMessage(textInput.trim());
      setTextInput('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getProviderIcon = () => {
    return modelConfig.provider === "openai" ? <Sparkles className="w-4 h-4" /> : <Radio className="w-4 h-4" />;
  };

  const getProviderName = () => {
    return modelConfig.provider === "openai" ? "OpenAI" : "Google";
  };

  return (
    <BaseLayout
      title="Voice Chat"
      subtitle="Real-time voice conversations with AI"
    >
      <EmptyState
        icon={<div className="p-4 bg-gradient-to-br from-brand-blue to-purple-600 rounded-full">
          <Radio className="w-12 h-12 text-white" />
        </div>}
        title="Voice Conversation Ready"
        description="Connect to start a natural voice conversation with your AI assistant."
        features={[
          {
            icon: <Mic className="w-5 h-5" />,
            title: "Voice Input",
            description: "Natural speech recognition and processing"
          },
          {
            icon: <Volume2 className="w-5 h-5" />,
            title: "AI Response",
            description: "Real-time AI voice responses"
          },
          {
            icon: <MessageSquare className="w-5 h-5" />,
            title: "Text Input",
            description: "Type messages as an alternative"
          }
        ]}
        action={
          <div className="space-y-6 w-full max-w-4xl">
            {/* Connection Status Card */}
            <Card className="p-6 bg-gradient-to-br from-accent/20 to-accent/10 border border-border shadow-lg">{/* ... keep existing code */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-lg transition-all duration-200 shadow-lg",
                    isConnected 
                      ? "bg-gradient-to-br from-green-500 to-green-600 text-white" 
                      : "bg-gradient-to-br from-brand-blue to-purple-600 text-white"
                  )}>
                    <Radio className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-foreground">Voice Chat</h3>
                      <Badge variant="secondary" className="text-xs">
                        {getProviderIcon()} {getProviderName()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Real-time
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isConnected ? '🟢 Connected to AI Assistant' : '⚪ Ready to Connect'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Connection Status */}
                  <Badge 
                    variant={isConnected ? "default" : "secondary"}
                    className={cn(
                      "transition-all duration-200",
                      isConnected && "bg-green-500 hover:bg-green-600"
                    )}
                  >
                    {isConnected ? "Connected" : "Disconnected"}
                  </Badge>

                  {/* Recording Status */}
                  {isRecording && (
                    <Badge variant="destructive" className="animate-pulse">
                      <Mic className="w-3 h-3 mr-1" />
                      Recording
                    </Badge>
                  )}

                  {/* Speaking Status */}
                  {isSpeaking && (
                    <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                      <Volume2 className="w-3 h-3 mr-1" />
                      Speaking
                    </Badge>
                  )}

                  {/* Settings Button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground hover:bg-accent"
                          onClick={() => setShowSettings(!showSettings)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Voice Settings</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Audio Level Indicator */}
              {isRecording && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">Audio Level</span>
                  </div>
                  <div className="w-full bg-accent rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-100"
                      style={{ width: `${audioLevel}%` }}
                    />
                  </div>
                </div>
              )}
            </Card>

            {/* Messages Area */}
            {messages.length > 0 && (
              <Card className="p-6 bg-background/50 backdrop-blur-sm border border-border shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Conversation</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {messages.length} messages
                    </Badge>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearMessages}
                            disabled={messages.length === 0}
                            className="text-muted-foreground hover:text-red-600 hover:border-red-200"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Clear conversation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <ScrollArea className="h-48 sm:h-64 border rounded-lg p-4">{/* ... keep existing code */}
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <MessageBubble key={index} message={message} />
                    ))}

                    {/* Current Transcript */}
                    {currentTranscript && (
                      <Card className="p-4 bg-accent/20 border-dashed border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Mic className="w-4 h-4 text-brand-blue" />
                          <span className="text-sm font-medium text-foreground">Listening...</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{currentTranscript}</p>
                      </Card>
                    )}
                  </div>
                </ScrollArea>
              </Card>
            )}

            {/* Text Input Area */}
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-accent/20 to-accent/10 border border-border shadow-lg">
              <div className="flex flex-col sm:flex-row items-end gap-3">{/* ... keep existing code */}
                <Textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type a message or use voice..."
                  className="flex-1 resize-none"
                  rows={2}
                  disabled={!isConnected}
                />
                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                  <TooltipProvider>{/* ... keep existing code */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground hover:bg-accent"
                          onClick={() => setTextInput('')}
                          disabled={!textInput.trim()}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clear text</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    onClick={handleSendText}
                    disabled={!textInput.trim() || !isConnected}
                    className="bg-gradient-to-r from-brand-blue to-purple-600 hover:from-brand-blue/90 hover:to-purple-600/90 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Enhanced Control Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Connect/Disconnect Button */}
              <Card 
                className={cn(
                  "p-4 sm:p-6 cursor-pointer transition-all duration-200 border-2 hover:border-brand-blue/20 hover:shadow-lg w-full sm:w-auto min-w-[200px]",
                  isConnected && "border-green-500/20 bg-green-500/5"
                )}
                onClick={isConnected ? handleDisconnect : handleConnect}
                onMouseEnter={() => setHoveredButton("connect")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-3 rounded-lg transition-all duration-200 flex-shrink-0",
                    isConnected 
                      ? "bg-red-500 text-white" 
                      : "bg-gradient-to-br from-green-500 to-green-600 text-white"
                  )}>
                    {isConnected ? <PhoneOff className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">
                      {isConnected ? "Disconnect" : "Connect"}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {isConnected ? "End voice session" : "Start voice session"}
                    </p>
                  </div>
                  <ArrowRight className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0",
                    hoveredButton === "connect" && "translate-x-1"
                  )} />
                </div>
              </Card>

              {/* Record Button */}
              <Card 
                className={cn(
                  "p-4 sm:p-6 cursor-pointer transition-all duration-200 border-2 hover:border-brand-blue/20 hover:shadow-lg w-full sm:w-auto min-w-[200px]",
                  isRecording && "border-red-500/20 bg-red-500/5",
                  !isConnected && "opacity-50 cursor-not-allowed"
                )}
                onClick={isRecording ? stopRecording : startRecording}
                onMouseEnter={() => setHoveredButton("record")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-3 rounded-lg transition-all duration-200 flex-shrink-0",
                    isRecording 
                      ? "bg-red-500 text-white animate-pulse" 
                      : "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                  )}>
                    {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {isRecording ? "Stop voice input" : "Begin voice input"}
                    </p>
                  </div>
                  <ArrowRight className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0",
                    hoveredButton === "record" && "translate-x-1"
                  )} />
                </div>
              </Card>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <Card className="p-6 bg-accent/10 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Voice Settings</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(false)}
                  >
                    Close
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-foreground">Model</p>
                    <p className="text-muted-foreground">{modelConfig.name}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Provider</p>
                    <p className="text-muted-foreground">{getProviderName()}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Status</p>
                    <p className="text-muted-foreground">{isConnected ? "Connected" : "Disconnected"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Messages</p>
                    <p className="text-muted-foreground">{messages.length}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        }
      />
    </BaseLayout>
  );
};

const MessageBubble = ({ message }: { message: VoiceChatMessage }) => {
  const isUser = message.type === 'user';
  const isAssistant = message.type === 'assistant';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-xl border transition-all duration-200 hover:shadow-sm",
      isUser 
        ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50" 
        : "bg-accent/30 dark:bg-accent/20 border-border/50"
    )}>
      <div className="flex-shrink-0">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shadow-sm",
          isUser 
            ? "bg-gradient-to-br from-blue-500 to-blue-600" 
            : "bg-gradient-to-br from-brand-blue to-purple-600"
        )}>
          {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {isUser ? "You" : "AI Assistant"}
            </span>
            <Badge variant="secondary" className="text-xs">
              {isUser ? "Voice" : "AI"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};