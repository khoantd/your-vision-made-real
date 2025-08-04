import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, Phone, PhoneOff, MessageSquare, Volume2, Loader2, User, Bot, Sparkles, Settings, Radio } from 'lucide-react';
import { useVoiceChat, VoiceChatMessage } from '@/hooks/useVoiceChat';
import { useAIStudio } from '@/contexts/AIStudioContext';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const VoiceChat = () => {
  const { apiKeys } = useAIStudio();
  const [textInput, setTextInput] = useState('');
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

  return (
    <div className="flex flex-col h-full bg-chat-bg">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-lg transition-all duration-200",
              isConnected 
                ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg" 
                : "bg-gradient-to-br from-brand-blue to-purple-600 text-white"
            )}>
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-semibold text-foreground">Voice Chat</h1>
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Real-time
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {isConnected ? '🟢 Connected to AI Assistant' : '⚪ Ready to Connect'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
              <Badge variant="outline" className="animate-pulse border-red-300 text-red-600 bg-red-50">
                🎤 Recording
              </Badge>
            )}

            {/* Speaking Status */}
            {isSpeaking && (
              <Badge variant="outline" className="border-blue-300 text-blue-600 bg-blue-50">
                🔊 AI Speaking
              </Badge>
            )}

            {/* Settings Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                    <Settings className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Voice settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Enhanced Audio Level Visualization */}
      {isConnected && (
        <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-accent/10 to-accent/5">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg transition-all duration-200",
              isRecording 
                ? "bg-red-500 text-white shadow-lg" 
                : "bg-muted text-muted-foreground"
            )}>
              <Mic className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Audio Level</span>
                <span>{Math.round(audioLevel * 100)}%</span>
              </div>
              <div className="bg-muted rounded-full h-3 overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-75 relative",
                    isRecording 
                      ? "bg-gradient-to-r from-red-500 to-red-400" 
                      : "bg-gradient-to-r from-brand-blue to-purple-600"
                  )}
                  style={{ width: `${audioLevel * 100}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {isRecording ? "LIVE" : "READY"}
            </Badge>
          </div>
        </div>
      )}

      {/* Enhanced Messages Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gradient-to-br from-brand-blue to-purple-600 rounded-full mx-auto mb-6 w-fit">
                <Radio className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                Voice Conversation Ready
              </h3>
              <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
                {isConnected 
                  ? "Your AI assistant is listening. Start speaking or type a message to begin the conversation."
                  : "Connect to start a natural voice conversation with your AI assistant."
                }
              </p>
              {isConnected && (
                <Card className="p-4 bg-gradient-to-br from-accent/20 to-accent/10 border border-border max-w-sm mx-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">Ready to receive audio input</span>
                  </div>
                </Card>
              )}
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}

          {/* Enhanced Current transcript preview */}
          {currentTranscript && (
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-dashed border-blue-200 p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-medium text-blue-700">
                    🎤 You're speaking...
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-blue-800 bg-white/50 rounded p-2 italic">"{currentTranscript}"</p>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Enhanced Text Input (when connected) */}
      {isConnected && (
        <div className="p-6 border-t border-border bg-gradient-to-br from-background to-accent/20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Type a message</span>
              <Badge variant="secondary" className="text-xs">Optional</Badge>
            </div>
            <div className="flex gap-3">
              <Textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type a message or continue speaking..."
                className="flex-1 min-h-[60px] max-h-[120px] resize-none border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-brand-blue/20 transition-all duration-200"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendText();
                  }
                }}
              />
              <Button 
                onClick={handleSendText} 
                disabled={!textInput.trim()}
                className="bg-gradient-to-r from-brand-blue to-purple-600 hover:from-brand-blue/90 hover:to-purple-600/90 text-white px-6 shadow-lg"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Control Panel */}
      <div className="p-6 border-t border-border bg-gradient-to-r from-accent/10 to-accent/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-4">
            {!isConnected ? (
              <Button
                onClick={handleConnect}
                disabled={!apiKey}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white gap-3 px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Phone className="w-5 h-5" />
                Connect Voice Chat
                <Radio className="w-5 h-5" />
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleDisconnect}
                  variant="destructive"
                  className="gap-2 px-6 shadow-lg"
                >
                  <PhoneOff className="w-4 h-4" />
                  Disconnect
                </Button>
                
                <Button
                  onClick={clearMessages}
                  variant="outline"
                  className="gap-2 px-6 border-border hover:bg-accent/50 transition-colors"
                >
                  Clear Chat
                </Button>
              </div>
            )}
          </div>

          {/* API Key Status */}
          {!apiKey ? (
            <Card className="p-4 bg-orange-50 border-orange-200">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800">API Key Required</p>
                  <p className="text-sm text-orange-700 mt-1">
                    Please configure your OpenAI API key in settings to use voice chat
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>API Key Configured</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>OpenAI Realtime API</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Message bubble component
const MessageBubble = ({ message }: { message: VoiceChatMessage }) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={cn(
      "flex gap-4 group",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Enhanced Avatar */}
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg transition-transform duration-200 group-hover:scale-105",
        isUser 
          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white" 
          : "bg-gradient-to-br from-brand-blue to-purple-600 text-white"
      )}>
        {isUser ? (
          <User className="w-5 h-5" />
        ) : (
          <Bot className="w-5 h-5" />
        )}
      </div>

      {/* Enhanced Message */}
      <div className={cn(
        "max-w-[75%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 group-hover:shadow-md",
        isUser 
          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white" 
          : "bg-white border border-border text-foreground"
      )}>
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            "text-xs font-medium",
            isUser ? "text-blue-100" : "text-muted-foreground"
          )}>
            {isUser ? "You" : "AI Assistant"}
          </span>
          {message.isAudio && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
              isUser ? "bg-blue-400/30" : "bg-purple-100 text-purple-600"
            )}>
              <Volume2 className="w-3 h-3" />
              <span>Voice</span>
            </div>
          )}
          <span className={cn(
            "text-xs",
            isUser ? "text-blue-200" : "text-muted-foreground"
          )}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-sm leading-relaxed">
          {message.content}
        </p>
      </div>
    </div>
  );
};