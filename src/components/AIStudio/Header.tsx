import { Button } from "@/components/ui/button";
import { Settings, User, Menu } from "lucide-react";
import { HEADER_LINKS } from "@/constants/navigation";

interface HeaderProps {
  sidebarVisible?: boolean;
  setSidebarVisible?: (visible: boolean) => void;
}

export const Header = ({ sidebarVisible, setSidebarVisible }: HeaderProps) => {
  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        {setSidebarVisible && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarVisible(!sidebarVisible)}
            className="text-muted-foreground"
          >
            <Menu className="w-4 h-4" />
          </Button>
        )}
        <h1 className="text-lg sm:text-xl font-medium text-foreground">Google AI Studio</h1>
      </div>
      
      <div className="hidden sm:flex items-center gap-2">
        {HEADER_LINKS.map((link) => (
          <Button 
            key={link.label}
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hidden md:inline-flex"
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