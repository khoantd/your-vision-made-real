import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, Dispatch, SetStateAction } from "react";
import { ViewType } from "@/types";
import { NAVIGATION_ITEMS, FOOTER_TEXT } from "@/constants/navigation";

interface SidebarProps {
  activeView: ViewType;
  setActiveView: Dispatch<SetStateAction<ViewType>>;
}

export const Sidebar = ({ activeView, setActiveView }: SidebarProps) => {
  const [historyExpanded, setHistoryExpanded] = useState(false);

  return (
    <div className="w-64 bg-sidebar-bg border-r border-border h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-medium text-sidebar-text">Google AI Studio</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {NAVIGATION_ITEMS.map((item) => (
            <div key={item.label}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-10 px-3 text-sidebar-text hover:bg-sidebar-hover",
                  (item.view === activeView) && "bg-brand-blue text-white hover:bg-brand-blue/90"
                )}
                onClick={() => {
                  if (item.hasDropdown) {
                    setHistoryExpanded(!historyExpanded);
                  } else if (item.view) {
                    setActiveView(item.view);
                  }
                }}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.hasDropdown && (
                  <ChevronDown 
                    className={cn(
                      "w-4 h-4 ml-auto transition-transform",
                      historyExpanded && "rotate-180"
                    )} 
                  />
                )}
              </Button>
              {item.hasDropdown && historyExpanded && (
                <div className="ml-7 mt-1 space-y-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm text-sidebar-text-muted hover:bg-sidebar-hover h-8"
                  >
                    Recent conversations
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm text-sidebar-text-muted hover:bg-sidebar-hover h-8"
                  >
                    Saved prompts
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-sidebar-text-muted">
          {FOOTER_TEXT}
        </p>
      </div>
    </div>
  );
};