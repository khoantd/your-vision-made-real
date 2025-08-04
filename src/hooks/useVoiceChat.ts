import { useState, useCallback, useRef, useEffect } from 'react';
import { AudioRecorder, encodeAudioForAPI, playAudioData, clearAudioQueue } from '@/utils/AudioUtils';
import { useToast } from '@/hooks/use-toast';

export interface VoiceChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isAudio: boolean;
}

interface UseVoiceChatProps {
  apiKey: string;
}

export const useVoiceChat = ({ apiKey }: UseVoiceChatProps) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<VoiceChatMessage[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentMessageRef = useRef<string>('');

  // Initialize audio context
  const initializeAudio = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    }
    
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  }, []);

  // Start voice chat connection
  const connect = useCallback(async () => {
    if (!apiKey) {
      toast({
        title: "Error",
        description: "OpenAI API key is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await initializeAudio();
      console.log("Connecting to voice chat...");

      // Connect to our edge function WebSocket
      const wsUrl = `wss://cjuqaehsjhfjnzzcwgli.functions.supabase.co/realtime-chat`;
      wsRef.current = new WebSocket(wsUrl);
      
      // Send API key in first message after connection
      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        // Send API key as custom header through message
        wsRef.current?.send(JSON.stringify({
          type: 'auth',
          apiKey: apiKey
        }));
        setIsConnected(true);
        toast({
          title: "Connected",
          description: "Voice chat is ready",
        });
      };

      wsRef.current.onmessage = async (event) => {
        try {
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
              console.log("User started speaking");
              setIsRecording(true);
              break;

            case 'input_audio_buffer.speech_stopped':
              console.log("User stopped speaking");
              setIsRecording(false);
              break;

            case 'conversation.item.input_audio_transcription.completed':
              console.log("User transcript:", data.transcript);
              setCurrentTranscript(data.transcript);
              
              // Add user message
              const userMessage: VoiceChatMessage = {
                id: Date.now().toString(),
                type: 'user',
                content: data.transcript,
                timestamp: new Date(),
                isAudio: true
              };
              setMessages(prev => [...prev, userMessage]);
              break;

            case 'response.audio.delta':
              // Play audio chunk
              if (data.delta && audioContextRef.current) {
                try {
                  const binaryString = atob(data.delta);
                  const bytes = new Uint8Array(binaryString.length);
                  for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                  }
                  await playAudioData(audioContextRef.current, bytes);
                  setIsSpeaking(true);
                } catch (error) {
                  console.error('Error playing audio:', error);
                }
              }
              break;

            case 'response.audio_transcript.delta':
              // Accumulate transcript
              if (data.delta) {
                currentMessageRef.current += data.delta;
              }
              break;

            case 'response.audio.done':
              console.log("Response audio completed");
              setIsSpeaking(false);
              break;

            case 'response.audio_transcript.done':
              // Add complete assistant message
              if (currentMessageRef.current.trim()) {
                const assistantMessage: VoiceChatMessage = {
                  id: Date.now().toString(),
                  type: 'assistant',
                  content: currentMessageRef.current.trim(),
                  timestamp: new Date(),
                  isAudio: true
                };
                setMessages(prev => [...prev, assistantMessage]);
                currentMessageRef.current = '';
              }
              break;

            case 'error':
              console.error("WebSocket error:", data);
              toast({
                title: "Error",
                description: data.message || "Connection error",
                variant: "destructive",
              });
              break;

            default:
              console.log("Unhandled message type:", data.type);
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice chat",
          variant: "destructive",
        });
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        setIsRecording(false);
        setIsSpeaking(false);
        disconnect();
      };

    } catch (error) {
      console.error("Failed to connect:", error);
      toast({
        title: "Error",
        description: "Failed to initialize voice chat",
        variant: "destructive",
      });
    }
  }, [apiKey, toast, initializeAudio]);

  // Start recording audio
  const startRecording = useCallback(async () => {
    if (!wsRef.current || !audioContextRef.current) {
      console.warn("WebSocket or audio context not ready");
      return;
    }

    try {
      audioRecorderRef.current = new AudioRecorder((audioData) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const encodedAudio = encodeAudioForAPI(audioData);
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodedAudio
          }));

          // Calculate audio level for visualization
          const rms = Math.sqrt(audioData.reduce((sum, val) => sum + val * val, 0) / audioData.length);
          setAudioLevel(Math.min(rms * 10, 1)); // Scale and clamp
        }
      });

      await audioRecorderRef.current.start();
      console.log("Audio recording started");
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast({
        title: "Microphone Error",
        description: "Failed to access microphone",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Stop recording audio
  const stopRecording = useCallback(() => {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
      audioRecorderRef.current = null;
      setAudioLevel(0);
      console.log("Audio recording stopped");
    }
  }, []);

  // Send text message
  const sendTextMessage = useCallback((text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      toast({
        title: "Error",
        description: "Not connected to voice chat",
        variant: "destructive",
      });
      return;
    }

    // Add user message to UI
    const userMessage: VoiceChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
      isAudio: false
    };
    setMessages(prev => [...prev, userMessage]);

    // Send to OpenAI
    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: text
          }
        ]
      }
    };

    wsRef.current.send(JSON.stringify(event));
    wsRef.current.send(JSON.stringify({ type: 'response.create' }));
  }, [toast]);

  // Disconnect from voice chat
  const disconnect = useCallback(() => {
    console.log("Disconnecting voice chat...");
    
    stopRecording();
    clearAudioQueue();
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setIsConnected(false);
    setIsRecording(false);
    setIsSpeaking(false);
    setAudioLevel(0);
    currentMessageRef.current = '';
  }, [stopRecording]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentTranscript('');
    currentMessageRef.current = '';
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
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
  };
};