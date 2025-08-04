import { ChevronDown, Sparkles, MessageSquare, Video, Image, Code, History, Plus, Star, Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, Dispatch, SetStateAction } from "react";
import { ViewType } from "@/types";
import { NAVIGATION_ITEMS, FOOTER_TEXT } from "@/constants/navigation";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAIStudio } from "@/contexts/AIStudioContext";

interface SidebarProps {
  activeView: ViewType;
  setActiveView: Dispatch<SetStateAction<ViewType>>;
}

export const Sidebar = ({ activeView, setActiveView }: SidebarProps) => {
  const { modelConfig } = useAIStudio();
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const getProviderIcon = () => {
    return modelConfig.provider === "openai" ? <Sparkles className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />;
  };

  const getProviderName = () => {
    return modelConfig.provider === "openai" ? "OpenAI" : "Google";
  };

  const getViewIcon = (view: ViewType) => {
    switch (view) {
      case "chat":
        return <MessageSquare className="w-4 h-4" />;
      case "stream":
        return <Video className="w-4 h-4" />;
      case "generate-media":
        return <Image className="w-4 h-4" />;
      case "build":
        return <Code className="w-4 h-4" />;
      case "history":
        return <History className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getViewDescription = (view: ViewType) => {
    switch (view) {
      case "chat":
        return "Text conversations with AI";
      case "stream":
        return "Real-time audio & video";
      case "generate-media":
        return "Create images & videos";
      case "build":
        return "Code generation & tools";
      case "history":
        return "Past conversations & saves";
      default:
        return "";
    }
  };

  return (
    <div className="w-64 bg-sidebar-bg border-r border-border h-screen flex flex-col">
      {/* Enhanced Header */}
      <div className="p-4 border-b border-border bg-gradient-to-br from-sidebar-bg to-accent/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-brand-blue to-purple-600 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-brand-blue to-purple-600 bg-clip-text text-transparent">
              AI Studio
            </h1>
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="text-xs">
                {getProviderIcon()} {getProviderName()}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Model: {modelConfig.name}</span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Online
          </span>
        </div>
      </div>

      {/* Enhanced Navigation */}
      <nav className="flex-1 p-3">
        <div className="space-y-2">
          {NAVIGATION_ITEMS.map((item) => (
            <div key={item.label}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 h-12 px-3 text-sidebar-text hover:bg-sidebar-hover transition-all duration-200 group relative",
                        (item.view === activeView) && "bg-gradient-to-r from-brand-blue to-purple-600 text-white hover:from-brand-blue/90 hover:to-purple-600/90 shadow-lg"
                      )}
                      onClick={() => {
                        if (item.hasDropdown) {
                          setHistoryExpanded(!historyExpanded);
                        } else if (item.view) {
                          setActiveView(item.view);
                        }
                      }}
                      onMouseEnter={() => setHoveredItem(item.label)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={cn(
                          "p-1.5 rounded-md transition-all duration-200",
                          (item.view === activeView) 
                            ? "bg-white/20" 
                            : "group-hover:bg-accent/50"
                        )}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{item.label}</div>
                          {item.view && (
                            <div className="text-xs opacity-70 mt-0.5">
                              {getViewDescription(item.view)}
                            </div>
                          )}
                        </div>
                        {item.hasDropdown && (
                          <ChevronDown 
                            className={cn(
                              "w-4 h-4 transition-transform duration-200",
                              historyExpanded && "rotate-180"
                            )} 
                          />
                        )}
                      </div>
                      
                      {/* Active indicator */}
                      {item.view === activeView && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <div className="text-center">
                      <p className="font-medium">{item.label}</p>
                      {item.view && (
                        <p className="text-xs text-muted-foreground">{getViewDescription(item.view)}</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Enhanced Dropdown */}
              {item.hasDropdown && historyExpanded && (
                <div className="ml-4 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm text-sidebar-text-muted hover:bg-sidebar-hover h-10 gap-2"
                  >
                    <Clock className="w-3 h-3" />
                    Recent conversations
                    <Badge variant="secondary" className="ml-auto text-xs">3</Badge>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm text-sidebar-text-muted hover:bg-sidebar-hover h-10 gap-2"
                  >
                    <Star className="w-3 h-3" />
                    Saved prompts
                    <Badge variant="secondary" className="ml-auto text-xs">12</Badge>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm text-sidebar-text-muted hover:bg-sidebar-hover h-10 gap-2"
                  >
                    <Settings className="w-3 h-3" />
                    Settings
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-border">
          <h3 className="text-xs font-medium text-sidebar-text-muted mb-3 px-2">Quick Actions</h3>
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full justify-start gap-2 h-9 text-sm text-sidebar-text-muted hover:bg-sidebar-hover hover:text-brand-blue transition-colors"
              onClick={() => {
                // Reset to chat view and trigger new chat
                setActiveView("chat");
                // Dispatch custom event for new chat
                window.dispatchEvent(new CustomEvent('newChat'));
              }}
            >
              <Plus className="w-3 h-3" />
              New Chat
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full justify-start gap-2 h-9 text-sm text-sidebar-text-muted hover:bg-sidebar-hover"
            >
              <Image className="w-3 h-3" />
              Generate Image
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full justify-start gap-2 h-9 text-sm text-sidebar-text-muted hover:bg-sidebar-hover"
            >
              <Code className="w-3 h-3" />
              Code Assistant
            </Button>
          </div>
        </div>
      </nav>

      {/* Enhanced Footer */}
      <div className="p-4 border-t border-border bg-gradient-to-t from-sidebar-bg to-accent/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-sidebar-text-muted">Connected</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {getProviderName()}
          </Badge>
        </div>
        <p className="text-xs text-sidebar-text-muted leading-relaxed">
          {FOOTER_TEXT}
        </p>
      </div>
    </div>
  );
};