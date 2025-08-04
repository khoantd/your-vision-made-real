# OpenAI Integration

This project now includes full OpenAI API integration for the chat functionality. Here's how to use it:

## Setup

1. **Get an OpenAI API Key**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key (starts with `sk-`)

2. **Configure the API Key**
   - Open the settings panel (wrench icon in the top-right)
   - Enter your OpenAI API key in the "API Configuration" section
   - The key will be validated automatically

## Features

### Chat Interface
- **Real-time streaming**: Responses stream in real-time as they're generated
- **Message history**: All conversations are maintained in the current session
- **Error handling**: Proper error messages for API issues
- **Loading states**: Visual feedback during message processing

### Model Selection
- **GPT-4o**: Most capable model for complex tasks
- **GPT-4o Mini**: Fast and efficient for most tasks
- **GPT-4 Turbo**: Previous generation with knowledge cutoff
- **GPT-3.5 Turbo**: Fast and cost-effective

### Configuration Options
- **Temperature**: Controls randomness (0-2)
- **Max Tokens**: Maximum response length (1-8192)
- **Top P**: Controls diversity (0-1)
- **Frequency Penalty**: Reduces repetition
- **Presence Penalty**: Encourages new topics

## Usage

1. **Start a Chat**
   - Navigate to the "Chat" view in the sidebar
   - Enter your message in the text area
   - Press Enter or click "Send"

2. **Manage Conversations**
   - Use the trash icon to clear chat history
   - Messages are displayed with user/assistant avatars
   - Timestamps show when each message was sent

3. **Adjust Settings**
   - Open the settings panel to modify model parameters
   - Changes apply to new messages immediately

## Technical Details

### Architecture
- **OpenAI Service**: Handles API calls and streaming
- **Chat Hook**: Manages chat state and message handling
- **UI Components**: React components for the chat interface
- **Type Safety**: Full TypeScript support

### Security
- API keys are stored in memory only (not persisted)
- Keys are validated for proper format
- No sensitive data is logged

### Error Handling
- Network errors are caught and displayed
- Invalid API keys show appropriate warnings
- Rate limiting and quota errors are handled gracefully

## File Structure

```
src/
├── lib/
│   └── openai.ts              # OpenAI API service
├── hooks/
│   ├── useAIStudio.ts         # Main state management
│   └── useChat.ts             # Chat functionality
├── components/AIStudio/
│   ├── ChatArea.tsx           # Main chat interface
│   ├── ChatMessage.tsx        # Individual message component
│   ├── APIKeyInput.tsx        # API key input component
│   └── SettingsPanel.tsx      # Settings with API config
└── types/
    └── index.ts               # TypeScript definitions
```

## Troubleshooting

### Common Issues

1. **"Please enter your OpenAI API key"**
   - Go to settings panel and enter your API key
   - Make sure the key starts with `sk-`

2. **"Invalid API key"**
   - Check that your key is correct
   - Ensure you have sufficient credits in your OpenAI account

3. **"Rate limit exceeded"**
   - Wait a moment before sending another message
   - Consider upgrading your OpenAI plan

4. **"Network error"**
   - Check your internet connection
   - Verify OpenAI's service status

### Getting Help

- Check the browser console for detailed error messages
- Ensure your OpenAI account has sufficient credits
- Verify your API key has the correct permissions 