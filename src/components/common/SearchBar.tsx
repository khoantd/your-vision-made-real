import { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, Bookmark, Hash, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'conversation' | 'setting' | 'command' | 'user';
  title: string;
  description?: string;
  timestamp?: Date;
  icon?: React.ReactNode;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  className?: string;
}

export const SearchBar = ({ 
  placeholder = "Search conversations, settings...", 
  onSearch,
  onResultSelect,
  className 
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search results - replace with actual search logic
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'conversation',
      title: 'Voice chat with GPT-4',
      description: 'Conversation about AI voice capabilities',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: <Clock className="w-4 h-4" />
    },
    {
      id: '2',
      type: 'setting',
      title: 'API Key Settings',
      description: 'Configure your OpenAI API key',
      icon: <Hash className="w-4 h-4" />
    },
    {
      id: '3',
      type: 'command',
      title: 'New Chat',
      description: 'Start a new conversation',
      icon: <User className="w-4 h-4" />
    }
  ];

  useEffect(() => {
    if (query.trim()) {
      // Filter mock results based on query
      const filtered = mockResults.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  const handleResultClick = (result: SearchResult) => {
    onResultSelect?.(result);
    setQuery('');
    setIsOpen(false);
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'conversation':
        return <Clock className="w-4 h-4" />;
      case 'setting':
        return <Hash className="w-4 h-4" />;
      case 'command':
        return <User className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: SearchResult['type']) => {
    const variants = {
      conversation: 'default',
      setting: 'secondary', 
      command: 'outline',
      user: 'secondary'
    } as const;
    
    return (
      <Badge variant={variants[type]} className="text-xs">
        {type}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp?: Date) => {
    if (!timestamp) return '';
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-accent/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all duration-200"
          onFocus={() => query && setIsOpen(true)}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-auto">
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 px-2">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </div>
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="text-muted-foreground mt-0.5">
                    {result.icon || getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">
                        {result.title}
                      </span>
                      {getTypeBadge(result.type)}
                    </div>
                    {result.description && (
                      <p className="text-xs text-muted-foreground truncate">
                        {result.description}
                      </p>
                    )}
                    {result.timestamp && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(result.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};