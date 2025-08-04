import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-openai-key',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  console.log("Setting up WebSocket relay to OpenAI Realtime API");

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  let openAISocket: WebSocket | null = null;
  let sessionEstablished = false;
  let apiKeyReceived = false;

  socket.onopen = () => {
    console.log("Client WebSocket connected, waiting for authentication");
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log("Received from client:", message.type);
      
      // Handle API key authentication
      if (message.type === 'auth' && !apiKeyReceived) {
        const clientApiKey = message.apiKey;
        if (!clientApiKey) {
          socket.send(JSON.stringify({
            type: "error",
            message: "API key required"
          }));
          return;
        }
        
        apiKeyReceived = true;
        console.log("API key received, connecting to OpenAI");
        
        // Connect to OpenAI Realtime API
        const openAIUrl = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01`;
        openAISocket = new WebSocket(openAIUrl, [], {
          headers: {
            "Authorization": `Bearer ${clientApiKey}`,
            "OpenAI-Beta": "realtime=v1"
          }
        });

        openAISocket.onopen = () => {
          console.log("Connected to OpenAI Realtime API");
          socket.send(JSON.stringify({
            type: "connected",
            message: "OpenAI Realtime API connected"
          }));
        };

        openAISocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("Received from OpenAI:", data.type);

            // Send session update after receiving session.created
            if (data.type === 'session.created' && !sessionEstablished) {
              sessionEstablished = true;
              console.log("Sending session update");
              
              const sessionUpdate = {
                type: "session.update",
                session: {
                  modalities: ["text", "audio"],
                  instructions: "You are a helpful AI assistant. Be conversational and natural in your responses. Keep responses concise but engaging.",
                  voice: "alloy",
                  input_audio_format: "pcm16",
                  output_audio_format: "pcm16",
                  input_audio_transcription: {
                    model: "whisper-1"
                  },
                  turn_detection: {
                    type: "server_vad",
                    threshold: 0.5,
                    prefix_padding_ms: 300,
                    silence_duration_ms: 1000
                  },
                  temperature: 0.8,
                  max_response_output_tokens: "inf"
                }
              };
              
              openAISocket?.send(JSON.stringify(sessionUpdate));
            }

            // Forward all messages to client
            socket.send(event.data);
          } catch (error) {
            console.error("Error processing OpenAI message:", error);
          }
        };

        openAISocket.onerror = (error) => {
          console.error("OpenAI WebSocket error:", error);
          socket.send(JSON.stringify({
            type: "error",
            message: "OpenAI connection error"
          }));
        };

        openAISocket.onclose = () => {
          console.log("OpenAI WebSocket closed");
          socket.close();
        };
        
        return;
      }
      
      // Forward other messages to OpenAI (after authentication)
      if (openAISocket && openAISocket.readyState === WebSocket.OPEN && apiKeyReceived) {
        openAISocket.send(event.data);
      } else if (!apiKeyReceived) {
        socket.send(JSON.stringify({
          type: "error",
          message: "Not authenticated. Send auth message first."
        }));
      } else {
        socket.send(JSON.stringify({
          type: "error",
          message: "OpenAI connection not ready"
        }));
      }
    } catch (error) {
      console.error("Error processing client message:", error);
      socket.send(JSON.stringify({
        type: "error",
        message: "Message processing error"
      }));
    }
  };

  socket.onclose = () => {
    console.log("Client WebSocket disconnected");
    if (openAISocket) {
      openAISocket.close();
    }
  };

  socket.onerror = (error) => {
    console.error("Client WebSocket error:", error);
    if (openAISocket) {
      openAISocket.close();
    }
  };

  return response;
});