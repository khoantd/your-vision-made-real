import { useEffect } from 'react';
import { useAIStudio } from '@/contexts/AIStudioContext';

export const useKeyboardShortcuts = () => {
  const { setActiveView, activeView } = useAIStudio();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger shortcuts when not in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Cmd/Ctrl + key combinations
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            setActiveView('chat');
            break;
          case '2':
            event.preventDefault();
            setActiveView('stream');
            break;
          case '3':
            event.preventDefault();
            setActiveView('generate-media');
            break;
          case '4':
            event.preventDefault();
            setActiveView('build');
            break;
          case '5':
            event.preventDefault();
            setActiveView('history');
            break;
          case 'k':
            event.preventDefault();
            // Focus search bar
            const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
            }
            break;
          case 'n':
            event.preventDefault();
            // Trigger new chat
            window.dispatchEvent(new CustomEvent('newChat'));
            break;
        }
      }

      // Single key shortcuts
      if (!event.metaKey && !event.ctrlKey && !event.altKey) {
        switch (event.key) {
          case 'Escape':
            // Close any open dialogs/modals
            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            document.dispatchEvent(escapeEvent);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setActiveView]);
};

export const KeyboardShortcutsGuide = () => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Keyboard Shortcuts</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-medium mb-2">Navigation</div>
          <div className="space-y-1 text-muted-foreground">
            <div>⌘/Ctrl + 1 → Chat</div>
            <div>⌘/Ctrl + 2 → Stream</div>
            <div>⌘/Ctrl + 3 → Generate Media</div>
            <div>⌘/Ctrl + 4 → Build</div>
            <div>⌘/Ctrl + 5 → History</div>
          </div>
        </div>
        <div>
          <div className="font-medium mb-2">Actions</div>
          <div className="space-y-1 text-muted-foreground">
            <div>⌘/Ctrl + K → Search</div>
            <div>⌘/Ctrl + N → New Chat</div>
            <div>Escape → Close Modal</div>
          </div>
        </div>
      </div>
    </div>
  );
};