import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ViewType } from "@/types";
import { Bot, Wrench, Image, Building, History } from "lucide-react";

interface PageToggleProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export const PageToggle = ({ activeView, setActiveView }: PageToggleProps) => {
  const pages = [
    { id: "chat" as ViewType, label: "Chat", icon: Bot },
    { id: "stream" as ViewType, label: "Stream", icon: Wrench },
    { id: "generate-media" as ViewType, label: "Media", icon: Image },
    { id: "build" as ViewType, label: "Build", icon: Building },
    { id: "history" as ViewType, label: "History", icon: History },
  ];

  return (
    <div className="flex justify-center p-4 border-b border-border">
      <ToggleGroup
        type="single"
        value={activeView}
        onValueChange={(value) => value && setActiveView(value as ViewType)}
        className="bg-muted rounded-lg p-1"
      >
        {pages.map((page) => {
          const Icon = page.icon;
          return (
            <ToggleGroupItem
              key={page.id}
              value={page.id}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{page.label}</span>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
};