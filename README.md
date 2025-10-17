# RAJ AI AGENTS 🤖

A production-ready, modern web application for creating and managing AWS Bedrock AI agents. Built with React 19, Vite 6, and shadcn/ui components, this tool provides a comprehensive visual interface for configuring intelligent AI agents powered by AWS Bedrock's foundation models.

[![AWS Bedrock Agent Builder](https://img.shields.io/badge/AWS-Bedrock-FF9900?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/bedrock/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.7-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Claude AI](https://img.shields.io/badge/Claude-Haiku-FF6B35?style=for-the-badge&logo=anthropic)](https://www.anthropic.com/)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rajshah9305/bedrock-agent-builder)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/rajshah9305/bedrock-agent-builder)

## ✨ Features

### Agent Creation & Configuration
- **Foundation Model Selection** - Choose from Claude 3.5, Titan, Llama, and Mistral models
- **Custom Instructions** - Define detailed agent behavior and personality
- **Tool Integration** - Add capabilities like code execution, web search, and file processing
- **Action Groups** - Configure custom API integrations via Lambda functions
- **Knowledge Bases** - Connect to vector stores for domain-specific information

### Agent Management
- **Visual Dashboard** - View and manage all your AI agents in one place
- **Detailed Agent Views** - Inspect complete agent configurations
- **Status Monitoring** - Track agent deployment status
- **Quick Actions** - Test, pause, or delete agents with one click

### Modern UI/UX
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support** - Automatic theme detection
- **Smooth Animations** - Polished user experience with Framer Motion
- **Intuitive Interface** - Step-by-step agent creation workflow

### 🤖 AI-Powered Code Analysis
- **Claude Haiku Integration** - Automated code error detection and analysis
- **Real-time Analysis** - File watching with instant feedback
- **CI/CD Integration** - GitHub Actions workflow for automated quality checks
- **Security Scanning** - Vulnerability detection and security recommendations
- **Performance Optimization** - Code efficiency analysis and suggestions

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (recommended: Node.js 20+)
- **pnpm 10+** (recommended) or **npm 9+**
- **Git**
- **AWS Account** (for production use)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rajshah9305/bedrock-agent-builder.git
cd bedrock-agent-builder
```

2. **Install dependencies**

Using pnpm (recommended):
```bash
pnpm install
```

Using npm:
```bash
npm install
```

3. **Environment Setup**

Copy the environment template:
```bash
cp env.example .env
```

Edit `.env` with your configuration:
```env
# AWS Bedrock Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_REGION=us-east-1

# Claude Model Configuration
CLAUDE_MODEL_ID=anthropic.claude-3-5-haiku-20241022-v2:0
CLAUDE_MAX_TOKENS=4000
CLAUDE_TEMPERATURE=0.1

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:3001/api
```

4. **Start the development servers**

**Option A: Full Stack (Recommended)**
```bash
# Using pnpm
pnpm dev:full

# Using npm
npm run dev:full
```

**Option B: Separate Terminals**
```bash
# Terminal 1 - Backend
pnpm server

# Terminal 2 - Frontend
pnpm dev
```

5. **Open your browser**

Navigate to `http://localhost:5173`

### 🎯 First Run

1. **Simulation Mode**: The app runs in simulation mode by default (no AWS credentials required)
2. **Create Your First Agent**: Use the "Create" tab to build your first AI agent
3. **Test Agent**: Switch to "Run & Output" tab to test your agent
4. **Manage Agents**: Use the "Manage" tab to view and manage all your agents

## 📦 Build for Production

```bash
# Using pnpm
pnpm build

# Using npm
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
# Using pnpm
pnpm preview

# Using npm
npm run preview
```

## 🌐 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rajshah9305/bedrock-agent-builder)

Or manually:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/rajshah9305/bedrock-agent-builder)

### Deploy to Other Platforms

This is a standard Vite app and can be deployed to any static hosting service:
- AWS S3 + CloudFront
- GitHub Pages
- Cloudflare Pages
- Azure Static Web Apps

## 🛠️ Tech Stack

### Core
- **React 19** - UI framework
- **Vite 6** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework

### UI Components
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Animation library

### Form & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Additional Libraries
- **date-fns** - Date manipulation
- **Recharts** - Data visualization
- **Sonner** - Toast notifications

## 📁 Project Structure

```
bedrock-agent-builder/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── AgentBuilder.jsx # Main agent creation interface
│   │   ├── AgentList.jsx    # Agent management dashboard
│   │   ├── ModelSelector.jsx
│   │   ├── ToolSelector.jsx
│   │   ├── ActionGroupBuilder.jsx
│   │   └── KnowledgeBaseSelector.jsx
│   ├── hooks/
│   │   ├── use-toast.js     # Toast notification hook
│   │   └── use-mobile.js    # Responsive design hook
│   ├── lib/
│   │   └── utils.js         # Utility functions
│   ├── App.jsx              # Main application component
│   ├── App.css              # Global styles
│   └── main.jsx             # Application entry point
├── scripts/                 # Claude analysis scripts
│   ├── claude-code-analyzer.js    # Full codebase analysis
│   ├── claude-ci-analyzer.js      # CI/CD analysis
│   ├── claude-watch-analyzer.js   # File watcher
│   └── setup-claude-analysis.js   # Setup script
├── .github/workflows/       # GitHub Actions
│   └── claude-code-analysis.yml   # Automated analysis workflow
├── server.js                # Express.js backend with Claude integration
├── public/                  # Static assets
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── vercel.json             # Vercel deployment config
└── package.json            # Dependencies and scripts
```

## 🎨 Customization

### Adding New Foundation Models

Edit `src/components/AgentBuilder.jsx` in the `fetchAvailableModels` function:

```javascript
const models = [
  {
    id: 'your-model-id',
    name: 'Your Model Name',
    provider: 'Provider Name',
    description: 'Model description',
    optimizedForAgents: true,
    capabilities: ['text', 'vision', 'tool-use']
  },
  // ... existing models
]
```

### Adding New Tools

Edit `src/components/AgentBuilder.jsx` in the `fetchAvailableTools` function:

```javascript
const tools = [
  {
    id: 'your_tool_id',
    name: 'Tool Name',
    description: 'What this tool does',
    icon: '🔧'
  },
  // ... existing tools
]
```

### Customizing Theme Colors

Edit `src/App.css` to modify the color palette:

```css
:root {
  --primary: oklch(0.205 0 0);
  --background: oklch(1 0 0);
  /* ... other color variables */
}
```

## 🔌 AWS Integration

This application includes full AWS Bedrock integration with Claude Haiku for code analysis:

### Backend API
- **Express.js Server** - Full REST API for AWS Bedrock integration
- **Agent Management** - Create, list, and manage Bedrock agents
- **Model Access** - List available foundation models
- **Claude Analysis** - AI-powered code analysis endpoints

### Setup AWS Credentials
1. Create a `.env` file with your AWS credentials:
   ```env
   AWS_ACCESS_KEY_ID=your_access_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_key_here
   AWS_REGION=us-east-1
   ```

2. Request model access in AWS Bedrock Console:
   - Claude 3.5 Haiku: `anthropic.claude-3-5-haiku-20241022-v2:0`
   - Claude 3 Haiku: `anthropic.claude-3-haiku-20240307-v1:0`

3. Start the server:
   ```bash
   npm run server
   ```

## 📝 Available Scripts

### Development
- `pnpm dev` / `npm run dev` - Start development server
- `pnpm build` / `npm run build` - Build for production
- `pnpm preview` / `npm run preview` - Preview production build
- `pnpm lint` / `npm run lint` - Run ESLint

### Claude Code Analysis
- `npm run analyze` - Full codebase analysis with Claude Haiku
- `npm run analyze:ci` - Quick CI/CD optimized analysis
- `npm run analyze:watch` - Real-time file watching and analysis

## 🐛 Known Issues

- Session memory is not persisted (client-side only)
- Claude analysis requires AWS Bedrock model access

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Raj Shah**
- GitHub: [@rajshah9305](https://github.com/rajshah9305)

## 🙏 Acknowledgments

- AWS Bedrock team for the amazing AI platform
- shadcn for the beautiful UI components
- The React and Vite communities

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the maintainer

---

**Built with ❤️ using AWS Bedrock, Claude Haiku, and React**

⭐ Star this repository if you find it helpful!
