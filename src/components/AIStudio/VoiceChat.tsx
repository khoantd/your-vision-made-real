import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, Phone, PhoneOff, MessageSquare, Volume2, Loader2, User, Bot } from 'lucide-react';
import { useVoiceChat, VoiceChatMessage } from '@/hooks/useVoiceChat';
import { useAIStudio } from '@/contexts/AIStudioContext';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

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
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg transition-colors",
              isConnected ? "bg-green-500" : "bg-muted"
            )}>
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Voice Chat</h2>
              <p className="text-sm text-muted-foreground">
                {isConnected ? 'Connected to AI' : 'Disconnected'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Connection Status */}
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>

            {/* Recording Status */}
            {isRecording && (
              <Badge variant="outline" className="animate-pulse">
                Recording
              </Badge>
            )}

            {/* Speaking Status */}
            {isSpeaking && (
              <Badge variant="outline" className="bg-blue-50 text-blue-600">
                AI Speaking
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Audio Level Visualization */}
      {isConnected && (
        <div className="px-4 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Mic className={cn(
              "w-4 h-4",
              isRecording ? "text-green-500" : "text-muted-foreground"
            )} />
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-75",
                  isRecording ? "bg-green-500" : "bg-muted-foreground"
                )}
                style={{ width: `${audioLevel * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-8">
              {Math.round(audioLevel * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Volume2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No conversation yet
              </h3>
              <p className="text-muted-foreground">
                {isConnected 
                  ? "Start speaking or type a message to begin"
                  : "Connect to start your voice conversation"
                }
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}

          {/* Current transcript preview */}
          {currentTranscript && (
            <div className="bg-accent/50 rounded-lg p-3 border-2 border-dashed border-accent">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Speaking...
                </span>
              </div>
              <p className="text-sm italic">{currentTranscript}</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Text Input (when connected) */}
      {isConnected && (
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 min-h-[40px] max-h-[120px] resize-none"
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
              size="sm"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <div className="p-4 border-t border-border bg-accent/10">
        <div className="flex items-center justify-center gap-4">
          {!isConnected ? (
            <Button
              onClick={handleConnect}
              disabled={!apiKey}
              className="bg-green-500 hover:bg-green-600 text-white gap-2"
            >
              <Phone className="w-4 h-4" />
              Connect Voice Chat
            </Button>
          ) : (
            <>
              <Button
                onClick={handleDisconnect}
                variant="destructive"
                className="gap-2"
              >
                <PhoneOff className="w-4 h-4" />
                Disconnect
              </Button>
              
              <Button
                onClick={clearMessages}
                variant="outline"
                className="gap-2"
              >
                Clear Chat
              </Button>
            </>
          )}
        </div>

        {!apiKey && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            Please configure your OpenAI API key in settings to use voice chat
          </p>
        )}
      </div>
    </div>
  );
};

// Message bubble component
const MessageBubble = ({ message }: { message: VoiceChatMessage }) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={cn(
      "flex gap-3",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser 
          ? "bg-blue-500 text-white" 
          : "bg-gradient-to-br from-brand-blue to-purple-600 text-white"
      )}>
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>

      {/* Message */}
      <div className={cn(
        "max-w-[70%] rounded-lg p-3",
        isUser 
          ? "bg-blue-500 text-white" 
          : "bg-accent text-accent-foreground"
      )}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium opacity-80">
            {isUser ? "You" : "AI"}
          </span>
          {message.isAudio && (
            <Volume2 className="w-3 h-3 opacity-60" />
          )}
          <span className="text-xs opacity-60">
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