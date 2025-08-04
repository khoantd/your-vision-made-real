import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, MicOff, Volume2, VolumeX, Loader2, MessageSquare, Zap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AudioRecorder, encodeAudioForAPI, playAudioData, clearAudioQueue } from "@/utils/RealtimeAudio";
import { TalkSetup } from "./TalkSetup";
import { cn } from "@/lib/utils";

interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface TalkAreaProps {
  className?: string;
}

export const TalkArea = ({ className }: TalkAreaProps) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  
  const { toast } = useToast();
  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentTranscriptRef = useRef<string>('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeAudioContext = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
    }
  };

  const connectToChat = async () => {
    try {
      setConnectionStatus('connecting');
      await initializeAudioContext();

      const projectId = "18139064-60af-46d8-a8d4-4da006bc39cf";
      const wsUrl = `wss://${projectId}.functions.supabase.co/functions/v1/realtime-chat`;
      
      console.log("Connecting to WebSocket:", wsUrl);
      
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setConnectionStatus('connected');
        toast({
          title: "Connected",
          description: "Voice chat is ready",
        });
      };

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log("Received message:", data.type);

        switch (data.type) {
          case 'session.created':
            console.log("Session created");
            break;
            
          case 'session.updated':
            console.log("Session updated");
            break;

          case 'input_audio_buffer.speech_started':
            console.log("Speech started");
            setIsRecording(true);
            break;

          case 'input_audio_buffer.speech_stopped':
            console.log("Speech stopped");
            setIsRecording(false);
            break;

          case 'conversation.item.input_audio_transcription.completed':
            if (data.transcript) {
              console.log("User transcript:", data.transcript);
              setMessages(prev => [...prev, {
                type: 'user',
                content: data.transcript,
                timestamp: new Date()
              }]);
            }
            break;

          case 'response.audio.delta':
            if (isAudioEnabled && audioContextRef.current) {
              try {
                const binaryString = atob(data.delta);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
                await playAudioData(audioContextRef.current, bytes);
                setIsSpeaking(true);
              } catch (error) {
                console.error("Error playing audio:", error);
              }
            }
            break;

          case 'response.audio_transcript.delta':
            if (data.delta) {
              currentTranscriptRef.current += data.delta;
            }
            break;

          case 'response.audio_transcript.done':
            if (currentTranscriptRef.current) {
              console.log("Assistant transcript:", currentTranscriptRef.current);
              setMessages(prev => [...prev, {
                type: 'assistant',
                content: currentTranscriptRef.current,
                timestamp: new Date()
              }]);
              currentTranscriptRef.current = '';
            }
            break;

          case 'response.audio.done':
            console.log("Audio response done");
            setIsSpeaking(false);
            break;

          case 'error':
            console.error("Server error:", data.error);
            toast({
              title: "Error",
              description: data.error,
              variant: "destructive",
            });
            break;
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus('disconnected');
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice chat",
          variant: "destructive",
        });
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket closed");
        setIsConnected(false);
        setConnectionStatus('disconnected');
        setIsRecording(false);
        setIsSpeaking(false);
      };

    } catch (error) {
      console.error("Error connecting:", error);
      setConnectionStatus('disconnected');
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect",
        variant: "destructive",
      });
    }
  };

  const disconnectFromChat = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    clearAudioQueue();
    setIsConnected(false);
    setIsRecording(false);
    setIsSpeaking(false);
    setConnectionStatus('disconnected');
    
    toast({
      title: "Disconnected",
      description: "Voice chat ended",
    });
  };

  const startRecording = async () => {
    if (!wsRef.current || !audioContextRef.current) return;

    try {
      recorderRef.current = new AudioRecorder((audioData) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const encodedAudio = encodeAudioForAPI(audioData);
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodedAudio
          }));
        }
      });

      await recorderRef.current.start();
      console.log("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Microphone Error",
        description: "Unable to access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
      console.log("Recording stopped");
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    if (!isAudioEnabled) {
      clearAudioQueue();
      setIsSpeaking(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    currentTranscriptRef.current = '';
  };

  useEffect(() => {
    if (isConnected && !recorderRef.current) {
      startRecording();
    }
  }, [isConnected]);

  useEffect(() => {
    return () => {
      disconnectFromChat();
    };
  }, []);

  // Show setup screen if no API key
  if (!apiKey) {
    return (
      <div className={cn("h-full", className)}>
        <TalkSetup onApiKeySet={setApiKey} />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-brand-blue to-purple-600 rounded-lg">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Voice Chat</h2>
            <div className="flex items-center gap-2">
              <Badge 
                variant={connectionStatus === 'connected' ? 'default' : 'secondary'}
                className={cn(
                  connectionStatus === 'connected' && "bg-green-500 hover:bg-green-600",
                  connectionStatus === 'connecting' && "bg-yellow-500 hover:bg-yellow-600"
                )}
              >
                {connectionStatus === 'connected' && "Connected"}
                {connectionStatus === 'connecting' && "Connecting..."}
                {connectionStatus === 'disconnected' && "Disconnected"}
              </Badge>
              {isRecording && (
                <Badge variant="outline" className="text-red-500 border-red-500">
                  <Mic className="w-3 h-3 mr-1" />
                  Recording
                </Badge>
              )}
              {isSpeaking && (
                <Badge variant="outline" className="text-blue-500 border-blue-500">
                  <Volume2 className="w-3 h-3 mr-1" />
                  Speaking
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAudio}
            className={cn(
              "transition-colors",
              !isAudioEnabled && "text-muted-foreground"
            )}
          >
            {isAudioEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
            disabled={messages.length === 0}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-accent/50 rounded-lg inline-block mb-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Start a Voice Conversation</h3>
              <p className="text-muted-foreground mb-6">
                Connect to begin talking with the AI. Your conversation will appear here.
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 justify-center">
                  <Zap className="w-4 h-4 text-brand-blue" />
                  <span>Natural voice conversations with real-time responses</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Mic className="w-4 h-4 text-brand-blue" />
                  <span>Automatic speech detection - no need to press buttons</span>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <Card key={index} className={cn(
                "p-4",
                message.type === 'user' ? "ml-12 bg-brand-blue/5 border-brand-blue/20" : "mr-12"
              )}>
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg flex-shrink-0",
                    message.type === 'user' 
                      ? "bg-brand-blue text-white" 
                      : "bg-accent text-foreground"
                  )}>
                    {message.type === 'user' ? (
                      <Mic className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {message.type === 'user' ? 'You' : 'Assistant'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Connection Controls */}
      <div className="p-4 border-t border-border">
        <div className="flex justify-center">
          {!isConnected ? (
            <Button 
              onClick={connectToChat}
              disabled={connectionStatus === 'connecting'}
              className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8"
            >
              {connectionStatus === 'connecting' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start Voice Chat
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={disconnectFromChat}
              variant="outline"
              className="px-8"
            >
              <MicOff className="w-4 h-4 mr-2" />
              End Chat
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};