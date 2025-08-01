import { Button } from "@/components/ui/button";
import { Settings, HelpCircle, User } from "lucide-react";

export const Header = () => {
  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-medium text-foreground">Google AI Studio</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Get API key
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Studio
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Dashboard
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Documentation
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Settings className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <User className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};