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
import { useAIStudio } from "@/contexts/AIStudioContext";
import { useState, useEffect } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useKeyboardShortcuts } from "@/components/common/KeyboardShortcuts";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export const AIStudioLayout = () => {
  const { activeView, setActiveView } = useAIStudio();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  // Handle view transitions with loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 150);
    return () => clearTimeout(timer);
  }, [activeView]);

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
    <ErrorBoundary>
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
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
            {/* Loading overlay for smooth transitions */}
            {isLoading && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-40 flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading..." />
              </div>
            )}
            <div className={`flex-1 transition-opacity duration-150 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              {renderMainArea()}
            </div>
            <div className="hidden lg:block">
              {renderSettingsPanel()}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};