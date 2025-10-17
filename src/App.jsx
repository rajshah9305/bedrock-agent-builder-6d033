import { useState, useEffect } from 'react'
import AgentBuilder from './components/AgentBuilder'
import AgentList from './components/AgentList'
import AgentOutput from './components/AgentOutput'
import ErrorBoundary from './components/ErrorBoundary'
import { Bot, List, Sparkles, Zap, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('create')
  const [agents, setAgents] = useState([])
  const [selectedAgentForRun, setSelectedAgentForRun] = useState(null)

  // Listen for agent run requests from other components
  useEffect(() => {
    const handleSwitchToOutput = (event) => {
      setSelectedAgentForRun(event.detail)
      setActiveTab('output')
    }
    
    window.addEventListener('switchToOutput', handleSwitchToOutput)
    return () => window.removeEventListener('switchToOutput', handleSwitchToOutput)
  }, [])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 animate-gradient">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
      </div>

      <header className="relative border-b border-white/20 glass-effect sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse-glow" />
                <div className="relative p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg transform group-hover:scale-105 transition-all duration-300">
                  <Bot className="w-8 h-8 text-white" />
                  <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-bounce" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold gradient-text animate-shimmer">
                  RAJ AI AGENTS
                </h1>
                <p className="text-sm text-muted-foreground font-medium">Next-gen AI agent creation platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full shadow-lg animate-pulse-glow">
                <Zap className="w-4 h-4 text-white animate-bounce" />
                <span className="text-sm font-bold text-white">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="relative container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="perfect-center mb-8">
            <TabsList className="grid grid-cols-3 p-1 glass-effect rounded-2xl shadow-xl border border-white/20">
              <TabsTrigger 
                value="create" 
                className="gap-2 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:transform data-[state=active]:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                Create
              </TabsTrigger>
              <TabsTrigger 
                value="manage" 
                className="gap-2 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:transform data-[state=active]:scale-105"
              >
                <List className="w-4 h-4" />
                Manage ({agents.length})
              </TabsTrigger>
              <TabsTrigger 
                value="output" 
                className="gap-2 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:transform data-[state=active]:scale-105"
              >
                <Play className="w-4 h-4" />
                Run & Output
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="create" className="mt-0 animate-fade-in">
            <AgentBuilder agents={agents} setAgents={setAgents} />
          </TabsContent>
          
          <TabsContent value="manage" className="mt-0 animate-fade-in">
            <AgentList agents={agents} setAgents={setAgents} />
          </TabsContent>
          
          <TabsContent value="output" className="mt-0 animate-fade-in">
            <AgentOutput agents={agents} selectedAgent={selectedAgentForRun} onAgentChange={setSelectedAgentForRun} />
          </TabsContent>
        </Tabs>
      </main>
      </div>
    </ErrorBoundary>
  )
}

export default App

