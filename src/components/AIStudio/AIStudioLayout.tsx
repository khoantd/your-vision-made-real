import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ChatArea } from "./ChatArea";
import { StreamArea } from "./StreamArea";
import { GenerateMediaArea } from "./GenerateMediaArea";
import { BuildArea } from "./BuildArea";
import { HistoryArea } from "./HistoryArea";
import { SettingsPanel } from "./SettingsPanel";
import { StreamSettingsPanel } from "./StreamSettingsPanel";
import { GenerateMediaSettingsPanel } from "./GenerateMediaSettingsPanel";
import { useAIStudio } from "@/hooks/useAIStudio";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AIStudioLayout = () => {
  const { activeView, setActiveView } = useAIStudio();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(true);

  const renderMainArea = () => {
    switch (activeView) {
      case "stream":
        return <StreamArea />;
      case "generate-media":
        return <GenerateMediaArea />;
      case "build":
        return <BuildArea />;
      case "history":
        return <HistoryArea />;
      default:
        return <ChatArea />;
    }
  };

  const renderSettingsPanel = () => {
    switch (activeView) {
      case "stream":
        return <StreamSettingsPanel />;
      case "generate-media":
        return <GenerateMediaSettingsPanel />;
      default:
        return <SettingsPanel />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible} />
      <div className="flex-1 flex overflow-hidden">
        <div 
          className={`hidden md:block transition-all duration-300 ease-in-out ${
            sidebarVisible 
              ? 'w-64 opacity-100 translate-x-0' 
              : 'w-0 opacity-0 -translate-x-full'
          } h-full`}
        >
          <div className={`w-64 h-full ${sidebarVisible ? 'animate-slide-in-left' : 'animate-slide-out-left'}`}>
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
          </div>
        </div>
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {renderMainArea()}
          <div 
            className={`hidden lg:block transition-all duration-300 ease-in-out ${
              rightSidebarVisible 
                ? 'w-80 opacity-100 translate-x-0' 
                : 'w-0 opacity-0 translate-x-full'
            } h-full relative`}
          >
            <div className={`w-80 h-full ${rightSidebarVisible ? 'animate-slide-in-right' : 'animate-slide-out-right'}`}>
              {rightSidebarVisible && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 h-8 w-8"
                  onClick={() => setRightSidebarVisible(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {renderSettingsPanel()}
            </div>
          </div>
          {!rightSidebarVisible && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex h-8 w-8 mt-4 mr-4"
              onClick={() => setRightSidebarVisible(true)}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};