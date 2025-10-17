import { useState } from 'react'
import Dashboard from './Dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bot, Trash2, Eye, Play, Pause, MoreVertical, Calendar, Brain, Wrench } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast'

const AgentList = ({ agents, setAgents }) => {
  const { toast } = useToast()
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleDeleteAgent = (agentId) => {
    setAgents(agents.filter(agent => agent.agentId !== agentId))
    toast({
      title: "Agent Deleted",
      description: "The agent has been successfully deleted",
    })
  }

  const handleViewDetails = (agent) => {
    setSelectedAgent(agent)
    setIsDetailsOpen(true)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'PREPARED': return 'bg-green-500'
      case 'CREATING': return 'bg-yellow-500'
      case 'FAILED': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Dashboard agents={agents} />
      
      {agents.length === 0 ? (
        <Card className="glass-effect border-0 shadow-xl">
          <CardContent className="text-center py-16">
            <div className="animate-float">
              <Bot className="w-24 h-24 mx-auto mb-6 text-purple-400 opacity-60" />
            </div>
            <h3 className="text-2xl font-bold mb-3 gradient-text">No agents yet</h3>
            <p className="text-muted-foreground text-lg mb-6">
              Create your first intelligent agent to get started
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto" />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-3 px-6 py-3 glass-effect rounded-2xl shadow-xl">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold gradient-text">
                Your AI Agents
              </h2>
            </div>
          </div>
          
          <div className="symmetry-grid">
            {agents.map((agent, index) => (
              <Card key={agent.agentId} className="glass-effect border-0 shadow-xl hover-lift interactive-card animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg animate-float">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg truncate gradient-text">{agent.agentName}</h3>
                            <Badge className={`${getStatusColor(agent.status)} text-white border-0 text-xs px-2 py-1 animate-pulse`}>
                              {agent.status}
                            </Badge>
                          </div>
                          {agent.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{agent.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs px-2 py-1">
                          <Brain className="w-3 h-3 mr-1" />
                          {agent.foundationModel.split('/').pop().split('-')[0]}
                        </Badge>
                        {agent.tools.length > 0 && (
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1">
                            <Wrench className="w-3 h-3 mr-1" />
                            {agent.tools.length} tools
                          </Badge>
                        )}
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(agent.createdAt).split(',')[0]}
                        </Badge>
                      </div>

                      <div className="p-2 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 rounded-lg">
                        <p className="text-xs text-muted-foreground font-mono truncate">
                          ID: {agent.agentId}
                        </p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-all duration-200 hover:scale-110">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-effect border-0 shadow-xl">
                        <DropdownMenuItem onClick={() => handleViewDetails(agent)} className="gap-2">
                          <Eye className="w-4 h-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('switchToOutput', { detail: agent }))} className="gap-2">
                          <Play className="w-4 h-4" />
                          Run Agent
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Pause className="w-4 h-4" />
                          Pause Agent
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteAgent(agent.agentId)}
                          className="text-red-500 focus:text-red-700 gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Agent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Agent Details
            </DialogTitle>
            <DialogDescription>
              Complete configuration and settings for this agent
            </DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-4 py-4">
              <div>
                <h4 className="font-semibold mb-2">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="col-span-2 font-medium">{selectedAgent.agentName}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Agent ID:</span>
                    <span className="col-span-2 font-mono text-xs">{selectedAgent.agentId}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="col-span-2">
                      <Badge variant="outline" className={`${getStatusColor(selectedAgent.status)} text-white border-0`}>
                        {selectedAgent.status}
                      </Badge>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Instructions</h4>
                <p className="text-sm bg-muted/50 p-3 rounded-lg">{selectedAgent.instructions}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Foundation Model</h4>
                <Badge variant="secondary">{selectedAgent.foundationModel}</Badge>
              </div>

              {selectedAgent.tools.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Tools ({selectedAgent.tools.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.tools.map(tool => (
                      <Badge key={tool} variant="outline">{tool}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedAgent.actionGroups.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Action Groups ({selectedAgent.actionGroups.length})</h4>
                  <div className="space-y-2">
                    {selectedAgent.actionGroups.map(ag => (
                      <div key={ag.id} className="text-sm bg-muted/50 p-3 rounded-lg">
                        <div className="font-medium">{ag.name}</div>
                        <div className="text-muted-foreground text-xs">{ag.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedAgent.knowledgeBases.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Knowledge Bases ({selectedAgent.knowledgeBases.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.knowledgeBases.map(kb => (
                      <Badge key={kb} variant="outline">{kb}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Advanced Settings</h4>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Session Timeout:</span>
                    <span className="col-span-2">{selectedAgent.idleSessionTTL} seconds</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Session Memory:</span>
                    <span className="col-span-2">
                      {selectedAgent.memoryConfiguration.enabledMemoryTypes.includes('SESSION_SUMMARY') ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Timestamps</h4>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="col-span-2">{formatDate(selectedAgent.createdAt)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Updated:</span>
                    <span className="col-span-2">{formatDate(selectedAgent.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AgentList

