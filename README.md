# AWS Bedrock Agent Builder 🤖

A modern, intuitive web application for creating and managing AWS Bedrock AI agents. Built with React, Vite, and shadcn/ui components, this tool provides a visual interface for configuring intelligent AI agents powered by AWS Bedrock's foundation models.

![AWS Bedrock Agent Builder](https://img.shields.io/badge/AWS-Bedrock-FF9900?style=for-the-badge&logo=amazon-aws)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.7-38B2AC?style=for-the-badge&logo=tailwind-css)

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

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or pnpm 10+
- Git

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

3. **Start the development server**

Using pnpm:
```bash
pnpm dev
```

Using npm:
```bash
npm run dev
```

4. **Open your browser**

Navigate to `http://localhost:5173`

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

## 🔌 AWS Integration (Coming Soon)

Currently, this application uses simulated data for demonstration purposes. To connect to actual AWS Bedrock services:

1. **Set up AWS credentials** (never expose these client-side!)
2. **Create a backend API** using:
   - AWS Lambda + API Gateway
   - Vercel Serverless Functions
   - Express.js server
3. **Update API calls** in components to use real endpoints
4. **Add environment variables** for configuration

## 📝 Available Scripts

- `pnpm dev` / `npm run dev` - Start development server
- `pnpm build` / `npm run build` - Build for production
- `pnpm preview` / `npm run preview` - Preview production build
- `pnpm lint` / `npm run lint` - Run ESLint

## 🐛 Known Issues

- Currently uses simulated data (AWS integration pending)
- Session memory is not persisted (client-side only)

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

**Built with ❤️ using AWS Bedrock and React**

⭐ Star this repository if you find it helpful!
