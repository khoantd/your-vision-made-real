import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lightbulb, Target, Zap, Brain, MessageSquare, Code2, FileText, Sparkles } from "lucide-react";

interface PromptingGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PromptingGuide = ({ open, onOpenChange }: PromptingGuideProps) => {
  const sections = [
    {
      icon: <Target className="w-5 h-5" />,
      title: "Be Specific and Clear",
      badge: "Essential",
      content: [
        "Use precise language and avoid ambiguity",
        "Specify the format you want (e.g., bullet points, table, paragraph)",
        "Include context about your use case or industry",
        "Define technical terms if they could be interpreted multiple ways"
      ],
      example: {
        good: "Write a 200-word product description for a wireless noise-canceling headphone targeting commuters, focusing on battery life and comfort.",
        bad: "Write about headphones."
      }
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Provide Context",
      badge: "Important",
      content: [
        "Share relevant background information",
        "Mention your role, audience, or purpose",
        "Include constraints like word count, tone, or style",
        "Reference examples or similar work when helpful"
      ],
      example: {
        good: "I'm a marketing manager creating an email campaign for B2B software sales. Write a subject line that's professional, creates urgency, and mentions our 30% discount.",
        bad: "Write an email subject line."
      }
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Use Action Words",
      badge: "Technique",
      content: [
        "Start with clear action verbs (analyze, summarize, create, explain)",
        "Be direct about what you want the AI to do",
        "Use imperative mood for clearer instructions",
        "Avoid passive voice when giving instructions"
      ],
      example: {
        good: "Analyze the following data and identify three key trends. Present findings in a table format.",
        bad: "I would like some analysis of this data if possible."
      }
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Structure Your Prompts",
      badge: "Framework",
      content: [
        "Use numbered lists or bullet points for complex requests",
        "Separate different parts of your request clearly",
        "Put the most important information first",
        "Use formatting like bold or caps for emphasis"
      ],
      example: {
        good: "Create a social media strategy with:\n1. Target audience analysis\n2. Content themes (5 ideas)\n3. Posting schedule\n4. Success metrics",
        bad: "Help me with social media strategy including audience and content and when to post and how to measure success."
      }
    },
    {
      icon: <Code2 className="w-5 h-5" />,
      title: "Iterate and Refine",
      badge: "Strategy",
      content: [
        "Start with a basic prompt and refine based on results",
        "Ask follow-up questions to improve the output",
        "Specify what to change if the first attempt isn't quite right",
        "Build on previous responses in the conversation"
      ],
      example: {
        good: "That's close, but make it more conversational and add specific examples from the healthcare industry.",
        bad: "This isn't what I wanted. Try again."
      }
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Examples and Templates",
      badge: "Advanced",
      content: [
        "Show examples of the desired output format",
        "Provide templates or patterns to follow",
        "Include both good and bad examples for contrast",
        "Reference styles or voices you want to emulate"
      ],
      example: {
        good: "Write a product review in the style of The Verge, focusing on user experience like this example: [paste example]. Include pros/cons sections.",
        bad: "Write a review that sounds professional."
      }
    }
  ];

  const quickTips = [
    "Use 'temperature' settings: Lower (0.1-0.3) for factual content, higher (0.7-0.9) for creative work",
    "Break complex tasks into smaller, sequential prompts",
    "Use role-playing: 'Act as a [role] and help me with...'",
    "Ask for reasoning: 'Explain your thinking process'",
    "Request alternative approaches: 'Give me 3 different ways to...'",
    "Set constraints: 'In 100 words or less...'",
    "Use the chat history - reference previous responses"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-brand-blue to-purple-600 rounded-lg">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold">Prompting Guide</DialogTitle>
          </div>
          <p className="text-muted-foreground mt-2">
            Master the art of AI prompting with these proven techniques and best practices.
          </p>
        </DialogHeader>

        <ScrollArea className="px-6 pb-6 max-h-[70vh]">
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="border border-border rounded-lg p-6 bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-brand-blue">{section.icon}</div>
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                  <Badge variant="secondary">{section.badge}</Badge>
                </div>
                
                <ul className="space-y-2 mb-4">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 bg-brand-blue rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="bg-accent/50 rounded-lg p-4 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">Good Example</span>
                    </div>
                    <p className="text-sm bg-green-50 dark:bg-green-950/30 p-3 rounded border-l-2 border-green-500">
                      "{section.example.good}"
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-sm font-medium text-red-700 dark:text-red-400">Poor Example</span>
                    </div>
                    <p className="text-sm bg-red-50 dark:bg-red-950/30 p-3 rounded border-l-2 border-red-500">
                      "{section.example.bad}"
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <Separator />

            <div className="border border-border rounded-lg p-6 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-brand-blue">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold">Quick Tips</h3>
                <Badge variant="outline">Pro Tips</Badge>
              </div>
              
              <div className="grid gap-3">
                {quickTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-accent/30 rounded-lg">
                    <span className="text-brand-blue font-bold text-sm mt-0.5">#{index + 1}</span>
                    <p className="text-sm text-muted-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};