import { Button } from "@/components/ui/button";
import { Settings, User, Menu, Sparkles, Bot, Bell, Search, HelpCircle, LogOut } from "lucide-react";
import { HEADER_LINKS } from "@/constants/navigation";
import { useAIStudio } from "@/contexts/AIStudioContext";
import { useAuth } from "@/hooks/useAuth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PromptingGuide } from "./PromptingGuide";

interface HeaderProps {
  sidebarVisible?: boolean;
  setSidebarVisible?: (visible: boolean) => void;
}

export const Header = ({ sidebarVisible, setSidebarVisible }: HeaderProps) => {
  const { modelConfig } = useAIStudio();
  const { signOut, user } = useAuth();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [promptingGuideOpen, setPromptingGuideOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const getProviderIcon = () => {
    return modelConfig.provider === "openai" ? <Sparkles className="w-4 h-4" /> : <Bot className="w-4 h-4" />;
  };

  const getProviderName = () => {
    return modelConfig.provider === "openai" ? "OpenAI" : "Google";
  };

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {setSidebarVisible && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarVisible(!sidebarVisible)}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{sidebarVisible ? "Hide sidebar" : "Show sidebar"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-brand-blue to-purple-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-brand-blue to-purple-600 bg-clip-text text-transparent">
                AI Studio
              </h1>
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="text-xs">
                  {getProviderIcon()} {getProviderName()}
                </Badge>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{modelConfig.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8">
        <div className={cn(
          "relative flex items-center w-full",
          isSearchFocused && "ring-2 ring-brand-blue/20"
        )}>
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations, settings..."
            className="w-full pl-10 pr-4 py-2 bg-accent/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-0 transition-all duration-200"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Header Links */}
        <div className="hidden lg:flex items-center gap-1">
          {HEADER_LINKS.map((link) => (
            <TooltipProvider key={link.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    onClick={() => {
                      if (link.label === "Prompting guide") {
                        setPromptingGuideOpen(true);
                      }
                      // Handle other links here as needed
                    }}
                  >
                    {link.label}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{link.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative">
                  <Bell className="w-4 h-4" />
                  <Badge className="absolute -top-1 -right-1 h-2 w-2 p-0 bg-red-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help & Documentation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <Settings className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <User className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user?.email || 'User Profile'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sign Out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <PromptingGuide 
        open={promptingGuideOpen} 
        onOpenChange={setPromptingGuideOpen} 
      />
    </header>
  );
};