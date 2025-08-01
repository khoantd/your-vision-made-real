# AI Studio Frontend

A professional React application inspired by Google AI Studio, built with modern web technologies.

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── AIStudio/        # Main application components
│   ├── common/          # Reusable UI components
│   └── ui/              # Base UI components (shadcn)
├── constants/           # Application constants
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── pages/              # Page components
└── lib/                # Library configurations
```

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Radix UI** - Accessible components
- **Lucide React** - Icons

## 🎨 Design System

The application uses a comprehensive design system with:
- Semantic color tokens defined in `index.css`
- Consistent spacing and typography
- Dark/light mode support
- Responsive design patterns

## 🧩 Component Architecture

### Core Components
- **AIStudioLayout** - Main application layout
- **Sidebar** - Navigation component
- **Header** - Top navigation bar
- **ChatArea** - Chat interface
- **StreamArea** - Real-time streaming interface
- **GenerateMediaArea** - Media generation interface

### Common Components
- **FeatureCard** - Reusable feature display
- **ModelCard** - Model selection cards

## 🔧 Custom Hooks

- **useAIStudio** - Main application state management

## 📁 Key Features

1. **Multi-View Interface**: Chat, Stream, and Generate Media modes
2. **Professional Structure**: Scalable and maintainable codebase
3. **Type Safety**: Full TypeScript coverage
4. **Responsive Design**: Works on all device sizes
5. **Accessibility**: Built with Radix UI primitives

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## 📋 Development Guidelines

- Use semantic tokens for all colors and spacing
- Create focused, single-responsibility components
- Leverage TypeScript for type safety
- Follow the established folder structure
- Use custom hooks for state management
- Keep components under 200 lines when possible

## 🎯 Best Practices

- **Constants**: Store all static data in the `constants/` folder
- **Types**: Define interfaces in `types/index.ts`
- **Utilities**: Place helper functions in `utils/`
- **Components**: Keep components focused and reusable
- **Styling**: Use the design system tokens exclusively

This structure ensures maintainability, scalability, and ease of collaboration for frontend developers working independently.

## 🔗 Original Lovable Project

**URL**: https://lovable.dev/projects/18139064-60af-46d8-a8d4-4da006bc39cf

## 📝 Development Setup

Follow these steps to set up the development environment:

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🚀 Deployment

Deploy using [Lovable](https://lovable.dev/projects/18139064-60af-46d8-a8d4-4da006bc39cf) by clicking Share → Publish.

## 🌐 Custom Domain

Connect a custom domain via Project → Settings → Domains. [Learn more](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
