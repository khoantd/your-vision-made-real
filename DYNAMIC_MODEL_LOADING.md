# Dynamic Model Loading Feature

## 🎯 **Overview**

The dynamic model loading feature automatically loads available models when an LLM provider is selected and a valid API key is entered. This provides a more intelligent and user-friendly experience.

## ✨ **Key Features**

### **1. Automatic Model Loading**
- Models are loaded automatically when a provider is selected
- API key validation happens in real-time
- Models are filtered based on provider capabilities

### **2. Multi-Provider Support**
- **OpenAI**: Loads models like GPT-4o, GPT-4o Mini, GPT-4 Turbo, GPT-3.5 Turbo
- **Google**: Loads models like Gemini 2.0 Flash, Gemini 1.5 Pro, Gemini 1.5 Flash

### **3. Smart API Key Management**
- Separate API keys for each provider
- Real-time validation of API key format
- Automatic model loading when valid API key is entered

### **4. Rich Model Information**
- Model descriptions and capabilities
- Pricing information
- Token limits and features
- Expandable details for each model

## 🔧 **Technical Implementation**

### **Core Components**

#### **1. useModelLoader Hook**
```typescript
// src/hooks/useModelLoader.ts
export const useModelLoader = () => {
  // Loads models based on provider and API key
  // Validates API keys
  // Manages loading states and errors
}
```

#### **2. DynamicModelSelector Component**
```typescript
// src/components/AIStudio/DynamicModelSelector.tsx
export const DynamicModelSelector = ({
  provider,
  selectedModel,
  onModelChange
}) => {
  // Displays available models for the provider
  // Shows model details and pricing
  // Handles model selection
}
```

#### **3. Enhanced APIKeyInput**
```typescript
// src/components/AIStudio/APIKeyInput.tsx
export const APIKeyInput = ({ provider }) => {
  // Provider-specific validation
  // Real-time format checking
  // Secure input with show/hide
}
```

### **State Management**

#### **Context Updates**
```typescript
// src/contexts/AIStudioContext.tsx
interface AIStudioContextType {
  apiKeys: {
    openai: string;
    google: string;
  };
  updateApiKey: (provider: "openai" | "google", key: string) => void;
}
```

## 🚀 **User Experience Flow**

### **Step 1: Select Provider**
1. User selects "OpenAI" or "Google" from provider dropdown
2. System automatically loads models for that provider

### **Step 2: Enter API Key**
1. User enters API key in the appropriate input field
2. Real-time validation checks format (sk- for OpenAI, AIza for Google)
3. If valid, models are automatically loaded

### **Step 3: Choose Model**
1. Available models are displayed with details
2. User can expand model cards to see capabilities and pricing
3. Click to select a model

### **Step 4: Start Chatting**
1. Selected model is used for chat
2. API key is automatically used for the correct provider

## 📊 **Model Information Display**

### **Model Cards Include:**
- ✅ **Model Name** (e.g., "GPT-4o", "Gemini 2.0 Flash")
- ✅ **Description** (e.g., "Most capable model for complex tasks")
- ✅ **Capabilities** (text, vision, function-calling)
- ✅ **Max Tokens** (e.g., 128,000 for GPT-4o)
- ✅ **Pricing** (input/output costs per 1M tokens)
- ✅ **Selection Status** (visual indicator when selected)

### **Status Indicators:**
- 🔄 **Loading**: Models are being fetched
- ✅ **Success**: Models loaded successfully
- ❌ **Error**: API key invalid or network error
- ⚠️ **No Key**: API key not entered

## 🎨 **UI/UX Features**

### **Visual Feedback**
- Loading spinners during model fetch
- Color-coded status alerts
- Hover effects on model cards
- Selected model highlighting

### **Error Handling**
- Clear error messages for invalid API keys
- Retry buttons for failed requests
- Graceful fallbacks when models can't be loaded

### **Accessibility**
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly

## 🔄 **Auto-Loading Logic**

```typescript
// Automatic model loading when provider or API key changes
useEffect(() => {
  autoLoadModels(provider, apiKey);
}, [provider, apiKey, autoLoadModels]);
```

### **Triggers:**
1. **Provider Change**: Load models for new provider
2. **API Key Entry**: Validate and load models
3. **API Key Update**: Re-validate and reload models

## 🛡️ **Security & Validation**

### **API Key Validation**
- **OpenAI**: Must start with "sk-" and be >20 characters
- **Google**: Must start with "AIza" and be >20 characters
- Real-time format checking
- Secure input with show/hide functionality

### **Error Prevention**
- Invalid API keys don't trigger model loading
- Clear error messages guide users
- Graceful degradation when API is unavailable

## 📈 **Performance Optimizations**

### **Caching**
- Models are cached per provider
- No unnecessary re-fetching
- Efficient state updates

### **Loading States**
- Skeleton loading for model cards
- Progressive disclosure of model details
- Non-blocking UI during API calls

## 🧪 **Testing Scenarios**

### **Happy Path**
1. Select OpenAI provider
2. Enter valid OpenAI API key
3. Models load automatically
4. Select a model
5. Start chatting

### **Error Scenarios**
1. Enter invalid API key → Show error message
2. Network failure → Show retry option
3. No API key → Show guidance message

### **Provider Switching**
1. Switch from OpenAI to Google
2. Models update automatically
3. API key validation switches to Google format

## 🎯 **Benefits**

### **For Users:**
- ✅ **No Manual Configuration**: Models load automatically
- ✅ **Real-time Feedback**: Immediate validation and status updates
- ✅ **Rich Information**: Detailed model capabilities and pricing
- ✅ **Multi-Provider**: Easy switching between OpenAI and Google
- ✅ **Error Prevention**: Clear guidance for API key setup

### **For Developers:**
- ✅ **Modular Design**: Easy to add new providers
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Reusable Components**: Model selector can be used elsewhere
- ✅ **Extensible**: Easy to add more model information

This dynamic model loading system provides a seamless, intelligent experience that automatically adapts to user choices and provides rich, contextual information about available models. 