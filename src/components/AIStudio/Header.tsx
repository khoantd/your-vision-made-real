import { Button } from "@/components/ui/button";
import { Settings, User } from "lucide-react";
import { HEADER_LINKS } from "@/constants/navigation";

export const Header = () => {
  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-medium text-foreground">Google AI Studio</h1>
      </div>
      
      <div className="flex items-center gap-2">
        {HEADER_LINKS.map((link) => (
          <Button 
            key={link.label}
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground"
            asChild
          >
            <a href={link.href}>{link.label}</a>
          </Button>
        ))}
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