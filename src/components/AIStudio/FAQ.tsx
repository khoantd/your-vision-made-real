import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { HelpCircle, ChevronDown, Key, MessageSquare, Settings, Zap, Shield, Code2 } from "lucide-react";
import { useState } from "react";

interface FAQProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FAQ = ({ open, onOpenChange }: FAQProps) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Getting Started",
      badge: "Basics",
      items: [
        {
          question: "What is AI Studio?",
          answer: "AI Studio is a comprehensive platform for interacting with multiple AI providers including Google AI and OpenAI. You can chat with AI models, generate media, stream responses, and build custom workflows."
        },
        {
          question: "Which AI providers are supported?",
          answer: "Currently, AI Studio supports Google AI (Gemini models) and OpenAI (GPT models). You can switch between providers and models in the settings panel."
        },
        {
          question: "How do I get started?",
          answer: "Simply select your preferred AI provider in the settings, enter your API key, choose a model, and start chatting. You can access different features like chat, streaming, media generation, and build tools from the sidebar."
        }
      ]
    },
    {
      icon: <Key className="w-5 h-5" />,
      title: "API Keys & Authentication",
      badge: "Setup",
      items: [
        {
          question: "How do I get an API key?",
          answer: "For Google AI: Visit ai.google.dev and create an account. For OpenAI: Go to platform.openai.com and sign up. Both platforms provide API keys in their developer dashboards."
        },
        {
          question: "Are my API keys secure?",
          answer: "Yes, API keys are stored locally in your browser and are never sent to our servers. They are only used to communicate directly with the AI provider's APIs."
        },
        {
          question: "Can I test my API key?",
          answer: "Yes, use the 'Test API Key' button in the chat area or settings panel to verify your key is working correctly."
        },
        {
          question: "Why is my API key not working?",
          answer: "Check that: 1) The key is correctly entered, 2) Your account has sufficient credits/quota, 3) The selected model is available in your region, 4) The API key has the necessary permissions."
        }
      ]
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Settings & Configuration",
      badge: "Advanced",
      items: [
        {
          question: "What do the temperature settings do?",
          answer: "Temperature controls randomness: 0.0-0.3 for factual/consistent responses, 0.4-0.7 for balanced creativity, 0.8-1.0 for highly creative/varied outputs."
        },
        {
          question: "What is structured output?",
          answer: "Structured output forces the AI to respond in specific formats like JSON, ensuring consistent, parseable responses for applications and automation."
        },
        {
          question: "How do function calls work?",
          answer: "Function calling allows the AI to use predefined tools and APIs. Define functions in the settings, and the AI will automatically call them when needed to complete tasks."
        },
        {
          question: "What are the different max tokens settings?",
          answer: "Max tokens limit response length: 1000 for short answers, 2000 for medium responses, 4000+ for long-form content. Higher limits use more API credits."
        }
      ]
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Features & Usage",
      badge: "Features",
      items: [
        {
          question: "What's the difference between Chat and Stream?",
          answer: "Chat shows complete responses at once, while Stream displays responses as they're generated in real-time, giving you immediate feedback."
        },
        {
          question: "How does media generation work?",
          answer: "Use the Generate Media section to create images with models like Imagen 3 or videos with Veo 2. Simply describe what you want and the AI will generate it."
        },
        {
          question: "What is the Build feature?",
          answer: "Build allows you to create complex, multi-step workflows and applications using AI. You can chain multiple operations and create custom tools."
        },
        {
          question: "How do I view my conversation history?",
          answer: "Access the History section from the sidebar to view, search, and resume previous conversations across all features."
        }
      ]
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Privacy & Security",
      badge: "Important",
      items: [
        {
          question: "Is my data private?",
          answer: "Your conversations and data are processed according to the privacy policies of the AI provider you're using (Google AI or OpenAI). We don't store your conversations on our servers."
        },
        {
          question: "Where are my settings stored?",
          answer: "All settings, including API keys and preferences, are stored locally in your browser. They are not uploaded to any external servers."
        },
        {
          question: "Can I delete my data?",
          answer: "Since data is stored locally, you can clear it by clearing your browser data or using the reset options in settings. For AI provider data, refer to their respective privacy policies."
        }
      ]
    },
    {
      icon: <Code2 className="w-5 h-5" />,
      title: "Troubleshooting",
      badge: "Support",
      items: [
        {
          question: "The AI isn't responding. What should I do?",
          answer: "Check: 1) Internet connection, 2) API key validity, 3) Account quota/credits, 4) Model availability. Try testing your API key or switching models."
        },
        {
          question: "I'm getting rate limit errors.",
          answer: "You're hitting API rate limits. Wait a few minutes or upgrade your API plan with your provider for higher limits."
        },
        {
          question: "Models are not loading properly.",
          answer: "Refresh the page, check your internet connection, and verify your API key. Some models may not be available in all regions."
        },
        {
          question: "How do I report a bug or request a feature?",
          answer: "Use the feedback option in the help menu or contact support through the official channels. Include details about your browser, steps to reproduce, and any error messages."
        }
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-brand-blue to-purple-600 rounded-lg">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold">Frequently Asked Questions</DialogTitle>
          </div>
          <p className="text-muted-foreground mt-2">
            Find answers to common questions about AI Studio features, setup, and troubleshooting.
          </p>
        </DialogHeader>

        <ScrollArea className="px-6 pb-6 max-h-[70vh]">
          <div className="space-y-6">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="border border-border rounded-lg bg-card">
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-brand-blue">{category.icon}</div>
                    <h3 className="text-lg font-semibold">{category.title}</h3>
                    <Badge variant="secondary">{category.badge}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {category.items.map((item, itemIndex) => {
                      const globalIndex = categoryIndex * 100 + itemIndex;
                      const isOpen = openItems.includes(globalIndex);
                      
                      return (
                        <Collapsible
                          key={itemIndex}
                          open={isOpen}
                          onOpenChange={() => toggleItem(globalIndex)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-between text-left h-auto p-4 hover:bg-accent/50"
                            >
                              <span className="font-medium">{item.question}</span>
                              <ChevronDown 
                                className={`w-4 h-4 transition-transform ${
                                  isOpen ? 'rotate-180' : ''
                                }`} 
                              />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-4 pb-4">
                            <div className="pt-2 border-t border-border/50">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            <Separator />

            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold mb-4">Still Need Help?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-accent/30 rounded-lg">
                  <h4 className="font-medium mb-2">Documentation</h4>
                  <p className="text-sm text-muted-foreground">
                    Check out our comprehensive guides and API documentation for detailed information.
                  </p>
                </div>
                <div className="p-4 bg-accent/30 rounded-lg">
                  <h4 className="font-medium mb-2">Community Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Join our community forums to get help from other users and share your experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};