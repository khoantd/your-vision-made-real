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
          }`}
        >
          <div className={`w-64 ${sidebarVisible ? 'animate-slide-in-left' : 'animate-slide-out-left'}`}>
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
          </div>
        </div>
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {renderMainArea()}
          <div className="hidden lg:block">
            {renderSettingsPanel()}
          </div>
        </div>
      </div>
    </div>
  );
};