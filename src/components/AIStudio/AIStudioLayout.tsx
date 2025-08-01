import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ChatArea } from "./ChatArea";
import { StreamArea } from "./StreamArea";
import { SettingsPanel } from "./SettingsPanel";
import { StreamSettingsPanel } from "./StreamSettingsPanel";
import { useState } from "react";

export const AIStudioLayout = () => {
  const [activeView, setActiveView] = useState<"chat" | "stream">("chat");

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        {activeView === "chat" ? <ChatArea /> : <StreamArea />}
        {activeView === "chat" ? <SettingsPanel /> : <StreamSettingsPanel />}
      </div>
    </div>
  );
};