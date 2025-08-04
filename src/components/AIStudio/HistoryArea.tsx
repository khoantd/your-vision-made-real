import { useState, useEffect } from "react";
import { Search, MoreHorizontal, FileText, FolderOpen, History, Sparkles, Clock, Users, Star, Filter, Download, Share2, Trash2, Edit, Copy, ArrowRight, Calendar, MessageSquare, Video, Image, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BaseLayout } from "@/components/common/BaseLayout";
import { EmptyState } from "@/components/common/EmptyState";
import { ContentCard } from "@/components/common/ContentCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAIStudio } from "@/contexts/AIStudioContext";
import { conversationService, Conversation } from "@/services/conversationService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface HistoryItem {
  id: string;
  name: string;
  description: string;
  type: "chat" | "video" | "image" | "audio" | "code";
  updated: string;
  duration?: string;
  size?: string;
  rating?: number;
  views?: number;
  isStarred?: boolean;
  isShared?: boolean;
}

const mockHistoryData: HistoryItem[] = [
  {
    id: "1",
    name: "Leadership Styles Explained",
    description: "A comprehensive guide to different leadership approaches and their effectiveness in modern organizations",
    type: "chat",
    updated: "2 days ago",
    duration: "15 min",
    rating: 4.8,
    views: 1247,
    isStarred: true
  },
  {
    id: "2",
    name: "Creative Writing Assistant",
    description: "Help with story development and character creation for novel writing",
    type: "chat",
    updated: "3 days ago",
    duration: "8 min",
    rating: 4.6,
    views: 892
  },
  {
    id: "3",
    name: "Product Marketing Video",
    description: "AI-generated video showcasing new product features",
    type: "video",
    updated: "1 week ago",
    duration: "2:30",
    size: "15.2 MB",
    rating: 4.9,
    views: 2156,
    isShared: true
  },
  {
    id: "4",
    name: "Data Analysis Helper",
    description: "Statistical analysis and visualization guidance for research projects",
    type: "chat",
    updated: "1 week ago",
    duration: "12 min",
    rating: 4.7,
    views: 1567
  },
  {
    id: "5",
    name: "Brand Logo Design",
    description: "Modern logo design with gradient effects and typography",
    type: "image",
    updated: "2 weeks ago",
    size: "2.1 MB",
    rating: 4.5,
    views: 743
  },
  {
    id: "6",
    name: "Background Music Track",
    description: "Ambient background music for video projects",
    type: "audio",
    updated: "3 weeks ago",
    duration: "3:45",
    size: "8.7 MB",
    rating: 4.4,
    views: 634
  },
  {
    id: "7",
    name: "React Component Generator",
    description: "Code generation for React components with TypeScript",
    type: "code",
    updated: "1 month ago",
    duration: "5 min",
    rating: 4.8,
    views: 987
  }
];

export const HistoryArea = () => {
  const { modelConfig, setActiveView } = useAIStudio();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [historyFilter, setHistoryFilter] = useState("my-history");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Load conversations from Supabase
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const convs = await conversationService.getConversations();
        setConversations(convs);
      } catch (error) {
        console.error('Failed to load conversations:', error);
        toast({
          title: "Error",
          description: "Failed to load conversation history",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, [user, toast]);

  // Convert conversations to history items
  const historyItems: HistoryItem[] = conversations.map(conv => ({
    id: conv.id,
    name: conv.title,
    description: conv.messages?.[0]?.content || 'No messages',
    type: "chat" as const,
    updated: formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true }),
    duration: `${conv.messages?.length || 0} messages`,
  }));

  const filteredHistory = historyItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "chat":
        return <MessageSquare className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "image":
        return <Image className="w-4 h-4" />;
      case "audio":
        return <Music className="w-4 h-4" />;
      case "code":
        return <Sparkles className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "chat":
        return "bg-gradient-to-br from-blue-500 to-blue-600";
      case "video":
        return "bg-gradient-to-br from-red-500 to-red-600";
      case "image":
        return "bg-gradient-to-br from-green-500 to-green-600";
      case "audio":
        return "bg-gradient-to-br from-purple-500 to-purple-600";
      case "code":
        return "bg-gradient-to-br from-orange-500 to-orange-600";
      default:
        return "bg-gradient-to-br from-gray-500 to-gray-600";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "chat":
        return "Chat";
      case "video":
        return "Video";
      case "image":
        return "Image";
      case "audio":
        return "Audio";
      case "code":
        return "Code";
      default:
        return "File";
    }
  };

  const handleLoadConversation = async (conversationId: string) => {
    try {
      // Switch to chat view
      setActiveView('chat');
      
      // Store the conversation ID to be loaded by ChatArea
      sessionStorage.setItem('loadConversationId', conversationId);
      
      toast({
        title: "Loading conversation",
        description: "Switching to chat view...",
      });
    } catch (error) {
      console.error('Failed to load conversation:', error);
      toast({
        title: "Error", 
        description: "Failed to load conversation",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await conversationService.deleteConversation(conversationId);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      toast({
        title: "Success",
        description: "Conversation deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
    }
  };

  const handleEditConversation = (conversationId: string, currentTitle: string) => {
    setEditingId(conversationId);
    setEditingTitle(currentTitle);
  };

  const handleSaveEdit = async (conversationId: string) => {
    try {
      await conversationService.updateConversationTitle(conversationId, editingTitle);
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId ? { ...conv, title: editingTitle } : conv
      ));
      setEditingId(null);
      setEditingTitle("");
      toast({
        title: "Success",
        description: "Conversation title updated successfully",
      });
    } catch (error) {
      console.error('Failed to update conversation:', error);
      toast({
        title: "Error",
        description: "Failed to update conversation title",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <BaseLayout 
      title="History" 
      subtitle="Your conversations and creations"
      actions={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === "grid" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
              </div>
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <div className="flex flex-col gap-0.5 w-4 h-4">
                <div className="w-full h-0.5 bg-current rounded-sm"></div>
                <div className="w-full h-0.5 bg-current rounded-sm"></div>
                <div className="w-full h-0.5 bg-current rounded-sm"></div>
              </div>
            </Button>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Open in Drive
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open in Google Drive</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      }
    >
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-border bg-gradient-to-r from-accent/5 to-accent/10">
          <div className="flex items-center gap-4">
            <Select value={historyFilter} onValueChange={setHistoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="my-history">My History</SelectItem>
                <SelectItem value="shared-history">Shared with Me</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="starred">Starred</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="flex-1 overflow-auto p-6">
          {filteredHistory.length === 0 ? (
            <EmptyState
              icon={<History className="w-12 h-12 text-muted-foreground" />}
              title="No history found"
              description={
                searchQuery 
                  ? "Try adjusting your search terms or clear the search to see all items"
                  : "Start a conversation or create media to see your history here"
              }
              action={
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery("")}
                    className="gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Clear Filters
                  </Button>
                  <Button className="bg-gradient-to-r from-brand-blue to-purple-600 hover:from-brand-blue/90 hover:to-purple-600/90 text-white gap-2">
                    <Sparkles className="w-4 h-4" />
                    Start New Chat
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              }
            />
          ) : (
            <div className="space-y-4">
              {/* Stats Bar */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{filteredHistory.length} items found</span>
                <div className="flex items-center gap-4">
                  <span>Model: {modelConfig.name}</span>
                  <span>Last updated: {filteredHistory[0]?.updated}</span>
                </div>
              </div>

              {/* Grid View */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredHistory.map((item) => (
                    <Card 
                      key={item.id}
                      className={cn(
                        "p-4 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 hover:border-brand-blue/20",
                        hoveredItem === item.id && "scale-105"
                      )}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={() => handleLoadConversation(item.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("p-2 rounded-lg", getTypeColor(item.type))}>
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-1">
                             {editingId === item.id ? (
                               <div className="flex items-center gap-2 flex-1">
                                 <Input
                                   value={editingTitle}
                                   onChange={(e) => setEditingTitle(e.target.value)}
                                   onKeyDown={(e) => {
                                     if (e.key === 'Enter') handleSaveEdit(item.id);
                                     if (e.key === 'Escape') handleCancelEdit();
                                   }}
                                   className="text-sm h-6"
                                   autoFocus
                                 />
                                 <Button size="sm" onClick={() => handleSaveEdit(item.id)} className="h-6 px-2 text-xs">Save</Button>
                                 <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-6 px-2 text-xs">Cancel</Button>
                               </div>
                             ) : (
                               <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                             )}
                             {item.isStarred && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
                             {item.isShared && <Share2 className="w-3 h-3 text-blue-500" />}
                           </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {getTypeLabel(item.type)}
                              </Badge>
                              <span>{item.duration || item.size}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{item.updated}</span>
                            </div>
                          </div>

                          {item.rating && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{item.rating}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span className="text-xs">{item.views?.toLocaleString()}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className={cn(
                        "flex items-center gap-1 mt-3 opacity-0 transition-opacity duration-200",
                        hoveredItem === item.id && "opacity-100"
                      )}>
                         <TooltipProvider>
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <Button 
                                 variant="ghost" 
                                 size="sm" 
                                 className="h-7 w-7 p-0"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handleEditConversation(item.id, item.name);
                                 }}
                               >
                                 <Edit className="w-3 h-3" />
                               </Button>
                             </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Copy className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Duplicate</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Download className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Download</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                         <TooltipProvider>
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <Button 
                                 variant="ghost" 
                                 size="sm" 
                                 className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handleDeleteConversation(item.id);
                                 }}
                               >
                                 <Trash2 className="w-3 h-3" />
                               </Button>
                             </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-2">
                  {filteredHistory.map((item) => (
                    <Card 
                      key={item.id}
                      className="p-4 cursor-pointer transition-all duration-200 hover:shadow-md border hover:border-brand-blue/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("p-2 rounded-lg", getTypeColor(item.type))}>
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{item.name}</h3>
                            {item.isStarred && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
                            {item.isShared && <Share2 className="w-3 h-3 text-blue-500" />}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Badge variant="secondary" className="text-xs">
                            {getTypeLabel(item.type)}
                          </Badge>
                          <span>{item.duration || item.size}</span>
                          <span>{item.updated}</span>
                          {item.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{item.rating}</span>
                            </div>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
};