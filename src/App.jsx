import { useState } from 'react'
import AgentBuilder from './components/AgentBuilder'
import AgentList from './components/AgentList'
import { Bot, List, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('create')
  const [agents, setAgents] = useState([])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  AWS Bedrock Agent Builder
                </h1>
                <p className="text-sm text-muted-foreground">Create and manage intelligent AI agents</p>
              </div>
            </div>
            <nav className="flex gap-2">
              <Button
                variant={activeTab === 'create' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('create')}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Create Agent
              </Button>
              <Button
                variant={activeTab === 'manage' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('manage')}
                className="gap-2"
              >
                <List className="w-4 h-4" />
                Manage Agents
              </Button>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'create' && <AgentBuilder agents={agents} setAgents={setAgents} />}
        {activeTab === 'manage' && <AgentList agents={agents} setAgents={setAgents} />}
      </main>

      <footer className="border-t bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Built with AWS Bedrock • Powered by AI</p>
        </div>
      </footer>
    </div>
  )
}

export default App

