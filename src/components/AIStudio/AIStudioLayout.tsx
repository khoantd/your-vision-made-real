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
    const content = () => {
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
      <div className="relative">
        <button
          onClick={() => setRightSidebarVisible(!rightSidebarVisible)}
          className="absolute top-4 right-4 z-10 p-2 bg-background border border-border rounded-md hover:bg-muted transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {content()}
      </div>
    );
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
            } h-full`}
          >
            <div className={`w-80 h-full ${rightSidebarVisible ? 'animate-slide-in-right' : 'animate-slide-out-right'}`}>
              {renderSettingsPanel()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};