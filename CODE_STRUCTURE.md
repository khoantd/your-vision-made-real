# Updated Code Structure

## Project Overview

This is a **React TypeScript application** called "Your Vision Made Real" - an **AI Studio interface** similar to Google AI Studio. The project has evolved significantly and now supports multiple AI providers with a sophisticated UI.

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: React hooks with custom hooks and context
- **Routing**: React Router DOM
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Animations**: Tailwind CSS animations

## Current Architecture

### Core Structure

```
src/
├── components/
│   ├── AIStudio/          # Main AI Studio components
│   ├── common/            # Shared components
│   └── ui/               # shadcn/ui components
├── contexts/             # React Context providers
├── constants/            # App constants and configurations
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and services
├── pages/               # Route components
├── types/               # TypeScript type definitions
└── utils/               # Additional utilities
```

## Key Components

### 1. AI Studio Components (`src/components/AIStudio/`)

#### **ChatArea.tsx** (14KB, 302 lines)
- **Purpose**: Main chat interface with conversation flow
- **Features**: 
  - Welcome screen with prompt input
  - Chat conversation view with thinking process
  - Real-time message streaming
  - Clear chat functionality
  - Alert dialogs for confirmations

#### **SettingsPanel.tsx** (47KB, 1113 lines)
- **Purpose**: Comprehensive settings management
- **Features**:
  - LLM Provider selection (Google/OpenAI)
  - Model selection with provider-specific options
  - Advanced parameter controls (temperature, tokens, etc.)
  - Structured output configuration with JSON schema editor
  - Function calling setup with custom function definitions
  - Advanced settings (top P, top K, penalties, etc.)
  - Collapsible sections for better organization

#### **AIStudioLayout.tsx** (2.2KB, 68 lines)
- **Purpose**: Main layout orchestrator
- **Features**:
  - Responsive layout with collapsible sidebar
  - View switching between different AI Studio modes
  - Settings panel integration

#### **Other Components**:
- `Sidebar.tsx` - Navigation with view switching
- `Header.tsx` - Top navigation bar
- `APIKeyInput.tsx` - Secure API key input with validation
- `ChatMessage.tsx` - Individual message display
- `BuildArea.tsx` - AI model building interface
- `StreamArea.tsx` - Real-time streaming interface
- `GenerateMediaArea.tsx` - Media generation interface
- `HistoryArea.tsx` - Conversation history
- `StreamSettingsPanel.tsx` - Stream-specific settings
- `GenerateMediaSettingsPanel.tsx` - Media generation settings

### 2. State Management

#### **Hooks** (`src/hooks/`)
- **`useAIStudio.ts`** - Main application state management
  - View state (chat, stream, generate-media, build, history)
  - Provider selection (Google/OpenAI)
  - Model configurations
  - Stream and media settings

- **`useChat.ts`** - Chat functionality and OpenAI integration
  - Message state management
  - Real-time streaming
  - Error handling
  - API key validation

- **`use-mobile.tsx`** - Responsive utilities
- **`use-toast.ts`** - Notification system

#### **Context** (`src/contexts/`)
- **`AIStudioContext.tsx`** - React Context for shared state
  - Provides centralized state management
  - Ensures consistent state across components
  - Handles API key and configuration sharing

### 3. Services and Utilities

#### **OpenAI Service** (`src/lib/openai.ts`)
- **Purpose**: OpenAI API integration
- **Features**:
  - Chat completion with streaming
  - API key validation
  - Error handling
  - Request/response type safety

#### **Constants** (`src/constants/`)
- **`models.ts`** - Model configurations
  - LLM providers (Google, OpenAI)
  - Provider-specific model lists
  - Media generation models
  - Example prompts

### 4. Type System (`src/types/`)

#### **Core Types**:
- `ViewType` - Application view states
- `ModelConfig` - AI model configuration
- `StreamConfig` - Streaming settings
- `MediaGenerationConfig` - Media generation settings
- `ChatMessage` - Message structure
- `ChatState` - Chat state management
- `OpenAIConfig` - OpenAI-specific configuration

## Current Features

### 1. **Multi-Provider Support**
- **Google AI** (Gemini models)
- **OpenAI** (GPT models)
- Provider-specific model selection
- Automatic model switching based on provider

### 2. **Advanced Chat Interface**
- Real-time message streaming
- Thinking process visualization
- Message history management
- Clear chat functionality
- Error handling and user feedback

### 3. **Comprehensive Settings**
- **Provider Selection**: Switch between Google and OpenAI
- **Model Configuration**: Temperature, tokens, top P/K
- **Structured Output**: JSON schema editor with templates
- **Function Calling**: Custom function definitions
- **Advanced Parameters**: Frequency/presence penalties, stop sequences
- **System Prompts**: Custom system message configuration

### 4. **UI/UX Features**
- **Responsive Design**: Mobile-first approach
- **Collapsible Sections**: Organized settings panels
- **Real-time Validation**: API key and schema validation
- **Alert Dialogs**: Confirmation dialogs for destructive actions
- **Loading States**: Visual feedback during operations
- **Error Handling**: Comprehensive error messages

## State Management Architecture

### **Before (Issue)**:
- Each component had its own `useAIStudio()` instance
- State was isolated between components
- API key entered in SettingsPanel wasn't available in ChatArea

### **After (Fixed)**:
- **React Context** provides shared state
- All components access the same state instance
- API key and configurations are properly shared
- Real-time state updates across the application

## Configuration System

### **Model Configuration**:
```typescript
interface ModelConfig {
  name: string;
  provider: "google" | "openai";
  temperature: number;
  maxTokens: number;
  topP: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}
```

### **Provider Support**:
- **Google**: Gemini 2.0 Flash, Gemini 1.5 Pro, etc.
- **OpenAI**: GPT-4.1, O3, O4 Mini, GPT-4o, etc.

## Development Patterns

### **1. Component Composition**
- Modular component structure
- Clear separation of concerns
- Reusable UI components

### **2. Type Safety**
- Comprehensive TypeScript types
- Interface definitions for all data structures
- Type-safe state management

### **3. Error Handling**
- Try-catch blocks in async operations
- User-friendly error messages
- Graceful degradation

### **4. Performance**
- React.memo for expensive components
- useCallback for function optimization
- Efficient state updates

## File Size Analysis

### **Large Components**:
- `SettingsPanel.tsx` (47KB) - Most complex component
- `ChatArea.tsx` (14KB) - Main chat interface
- `useChat.ts` (5.4KB) - Chat logic and API integration

### **Medium Components**:
- `GenerateMediaSettingsPanel.tsx` (6.5KB)
- `BuildArea.tsx` (6.6KB)
- `StreamSettingsPanel.tsx` (6.1KB)
- `HistoryArea.tsx` (5.9KB)

## Recent Changes

### **Major Updates**:
1. **Removed Context Provider** - App.tsx no longer wraps with AIStudioProvider
2. **Updated SettingsPanel** - Complete redesign with advanced features
3. **Enhanced ChatArea** - Added thinking process visualization
4. **Improved Model Management** - Better provider and model selection
5. **Advanced Configuration** - Structured output and function calling

### **State Management**:
- Reverted to hook-based state management
- Removed context provider complexity
- Simplified component interactions

## Future Considerations

### **Potential Improvements**:
1. **Persistence**: Save settings to localStorage
2. **Multi-session**: Support multiple chat sessions
3. **Export/Import**: Configuration sharing
4. **Themes**: Dark/light mode support
5. **Accessibility**: ARIA labels and keyboard navigation

### **Performance Optimizations**:
1. **Code Splitting**: Lazy load components
2. **Memoization**: Optimize re-renders
3. **Bundle Size**: Tree shaking and optimization
4. **Caching**: API response caching

This updated structure reflects the current state of the project with its sophisticated AI Studio interface, multi-provider support, and advanced configuration capabilities. 