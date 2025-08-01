import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ChatArea } from "./ChatArea";
import { SettingsPanel } from "./SettingsPanel";

export const AIStudioLayout = () => {
  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <ChatArea />
        <SettingsPanel />
      </div>
    </div>
  );
};